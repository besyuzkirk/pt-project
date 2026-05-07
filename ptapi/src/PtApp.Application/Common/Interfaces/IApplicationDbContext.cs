using Microsoft.EntityFrameworkCore;
using PtApp.Domain.Entities;

namespace PtApp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<AppUser> Users { get; }
    DbSet<Membership> Memberships { get; }
    DbSet<Package> Packages { get; }
    DbSet<Appointment> Appointments { get; }
    DbSet<AppointmentAttendee> AppointmentAttendees { get; }
    DbSet<BodyMeasurement> BodyMeasurements { get; }
    DbSet<Payment> Payments { get; }
    DbSet<WorkoutSession> WorkoutSessions { get; }
    DbSet<StudioAttendance> StudioAttendances { get; }
    
    // Add other DbSets as needed
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
