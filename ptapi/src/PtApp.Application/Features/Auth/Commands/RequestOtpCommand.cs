using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;

namespace PtApp.Application.Features.Auth.Commands;

public record RequestOtpCommand(string PhoneNumber) : IRequest<string>;

public class RequestOtpCommandHandler : IRequestHandler<RequestOtpCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IOtpService _otpService;

    public RequestOtpCommandHandler(UserManager<AppUser> userManager, IOtpService otpService)
    {
        _userManager = userManager;
        _otpService = otpService;
    }

    public async Task<string> Handle(RequestOtpCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine($"OTP İsteği: '{request.PhoneNumber}' numarası aranıyor...");
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber.Trim(), cancellationToken);
        
        if (user == null)
        {
            Console.WriteLine($"HATA: '{request.PhoneNumber}' numaralı kullanıcı bulunamadı!");
            throw new Exception("Kullanıcı bulunamadı.");
        }

        var otpCode = _otpService.GenerateOtp();
        user.OtpCode = otpCode;
        user.OtpExpiryTime = DateTimeOffset.UtcNow.AddMinutes(5);

        await _userManager.UpdateAsync(user);
        await _otpService.SendOtpAsync(request.PhoneNumber, otpCode);

        return otpCode;
    }
}
