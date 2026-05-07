using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Auth.DTOs;
using PtApp.Domain.Entities;

namespace PtApp.Application.Features.Auth.Commands;

public record VerifyOtpCommand(string PhoneNumber, string OtpCode) : IRequest<AuthResponseDto>;

public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, AuthResponseDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;

    public VerifyOtpCommandHandler(UserManager<AppUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber.Trim(), cancellationToken);
        
        if (user == null)
        {
            throw new Exception("Kullanıcı bulunamadı.");
        }

        if (user.OtpCode != request.OtpCode || user.OtpExpiryTime < DateTimeOffset.UtcNow)
        {
            throw new Exception("Geçersiz veya süresi dolmuş OTP.");
        }

        // OTP başarılı, temizle
        user.OtpCode = null;
        user.OtpExpiryTime = null;
        user.LastLoginAt = DateTimeOffset.UtcNow;

        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        };
    }
}
