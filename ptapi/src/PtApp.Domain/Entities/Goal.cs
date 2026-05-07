using System;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class Goal : BaseEntity
{
    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public Guid CreatedById { get; set; }
    public AppUser Creator { get; set; } = null!;

    public decimal? StartWeightKg { get; set; }
    public decimal? TargetWeightKg { get; set; }
    
    public DateOnly StartDate { get; set; }
    public DateOnly? TargetDate { get; set; }
    
    public int? WeeklyWorkoutTarget { get; set; }
    public int? ProgramTotalWeeks { get; set; }
    public int? ProgramCurrentWeek { get; set; }
    
    public GoalStatus Status { get; set; }
    public string? Notes { get; set; }
}
