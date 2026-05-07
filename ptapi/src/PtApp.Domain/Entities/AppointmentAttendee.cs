using System;
using PtApp.Domain.Common;

namespace PtApp.Domain.Entities;

public class AppointmentAttendee : BaseEntity
{
    public Guid AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;

    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public bool HasAttended { get; set; } = false;
}
