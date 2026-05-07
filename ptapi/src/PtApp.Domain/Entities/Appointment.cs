using System;
using System.Collections.Generic;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class Appointment : BaseEntity
{
    public Guid TrainerId { get; set; }
    public AppUser Trainer { get; set; } = null!;

    public Guid? MembershipId { get; set; }
    public Membership? Membership { get; set; }

    public DateTimeOffset ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    
    public string? Type { get; set; }
    public AppointmentStatus Status { get; set; }
    
    public DateTimeOffset? CancelledAt { get; set; }
    public string? CancelReason { get; set; }
    public string? Notes { get; set; }

    // Navigation Properties
    public ICollection<AppointmentAttendee> Attendees { get; set; } = new List<AppointmentAttendee>();
    
    // An appointment might generate multiple sessions in a group class, 
    // but typically it's 1-to-many. Let's make it a collection for group support.
    public ICollection<WorkoutSession> GeneratedSessions { get; set; } = new List<WorkoutSession>();
}
