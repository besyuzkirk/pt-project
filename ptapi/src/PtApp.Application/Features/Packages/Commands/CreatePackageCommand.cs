using MediatR;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Packages.Commands;

public record CreatePackageCommand(
    string Name,
    string? Description,
    PackageType PackageType,
    SessionType SessionType,
    int? TotalSessions,
    int SessionDurationMinutes,
    int? MaxParticipants,
    int ValidityDays,
    decimal Price,
    string Currency = "TRY"
) : IRequest<Guid>;

public class CreatePackageCommandHandler : IRequestHandler<CreatePackageCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreatePackageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreatePackageCommand request, CancellationToken cancellationToken)
    {
        var package = new Package
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            PackageType = request.PackageType,
            SessionType = request.SessionType,
            TotalSessions = request.TotalSessions,
            SessionDurationMinutes = request.SessionDurationMinutes,
            MaxParticipants = request.PackageType == PackageType.Group ? request.MaxParticipants : null,
            ValidityDays = request.ValidityDays,
            Price = request.Price,
            Currency = request.Currency,
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _context.Packages.Add(package);
        await _context.SaveChangesAsync(cancellationToken);

        return package.Id;
    }
}
