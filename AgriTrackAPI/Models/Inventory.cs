using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgriTrackAPI.Models
{
    [Table("Inventory")]  // ← ADD THIS LINE - tells EF to use "Inventory" not "Inventories"
    public class Inventory
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
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalQuantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal SoldQuantity { get; set; }

        [Required]
        [MaxLength(20)]
        public string Unit { get; set; } = "kg";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}