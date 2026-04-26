using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AgriTrackAPI.Data;
using AgriTrackAPI.Models;

namespace AgriTrackAPI.Services
{
    public interface IOTPService
    {
        Task<string> GenerateOTPAsync(string email, string purpose);
        Task<bool> VerifyOTPAsync(string email, string otpCode, string purpose);
        Task CleanupExpiredOTPsAsync();
    }

    public class OTPService : IOTPService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<OTPService> _logger;
        private readonly Random _random = new();

        public OTPService(ApplicationDbContext context, IEmailService emailService, ILogger<OTPService> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<string> GenerateOTPAsync(string email, string purpose)
        {
            // Generate 6-digit OTP
            var otpCode = _random.Next(100000, 999999).ToString();

            // Save to database
            var otpRecord = new OTPRecord
            {
                Email = email,
                OTPCode = otpCode,
                Purpose = purpose,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };

            _context.OTPRecords.Add(otpRecord);
            await _context.SaveChangesAsync();

            // Send email
            var emailSent = await _emailService.SendOTPEmailAsync(email, otpCode);
            
            if (!emailSent)
            {
                _logger.LogWarning("Failed to send OTP email to {Email}. OTP was generated but not delivered.", email);
                // We don't throw - OTP is still valid if user can get it another way
            }

            return otpCode;
        }

        public async Task<bool> VerifyOTPAsync(string email, string otpCode, string purpose)
        {
            var otpRecord = await _context.OTPRecords
                .Where(o => o.Email == email
                    && o.OTPCode == otpCode
                    && o.Purpose == purpose
                    && !o.IsUsed
                    && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                return false;

            // Mark as used
            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task CleanupExpiredOTPsAsync()
        {
            var expiredOTPs = await _context.OTPRecords
                .Where(o => o.ExpiresAt < DateTime.UtcNow.AddDays(-1))
                .ToListAsync();

            if (expiredOTPs.Any())
            {
                _context.OTPRecords.RemoveRange(expiredOTPs);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Cleaned up {Count} expired OTP records", expiredOTPs.Count);
            }
        }
    }
}