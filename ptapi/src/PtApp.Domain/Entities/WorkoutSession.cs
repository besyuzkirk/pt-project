using System;
using System.Collections.Generic;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class WorkoutSession : BaseEntity
{
    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public Guid CreatedById { get; set; }
    public AppUser Creator { get; set; } = null!;

    public Guid? MembershipId { get; set; }
    public Membership? Membership { get; set; }

    public Guid? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public DateOnly Date { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? EndedAt { get; set; }
    
    public int? DurationMinutes { get; set; }
    public Intensity Intensity { get; set; }
    public string? Notes { get; set; }
    
    public SessionStatus Status { get; set; }

    // Navigation Properties
    public ICollection<WorkoutSessionExercise> Exercises { get; set; } = new List<WorkoutSessionExercise>();
    public ICollection<WorkoutSessionMuscle> TargetedMuscles { get; set; } = new List<WorkoutSessionMuscle>();
}
