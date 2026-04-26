using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriTrackAPI.Data;
using AgriTrackAPI.Models;
using AgriTrackAPI.DTOs;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActivitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActivitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var activities = await _context.Activities
                .Include(a => a.Crop)
                .Where(a => a.Crop.UserId == userId)
              //  .OrderByDescending(a => a.ActivityDate)
                .Select(a => new ActivityDto(a))
                .ToListAsync();

            return Ok(activities);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

            var activity = await _context.Activities
                .Include(a => a.Crop)
                .FirstOrDefaultAsync(a => a.Id == id && a.Crop.UserId == userId);

            if (activity == null)
                return NotFound(new { message = "Activity not found" });

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Activity deleted successfully" });
        }
    }
}