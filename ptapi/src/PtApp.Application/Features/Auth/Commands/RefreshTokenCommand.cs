using MediatR;
using Microsoft.AspNetCore.Identity;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Auth.DTOs;
using PtApp.Domain.Entities;

namespace PtApp.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<AuthResponseDto>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(UserManager<AppUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Note: In a production app, you should validate the expired access token as well.
        // For simplicity, we find the user by refresh token directly.
        
        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == request.RefreshToken);
        
        if (user == null || user.RefreshTokenExpiryTime < DateTimeOffset.UtcNow)
        {
            throw new Exception("Geçersiz veya süresi dolmuş refresh token.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var newAccessToken = _jwtService.GenerateAccessToken(user, roles);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(90);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            Id = user.Id.ToString(),
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        };
    }
}
