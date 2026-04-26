using AgriTrackAPI.Models;

namespace AgriTrackAPI.DTOs
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public int CropId { get; set; }
        public string CropName { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }

        public ActivityDto(Activity activity)
        {
            Id = activity.Id;
            CropId = activity.CropId;
            CropName = activity.Crop?.CropType ?? string.Empty;
            ActivityType = activity.ActivityType;
            ActivityDate = activity.ActivityDate;
            Notes = activity.Notes;
            CreatedAt = activity.CreatedAt;
        }

        public ActivityDto() { }
    }

    public class CreateActivityDto
    {
        public string ActivityType { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; }
        public string? Notes { get; set; }
    }

    public class HealthLogDto
    {
        public int Id { get; set; }
        public int CropId { get; set; }
        public string HealthStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime LogDate { get; set; }

        public HealthLogDto(HealthLog healthLog)
        {
            Id = healthLog.Id;
            CropId = healthLog.CropId;
            HealthStatus = healthLog.HealthStatus;
            Notes = healthLog.Notes;
            LogDate = healthLog.LogDate;
        }

        public HealthLogDto() { }
    }

    public class CreateHealthLogDto
    {
        public string HealthStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime LogDate { get; set; }
    }
}