using System;
using PtApp.Domain.Common;

namespace PtApp.Domain.Entities;

public class WorkoutSessionExercise : BaseEntity
{
    public Guid SessionId { get; set; }
    public WorkoutSession Session { get; set; } = null!;

    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public int OrderIndex { get; set; }
    
    public int? Sets { get; set; }
    public string? Reps { get; set; }
    public string? WeightKg { get; set; }
    
    public int? DurationMinutes { get; set; }
    public int? RestSeconds { get; set; }
    
    public string? Notes { get; set; }
}
