using MediatR;
using Microsoft.AspNetCore.Identity;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Auth.DTOs;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Auth.Commands;

public record RegisterCommand(
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    Role Role) : IRequest<AuthResponseDto>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(UserManager<AppUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = request.Role,
            CreatedAt = DateTimeOffset.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        // Assign role string as well for Identity
        await _userManager.AddToRoleAsync(user, request.Role.ToString());

        var roles = new List<string> { request.Role.ToString() };
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        };
    }
}
