namespace PtApp.Application.Common.Interfaces;

public interface IOtpService
{
    string GenerateOtp();
    Task SendOtpAsync(string phoneNumber, string code);
}
