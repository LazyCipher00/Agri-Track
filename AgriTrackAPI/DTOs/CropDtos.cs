using AgriTrackAPI.Models;

namespace AgriTrackAPI.DTOs
{
    public class CropDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CropType { get; set; } = string.Empty;
        public string PlotName { get; set; } = string.Empty;
        public DateTime PlantingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public CropDto() { }

        public CropDto(Crop crop)
        {
            Id = crop.Id;
            UserId = crop.UserId;
            CropType = crop.CropType;
            PlotName = crop.PlotName;
            PlantingDate = crop.PlantingDate;
            Status = crop.Status;
            CreatedAt = crop.CreatedAt;
        }
    }

    public class CropDetailDto : CropDto
    {
        public List<ActivityDto> Activities { get; set; } = new();
        public List<HealthLogDto> HealthLogs { get; set; } = new();
        public HealthLogDto? LatestHealth { get; set; }

        public CropDetailDto() : base() { }

        public CropDetailDto(Crop crop) : base(crop)
        {
            if (crop.HealthLogs != null && crop.HealthLogs.Any())
            {
                LatestHealth = crop.HealthLogs
                    .OrderByDescending(h => h.LogDate)
                    .Select(h => new HealthLogDto(h))
                    .FirstOrDefault();
            }
        }
    }

    public class CreateCropDto
    {
        public string CropType { get; set; } = string.Empty;
        public string PlotName { get; set; } = string.Empty;
        public DateTime PlantingDate { get; set; }
    }

    public class UpdateCropDto
    {
        public string Status { get; set; } = string.Empty;
    }
}