using Microsoft.AspNetCore.Mvc;
using AgriTrackAPI.Services;
using AgriTrackAPI.DTOs;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OTPController : ControllerBase
    {
        private readonly IOTPService _otpService;

        public OTPController(IOTPService otpService)
        {
            _otpService = otpService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendOTP([FromBody] SendOtpRequest request)
        {
            try
            {
                await _otpService.GenerateOTPAsync(request.Email, request.Purpose);
                return Ok(new { message = "OTP sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send OTP", error = ex.Message });
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOTP([FromBody] VerifyOtpRequest request)
        {
            var isValid = await _otpService.VerifyOTPAsync(request.Email, request.OTPCode, request.Purpose);

            if (!isValid)
                return BadRequest(new { message = "Invalid or expired OTP" });

            return Ok(new { message = "OTP verified successfully" });
        }

        [HttpPost("resend")]
        public async Task<IActionResult> ResendOTP([FromBody] ResendOtpRequest request)
        {
            try
            {
                await _otpService.GenerateOTPAsync(request.Email, request.Purpose);
                return Ok(new { message = "New OTP sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to resend OTP", error = ex.Message });
            }
        }
    }

    // Request models specific to OTP controller
    public class SendOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Purpose { get; set; } = "Login";
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string OTPCode { get; set; } = string.Empty;
        public string Purpose { get; set; } = "Login";
    }

    public class ResendOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Purpose { get; set; } = "Login";
    }
}