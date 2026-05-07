using System;
using PtApp.Domain.Common;

namespace PtApp.Domain.Entities;

public class BodyMeasurement : BaseEntity
{
    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public Guid RecordedById { get; set; }
    public AppUser RecordedBy { get; set; } = null!;

    public DateTimeOffset RecordedAt { get; set; }
    
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
    
    // Photos
    public string? FrontPhotoUrl { get; set; }
    public string? SidePhotoUrl { get; set; }
    public string? BackPhotoUrl { get; set; }

    
    public string? Notes { get; set; }
}
