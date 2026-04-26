using AgriTrackAPI.Models;

namespace AgriTrackAPI.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FarmName { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public UserDto() { }

        public UserDto(User user)
        {
            Id = user.Id;
            FullName = user.FullName;
            Email = user.Email;
            FarmName = user.FarmName;
            Role = user.Role;
            CreatedAt = user.CreatedAt;
        }
    }

    public class UserDetailDto : UserDto
    {
        public bool IsActive { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int CropCount { get; set; }
        public decimal SalesTotal { get; set; }
        public List<CropDto> RecentCrops { get; set; } = new();

        public UserDetailDto() : base() { }

        public UserDetailDto(User user) : base(user)
        {
            IsActive = user.IsActive;
            LastLoginAt = user.LastLoginAt;
        }
    }
}