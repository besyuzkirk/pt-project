using MediatR;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;

namespace PtApp.Application.Features.Measurements.Commands;

public class AddMeasurementCommand : IRequest<Guid>
{
    public Guid StudentId { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? ShoulderCm { get; set; }
    public decimal? ChestCm { get; set; }
    public decimal? WaistCm { get; set; }
    public decimal? HipCm { get; set; }
    public decimal? ArmLeftCm { get; set; }
    public decimal? ArmRightCm { get; set; }
    public decimal? LegLeftCm { get; set; }
    public decimal? LegRightCm { get; set; }
    public string? Notes { get; set; }
    
    // Processed file URLs from Controller
    public string? FrontPhotoUrl { get; set; }
    public string? SidePhotoUrl { get; set; }
    public string? BackPhotoUrl { get; set; }
    
    // Auth'dan gelecek Trainer Id
    public Guid RecordedById { get; set; }
}

public class AddMeasurementCommandHandler : IRequestHandler<AddMeasurementCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    
    public AddMeasurementCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(AddMeasurementCommand request, CancellationToken cancellationToken)
    {
        // Update Student's height in their profile if provided
        if (request.HeightCm.HasValue)
        {
            var student = await _context.Users.FindAsync(new object[] { request.StudentId }, cancellationToken);
            if (student != null)
            {
                student.HeightCm = request.HeightCm.Value;
            }
        }

        var measurement = new BodyMeasurement
        {
            Id = Guid.NewGuid(),
            StudentId = request.StudentId,
            RecordedById = request.RecordedById,
            RecordedAt = DateTimeOffset.UtcNow,
            WeightKg = request.WeightKg,
            BodyFatPercentage = request.BodyFatPercentage,
            ShoulderCm = request.ShoulderCm,
            ChestCm = request.ChestCm,
            WaistCm = request.WaistCm,
            HipCm = request.HipCm,
            ArmLeftCm = request.ArmLeftCm,
            ArmRightCm = request.ArmRightCm,
            LegLeftCm = request.LegLeftCm,
            LegRightCm = request.LegRightCm,
            Notes = request.Notes,
            FrontPhotoUrl = request.FrontPhotoUrl,
            SidePhotoUrl = request.SidePhotoUrl,
            BackPhotoUrl = request.BackPhotoUrl
        };

        await _context.BodyMeasurements.AddAsync(measurement, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return measurement.Id;
    }
}
