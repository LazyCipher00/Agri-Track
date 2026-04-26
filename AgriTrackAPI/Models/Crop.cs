using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgriTrackAPI.Models
{
    public class Crop
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string CropType { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string PlotName { get; set; } = string.Empty;

        [Required]
        public DateTime PlantingDate { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Planted"; // Planted, Growing, Ready for harvest, Harvested

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public virtual ICollection<HealthLog> HealthLogs { get; set; } = new List<HealthLog>();
    }
}