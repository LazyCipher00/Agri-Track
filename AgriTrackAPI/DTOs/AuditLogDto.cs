using AgriTrackAPI.Models;

namespace AgriTrackAPI.DTOs
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public int? EntityId { get; set; }
        public string? Details { get; set; }
        public string? IPAddress { get; set; }
        public DateTime CreatedAt { get; set; }

        public AuditLogDto(AuditLog log)
        {
            Id = log.Id;
            UserId = log.UserId;
            UserName = log.User?.FullName ?? "System";
            Action = log.Action;
            EntityType = log.EntityType;
            EntityId = log.EntityId;
            Details = log.Details;
            IPAddress = log.IPAddress;
            CreatedAt = log.CreatedAt;
        }

        public AuditLogDto() { }
    }
}