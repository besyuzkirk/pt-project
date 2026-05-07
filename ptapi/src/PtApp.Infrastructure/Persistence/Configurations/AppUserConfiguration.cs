using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PtApp.Domain.Entities;

namespace PtApp.Infrastructure.Persistence.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(t => t.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.LastName)
            .HasMaxLength(100)
            .IsRequired();

        // Relationship: AssignedTrainer
        builder.HasOne(u => u.AssignedTrainer)
            .WithMany()
            .HasForeignKey(u => u.AssignedTrainerId)
            .OnDelete(DeleteBehavior.SetNull);

        // Relationship: MembershipsAsStudent
        builder.HasMany(u => u.MembershipsAsStudent)
            .WithOne(m => m.Student)
            .HasForeignKey(m => m.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: MembershipsAsTrainer
        builder.HasMany(u => u.MembershipsAsTrainer)
            .WithOne(m => m.Trainer)
            .HasForeignKey(m => m.TrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: WorkoutSessionsAsStudent
        builder.HasMany(u => u.WorkoutSessionsAsStudent)
            .WithOne(w => w.Student)
            .HasForeignKey(w => w.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: WorkoutSessionsCreatedBy
        builder.HasMany(u => u.WorkoutSessionsCreatedBy)
            .WithOne(w => w.Creator)
            .HasForeignKey(w => w.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: CustomExercises
        builder.HasMany(u => u.CustomExercises)
            .WithOne(e => e.CreatedByTrainer)
            .HasForeignKey(e => e.CreatedByTrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: BodyMeasurementsAsStudent
        builder.HasMany(u => u.BodyMeasurementsAsStudent)
            .WithOne(b => b.Student)
            .HasForeignKey(b => b.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: BodyMeasurementsRecordedBy
        builder.HasMany(u => u.BodyMeasurementsRecordedBy)
            .WithOne(b => b.RecordedBy)
            .HasForeignKey(b => b.RecordedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: GoalsAsStudent
        builder.HasMany(u => u.GoalsAsStudent)
            .WithOne(g => g.Student)
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: GoalsCreatedBy
        builder.HasMany(u => u.GoalsCreatedBy)
            .WithOne(g => g.Creator)
            .HasForeignKey(g => g.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: AppointmentsAsTrainer
        builder.HasMany(u => u.AppointmentsAsTrainer)
            .WithOne(a => a.Trainer)
            .HasForeignKey(a => a.TrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship: AttendedAppointments
        builder.HasMany(u => u.AttendedAppointments)
            .WithOne(aa => aa.Student)
            .HasForeignKey(aa => aa.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Global query filter for Soft Delete
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
