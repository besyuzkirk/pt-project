using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Packages.Queries;

public class PackageDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string PackageType { get; set; } = string.Empty;
    public string SessionType { get; set; } = string.Empty;
    public int? TotalSessions { get; set; }
    public int SessionDurationMinutes { get; set; }
    public int? MaxParticipants { get; set; }
    public int ValidityDays { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TRY";
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public record GetAllPackagesQuery : IRequest<List<PackageDto>>;

public class GetAllPackagesQueryHandler : IRequestHandler<GetAllPackagesQuery, List<PackageDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllPackagesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PackageDto>> Handle(GetAllPackagesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Packages
            .Where(p => !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PackageDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PackageType = p.PackageType.ToString(),
                SessionType = p.SessionType.ToString(),
                TotalSessions = p.TotalSessions,
                SessionDurationMinutes = p.SessionDurationMinutes,
                MaxParticipants = p.MaxParticipants,
                ValidityDays = p.ValidityDays,
                Price = p.Price,
                Currency = p.Currency,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
