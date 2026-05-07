using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Application.Features.Users.DTOs;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Users.Queries;

/// <summary>
/// Giriş yapmış trainer'ın kendisine atanmış danışanlarını getirir.
/// Membership tablosundaki TrainerId üzerinden filtreleme yapar.
/// Aynı danışan birden fazla membership'te olsa bile distinct olarak döner.
/// </summary>
public record GetMyStudentsQuery(Guid TrainerId) : IRequest<List<UserListDto>>;

public class GetMyStudentsQueryHandler : IRequestHandler<GetMyStudentsQuery, List<UserListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetMyStudentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserListDto>> Handle(GetMyStudentsQuery request, CancellationToken cancellationToken)
    {
        // Membership tablosundan veya AssignedTrainerId üzerinden trainer'a ait öğrencileri bul
        var students = await _context.Users
            .Where(u => !u.IsDeleted && u.Role == Role.Student &&
                        (u.AssignedTrainerId == request.TrainerId || 
                         u.MembershipsAsStudent.Any(m => m.TrainerId == request.TrainerId)))
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

        return students;
    }
}
