using MediatR;
using Microsoft.AspNetCore.Identity;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Auth.DTOs;
using PtApp.Domain.Entities;

namespace PtApp.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(UserManager<AppUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new Exception("Invalid email or password");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Id = user.Id.ToString(),
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        };
    }
}
