using System;
using System.Collections.Generic;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class Membership : BaseEntity
{
    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public Guid TrainerId { get; set; }
    public AppUser Trainer { get; set; } = null!;

    public string PackageName { get; set; } = string.Empty;
    public int? TotalSessions { get; set; }
    public int UsedSessions { get; set; } = 0;
    
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TRY";
    
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    
    public MembershipStatus Status { get; set; }
    public string? Notes { get; set; }

    // Navigation Properties
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<StudioAttendance> Attendances { get; set; } = new List<StudioAttendance>();
    public ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
