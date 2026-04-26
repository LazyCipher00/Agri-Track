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
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var crops = await _context.Crops
                .Where(c => c.UserId == userId)
                .ToListAsync();

            var inventory = await _context.Inventories
                .Where(i => i.UserId == userId)
                .ToListAsync();

            var sales = await _context.Sales
                .Where(s => s.UserId == userId)
                .ToListAsync();

            var stats = new
            {
                TotalCrops = crops.Count,
                ActiveCrops = crops.Count(c => c.Status != "Harvested"),
                HarvestedCrops = crops.Count(c => c.Status == "Harvested"),
                TotalStock = inventory.Sum(i => i.TotalQuantity - i.SoldQuantity),
                TotalRevenue = sales.Sum(s => s.TotalAmount),
                CropHealth = new
                {
                    Healthy = await _context.HealthLogs
                        .Include(h => h.Crop)
                        .Where(h => h.Crop.UserId == userId)
                        .GroupBy(h => h.CropId)
                        .Select(g => g.OrderByDescending(h => h.LogDate).FirstOrDefault())
                        .CountAsync(h => h != null && h.HealthStatus == "Healthy"),
                    PestInfected = await _context.HealthLogs
                        .Include(h => h.Crop)
                        .Where(h => h.Crop.UserId == userId)
                        .GroupBy(h => h.CropId)
                        .Select(g => g.OrderByDescending(h => h.LogDate).FirstOrDefault())
                        .CountAsync(h => h != null && h.HealthStatus == "Pest-infected"),
                    Diseased = await _context.HealthLogs
                        .Include(h => h.Crop)
                        .Where(h => h.Crop.UserId == userId)
                        .GroupBy(h => h.CropId)
                        .Select(g => g.OrderByDescending(h => h.LogDate).FirstOrDefault())
                        .CountAsync(h => h != null && h.HealthStatus == "Diseased")
                }
            };

            return Ok(stats);
        }

        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities([FromQuery] int limit = 10)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var activities = await _context.Activities
                .Include(a => a.Crop)
                .Where(a => a.Crop.UserId == userId)
                .OrderByDescending(a => a.ActivityDate)
                .Take(limit)
                .Select(a => new ActivityDto(a))
                .ToListAsync();

            return Ok(activities);
        }

        [HttpGet("inventory-summary")]
        public async Task<IActionResult> GetInventorySummary()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var inventory = await _context.Inventories
                .Where(i => i.UserId == userId)
                .Select(i => new InventoryDto(i))
                .ToListAsync();

            return Ok(inventory);
        }
    }
}