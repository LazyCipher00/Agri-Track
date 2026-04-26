using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AgriTrackAPI.Data;
using AgriTrackAPI.Models;
using AgriTrackAPI.Services;
using AgriTrackAPI.DTOs;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IOTPService _otpService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, IOTPService otpService)
        {
            _context = context;
            _configuration = configuration;
            _otpService = otpService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(registerDto.Email) || string.IsNullOrWhiteSpace(registerDto.Password))
                return BadRequest(new { message = "Email and password are required" });

            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest(new { message = "Email already registered" });

            try
            {
                var user = new User
                {
                    FullName = registerDto.FullName,
                    Email = registerDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    FarmName = registerDto.FarmName,
                    Role = "Farmer",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Log audit
                await LogAuditAsync(user.Id, "Create", "User", user.Id, "User registration");

                var token = GenerateJwtToken(user);
                return Ok(new { token, user = new UserDto(user) });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            if (!user.IsActive)
                return Unauthorized(new { message = "Account is deactivated" });

            // Check if admin requires OTP
            if (user.Role == "Admin" && !loginDto.SkipOTP)
            {
                // Generate and send OTP
                await _otpService.GenerateOTPAsync(user.Email, "Login");
                return Ok(new { requiresOTP = true, email = user.Email });
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await LogAuditAsync(user.Id, "Login", "User", user.Id, $"User login - {user.Email}");

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new UserDto(user) });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOTP([FromBody] VerifyOtpDto verifyDto)
        {
            var isValid = await _otpService.VerifyOTPAsync(verifyDto.Email, verifyDto.OTPCode, "Login");

            if (!isValid)
                return BadRequest(new { message = "Invalid or expired OTP" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == verifyDto.Email);

            if (user == null)
                return NotFound(new { message = "User not found" });

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await LogAuditAsync(user.Id, "Login", "User", user.Id, $"Admin login with OTP - {user.Email}");

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new UserDto(user) });
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto requestDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == requestDto.Email);

            if (user == null)
                return Ok(new { message = "If the email exists, a reset code has been sent" });

            await _otpService.GenerateOTPAsync(user.Email, "PasswordReset");
            return Ok(new { message = "Reset code sent to your email" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetDto)
        {
            var isValid = await _otpService.VerifyOTPAsync(resetDto.Email, resetDto.OTPCode, "PasswordReset");

            if (!isValid)
                return BadRequest(new { message = "Invalid or expired reset code" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resetDto.Email);

            if (user == null)
                return NotFound(new { message = "User not found" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await LogAuditAsync(user.Id, "Update", "User", user.Id, "Password reset");

            return Ok(new { message = "Password reset successfully" });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpiryMinutes"])),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private async Task LogAuditAsync(int? userId, string action, string entityType, int? entityId, string details)
        {
            var auditLog = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details,
                IPAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }
}