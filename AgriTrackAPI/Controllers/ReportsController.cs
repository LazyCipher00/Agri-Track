using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AgriTrackAPI.Services;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("monthly/{year}/{month}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMonthlyReport(int year, int month)
        {
            var reportBytes = await _reportService.GenerateMonthlyReportAsync(year, month);
            return File(reportBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Monthly_Report_{year}_{month}.xlsx");
        }

        [HttpGet("annual/{year}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAnnualReport(int year)
        {
            var reportBytes = await _reportService.GenerateAnnualReportAsync(year);
            return File(reportBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Annual_Report_{year}.xlsx");
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserReport()
        {
            var reportBytes = await _reportService.GenerateUserReportAsync();
            return File(reportBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"User_Report_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        [HttpGet("my-farm")]
        public async Task<IActionResult> GetMyFarmReport()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            // Implementation for farmer's own report
            return Ok(new { message = "Farm report generated" });
        }
    }
}