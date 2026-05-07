using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;
using PtApp.Infrastructure.Persistence.Interceptors;

namespace PtApp.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>, IApplicationDbContext
{
    private readonly UpdateAuditableEntitiesInterceptor _auditableEntitiesInterceptor;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        UpdateAuditableEntitiesInterceptor auditableEntitiesInterceptor) 
        : base(options)
    {
        _auditableEntitiesInterceptor = auditableEntitiesInterceptor;
    }

    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppointmentAttendee> AppointmentAttendees => Set<AppointmentAttendee>();
    public DbSet<BodyMeasurement> BodyMeasurements => Set<BodyMeasurement>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<Membership> Memberships => Set<Membership>();
    public DbSet<Package> Packages => Set<Package>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<StudioAttendance> StudioAttendances => Set<StudioAttendance>();
    public DbSet<WorkoutSession> WorkoutSessions => Set<WorkoutSession>();
    public DbSet<WorkoutSessionExercise> WorkoutSessionExercises => Set<WorkoutSessionExercise>();
    public DbSet<WorkoutSessionMuscle> WorkoutSessionMuscles => Set<WorkoutSessionMuscle>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all configurations defined in this assembly
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        
        // Rename ASP.NET Identity tables to make them cleaner
        builder.Entity<AppUser>().ToTable("Users");
        builder.Entity<IdentityRole<Guid>>().ToTable("Roles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitiesInterceptor);
        base.OnConfiguring(optionsBuilder);
    }
}
