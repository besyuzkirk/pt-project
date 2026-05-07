using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Features.Users.DTOs;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Users.Queries;

public record GetTrainersAndAdminsQuery() : IRequest<List<UserListDto>>;

public class GetTrainersAndAdminsQueryHandler : IRequestHandler<GetTrainersAndAdminsQuery, List<UserListDto>>
{
    private readonly UserManager<AppUser> _userManager;

    public GetTrainersAndAdminsQueryHandler(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<UserListDto>> Handle(GetTrainersAndAdminsQuery request, CancellationToken cancellationToken)
    {
        var users = await _userManager.Users
            .Where(u => (u.Role == Role.Trainer || u.Role == Role.Admin) && !u.IsDeleted)
            .OrderBy(u => u.Role) // Önce Admin'ler, sonra Trainer'lar listelenebilir (isteğe bağlı)
            .ThenBy(u => u.FirstName)
            .Select(u => new UserListDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return users;
    }
}
