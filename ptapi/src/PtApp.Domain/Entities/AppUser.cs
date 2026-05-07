using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using PtApp.Domain.Common.Interfaces;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class AppUser : IdentityUser<Guid>, IAuditableEntity, ISoftDeletable
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Role Role { get; set; }
    
    public DateOnly? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public BloodType? BloodType { get; set; }
    public decimal? HeightCm { get; set; }
    
    public string? ProfilePhotoUrl { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? Notes { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public string QrToken { get; set; } = string.Empty;
    public DateTimeOffset? QrTokenExpiresAt { get; set; }
    public DateTimeOffset? LastLoginAt { get; set; }

    // Refresh Token for long sessions
    public string? RefreshToken { get; set; }
    public DateTimeOffset? RefreshTokenExpiryTime { get; set; }

    // OTP for login
    public string? OtpCode { get; set; }
    public DateTimeOffset? OtpExpiryTime { get; set; }

    // Audit Fields
    public DateTimeOffset CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    // Soft Delete Fields
    public bool IsDeleted { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }

    // Trainer Assignment
    public Guid? AssignedTrainerId { get; set; }
    public AppUser? AssignedTrainer { get; set; }

    // Navigation Properties
    public ICollection<Membership> MembershipsAsStudent { get; set; } = new List<Membership>();
    public ICollection<Membership> MembershipsAsTrainer { get; set; } = new List<Membership>();
    public ICollection<StudioAttendance> Attendances { get; set; } = new List<StudioAttendance>();
    public ICollection<WorkoutSession> WorkoutSessionsAsStudent { get; set; } = new List<WorkoutSession>();
    public ICollection<WorkoutSession> WorkoutSessionsCreatedBy { get; set; } = new List<WorkoutSession>();
    public ICollection<Exercise> CustomExercises { get; set; } = new List<Exercise>();
    public ICollection<BodyMeasurement> BodyMeasurementsAsStudent { get; set; } = new List<BodyMeasurement>();
    public ICollection<BodyMeasurement> BodyMeasurementsRecordedBy { get; set; } = new List<BodyMeasurement>();
    public ICollection<Goal> GoalsAsStudent { get; set; } = new List<Goal>();
    public ICollection<Goal> GoalsCreatedBy { get; set; } = new List<Goal>();
    public ICollection<Appointment> AppointmentsAsTrainer { get; set; } = new List<Appointment>();
    public ICollection<AppointmentAttendee> AttendedAppointments { get; set; } = new List<AppointmentAttendee>();
}
