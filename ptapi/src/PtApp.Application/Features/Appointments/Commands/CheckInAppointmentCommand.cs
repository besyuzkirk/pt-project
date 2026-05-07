using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;

namespace PtApp.Application.Features.Appointments.Commands;

public record CheckInAppointmentCommand(Guid StudentId, Guid? TrainerId) : IRequest<CheckInResultDto>;

public class CheckInResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public int TotalSessions { get; set; }
    public int UsedSessions { get; set; }
    public int RemainingSessions => TotalSessions - UsedSessions;
}

public class CheckInAppointmentCommandHandler : IRequestHandler<CheckInAppointmentCommand, CheckInResultDto>
{
    private readonly IApplicationDbContext _context;

    public CheckInAppointmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CheckInResultDto> Handle(CheckInAppointmentCommand request, CancellationToken cancellationToken)
    {
        var result = new CheckInResultDto();

        // 1. Find the student
        var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.StudentId, cancellationToken);
        if (student == null)
        {
            result.Success = false;
            result.Message = "Danışan bulunamadı!";
            return result;
        }

        result.StudentName = $"{student.FirstName} {student.LastName}";

        // 2. Find active membership
        var membership = await _context.Memberships
            .FirstOrDefaultAsync(m => m.StudentId == request.StudentId && m.Status == MembershipStatus.Active && (m.TotalSessions ?? 0) > m.UsedSessions, cancellationToken);

        if (membership == null)
        {
            result.Success = false;
            result.Message = "Aktif veya seansı olan bir paket bulunamadı!";
            return result;
        }

        result.PackageName = membership.PackageName;
        result.TotalSessions = membership.TotalSessions ?? 0;

        // 3. Look for today's scheduled active appointment for this student within a reasonable window (+/- 12 hours)
        var now = DateTimeOffset.UtcNow;
        var startWindow = now.AddHours(-12);
        var endWindow = now.AddHours(12);

        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a => a.MembershipId == membership.Id && 
                                     a.Status == AppointmentStatus.Booked && 
                                     a.ScheduledAt >= startWindow && 
                                     a.ScheduledAt <= endWindow, cancellationToken);

        if (appointment != null)
        {
            // Found today's scheduled appointment, let's complete it!
            appointment.Status = AppointmentStatus.Completed;
        }
        else
        {
            // No scheduled appointment found today, let's auto-create an on-the-spot Completed Appointment (Drop-in check-in!)
            var trainerId = request.TrainerId ?? membership.TrainerId;
            appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                TrainerId = trainerId,
                MembershipId = membership.Id,
                ScheduledAt = DateTimeOffset.UtcNow,
                DurationMinutes = 60,
                Type = "Check-In",
                Status = AppointmentStatus.Completed,
                CreatedAt = DateTimeOffset.UtcNow
            };
            _context.Appointments.Add(appointment);
        }

        // 4. Increment used sessions and add Completed WorkoutSession record
        membership.UsedSessions += 1;
        result.UsedSessions = membership.UsedSessions;

        var workout = new WorkoutSession
        {
            Id = Guid.NewGuid(),
            StudentId = request.StudentId,
            CreatedById = request.TrainerId ?? membership.TrainerId,
            MembershipId = membership.Id,
            AppointmentId = appointment.Id,
            Date = DateOnly.FromDateTime(DateTime.Today),
            StartedAt = DateTimeOffset.UtcNow,
            EndedAt = DateTimeOffset.UtcNow.AddMinutes(60),
            DurationMinutes = 60,
            Status = SessionStatus.Completed,
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedBy = request.TrainerId ?? membership.TrainerId
        };
        _context.WorkoutSessions.Add(workout);

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.Message = "Check-in Başarılı! Seans tamamlandı.";
        return result;
    }
}
