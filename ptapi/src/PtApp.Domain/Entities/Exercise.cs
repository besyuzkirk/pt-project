using System;
using System.Collections.Generic;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class Exercise : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? NameTr { get; set; }
    
    public ExerciseType Type { get; set; }
    public string BodyPart { get; set; } = string.Empty;
    public string? MuscleGroupDetail { get; set; }
    public string? Equipment { get; set; }
    public string? Description { get; set; }
    public string? VideoUrl { get; set; }
    
    public bool IsCustom { get; set; } = false;
    
    public Guid? CreatedByTrainerId { get; set; }
    public AppUser? CreatedByTrainer { get; set; }
    
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public ICollection<WorkoutSessionExercise> WorkoutSessionExercises { get; set; } = new List<WorkoutSessionExercise>();
}
