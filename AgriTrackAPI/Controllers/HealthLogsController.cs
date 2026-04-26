using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriTrackAPI.Data;
using AgriTrackAPI.DTOs;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HealthLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthLogs()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var healthLogs = await _context.HealthLogs
                .Include(h => h.Crop)
                .Where(h => h.Crop.UserId == userId)
                .OrderByDescending(h => h.LogDate)
                .Select(h => new HealthLogDto(h))
                .ToListAsync();

            return Ok(healthLogs);
        }

        [HttpGet("crop/{cropId}")]
        public async Task<IActionResult> GetHealthLogsByCrop(int cropId)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var healthLogs = await _context.HealthLogs
                .Include(h => h.Crop)
                .Where(h => h.CropId == cropId && h.Crop.UserId == userId)
                .OrderByDescending(h => h.LogDate)
                .Select(h => new HealthLogDto(h))
                .ToListAsync();

            return Ok(healthLogs);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthLog(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var healthLog = await _context.HealthLogs
                .Include(h => h.Crop)
                .FirstOrDefaultAsync(h => h.Id == id && h.Crop.UserId == userId);

            if (healthLog == null)
                return NotFound(new { message = "Health log not found" });

            _context.HealthLogs.Remove(healthLog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Health log deleted successfully" });
        }
    }
}