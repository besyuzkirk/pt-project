using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Features.Users.DTOs;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Users.Queries;

public record GetUsersByRoleQuery(Role Role) : IRequest<List<UserListDto>>;

public class GetUsersByRoleQueryHandler : IRequestHandler<GetUsersByRoleQuery, List<UserListDto>>
{
    private readonly UserManager<AppUser> _userManager;

    public GetUsersByRoleQueryHandler(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<UserListDto>> Handle(GetUsersByRoleQuery request, CancellationToken cancellationToken)
    {
        var users = await _userManager.Users
            .Where(u => u.Role == request.Role && !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserListDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                ActivePackageName = u.MembershipsAsStudent
                    .Where(m => m.Status == MembershipStatus.Active && !m.IsDeleted)
                    .Select(m => m.PackageName)
                    .FirstOrDefault(),
                RemainingSessions = u.MembershipsAsStudent
                    .Where(m => m.Status == MembershipStatus.Active && !m.IsDeleted && m.TotalSessions.HasValue)
                    .Select(m => (int?)((m.TotalSessions ?? 0) - m.UsedSessions))
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        return users;
    }
}
