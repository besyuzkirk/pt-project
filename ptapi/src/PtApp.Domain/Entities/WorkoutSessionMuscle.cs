using System;
using PtApp.Domain.Common;

namespace PtApp.Domain.Entities;

public class WorkoutSessionMuscle : BaseEntity
{
    public Guid SessionId { get; set; }
    public WorkoutSession Session { get; set; } = null!;

    public string MuscleKey { get; set; } = string.Empty;
}
