using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriTrackAPI.Data;

namespace AgriTrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
        }

        [HttpGet("database")]
        public async Task<IActionResult> CheckDatabase()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var userCount = await _context.Users.CountAsync();
                return Ok(new { 
                    database = canConnect ? "Connected" : "Disconnected", 
                    userCount = userCount,
                    timestamp = DateTime.UtcNow 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { database = "Error", error = ex.Message });
            }
        }

        [HttpGet("debug")]
        public async Task<IActionResult> Debug()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var userCount = await _context.Users.CountAsync();
                var users = await _context.Users.Select(u => new { u.Id, u.Email, u.FullName, u.Role, u.IsActive }).ToListAsync();
                
                return Ok(new { 
                    apiStatus = "Running",
                    database = canConnect ? "Connected" : "Disconnected",
                    userCount = userCount,
                    users = users,
                    timestamp = DateTime.UtcNow 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
}