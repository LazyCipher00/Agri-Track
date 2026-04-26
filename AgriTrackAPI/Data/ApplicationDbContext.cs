using Microsoft.EntityFrameworkCore;
using AgriTrackAPI.Models;

namespace AgriTrackAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Crop> Crops { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<HealthLog> HealthLogs { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<OTPRecord> OTPRecords { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tell EF to map Inventory model to "Inventory" table (singular)
            modelBuilder.Entity<Inventory>().ToTable("Inventory");

            // Configure unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure relationships
            modelBuilder.Entity<Crop>()
                .HasOne(c => c.User)
                .WithMany(u => u.Crops)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Crop)
                .WithMany(c => c.Activities)
                .HasForeignKey(a => a.CropId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthLog>()
                .HasOne(h => h.Crop)
                .WithMany(c => c.HealthLogs)
                .HasForeignKey(h => h.CropId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Inventory>()
                .HasOne(i => i.User)
                .WithMany(u => u.Inventories)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Sale>()
                .HasOne(s => s.User)
                .WithMany(u => u.Sales)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}