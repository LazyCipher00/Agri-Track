namespace AgriTrackAPI.Services
{
    public class OTPCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OTPCleanupService> _logger;

        public OTPCleanupService(IServiceProvider serviceProvider, ILogger<OTPCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var otpService = scope.ServiceProvider.GetRequiredService<IOTPService>();

                    await otpService.CleanupExpiredOTPsAsync();
                    _logger.LogInformation("OTP cleanup completed at {Time}", DateTime.UtcNow);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during OTP cleanup");
                }

                // Run every hour
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}