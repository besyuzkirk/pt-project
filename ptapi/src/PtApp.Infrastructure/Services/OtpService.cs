using Microsoft.Extensions.Logging;
using PtApp.Application.Common.Interfaces;

namespace PtApp.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly ILogger<OtpService> _logger;

    public OtpService(ILogger<OtpService> logger)
    {
        _logger = logger;
    }

    public string GenerateOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    public Task SendOtpAsync(string phoneNumber, string code)
    {
        // Mock SMS sending - Write to logs/console
        _logger.LogInformation("==================================================");
        _logger.LogInformation("SMS GÖNDERİLİYOR:");
        _logger.LogInformation("Alıcı: {PhoneNumber}", phoneNumber);
        _logger.LogInformation("Kod: {Code}", code);
        _logger.LogInformation("==================================================");

        return Task.CompletedTask;
    }
}
