using MediatR;
using Microsoft.AspNetCore.Identity;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Auth.DTOs;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Auth.Commands;

public record RegisterWithPhoneCommand(
    string PhoneNumber, 
    string FirstName, 
    string LastName, 
    Role Role,
    Guid? TrainerId = null,
    Gender? Gender = null,
    BloodType? BloodType = null,
    DateOnly? DateOfBirth = null,
    string? Notes = null,
    string? EmergencyContactName = null,
    string? EmergencyContactPhone = null,
    string? Email = null) : IRequest<AuthResponseDto>
{
    [System.Text.Json.Serialization.JsonIgnore]
    public Guid? CreatorTrainerId { get; set; }
}

public class RegisterWithPhoneCommandHandler : IRequestHandler<RegisterWithPhoneCommand, AuthResponseDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IApplicationDbContext _context;

    public RegisterWithPhoneCommandHandler(
        UserManager<AppUser> userManager, 
        IJwtService jwtService,
        IApplicationDbContext context)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _context = context;
    }

    public async Task<AuthResponseDto> Handle(RegisterWithPhoneCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userManager.FindByNameAsync(request.PhoneNumber);
        if (existingUser != null)
        {
            throw new Exception("Bu telefon numarası ile zaten bir kayıt mevcut.");
        }

        Guid? assignedTrainerId = null;
        if (request.Role == Role.Student)
        {
            // Auto-assign Creator's ID if request.TrainerId is empty/null
            assignedTrainerId = request.TrainerId ?? request.CreatorTrainerId;
        }

        var user = new AppUser
        {
            UserName = request.PhoneNumber,
            PhoneNumber = request.PhoneNumber,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Role = request.Role,
            AssignedTrainerId = assignedTrainerId,
            Gender = request.Gender,
            BloodType = request.BloodType,
            DateOfBirth = request.DateOfBirth,
            Notes = request.Notes,
            EmergencyContactName = request.EmergencyContactName,
            EmergencyContactPhone = request.EmergencyContactPhone,
            CreatedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, Guid.NewGuid().ToString() + "A1!");

        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, request.Role.ToString());

        var roles = new List<string> { request.Role.ToString() };
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(90);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            Id = user.Id.ToString(),
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        };
    }
}
