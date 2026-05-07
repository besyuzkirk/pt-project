using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;
using PtApp.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Appointments.Commands;

public record UpdateAppointmentCommand(
    Guid AppointmentId,
    DateTimeOffset? NewScheduledAt,
    AppointmentStatus? NewStatus
) : IRequest;

public class UpdateAppointmentCommandHandler : IRequestHandler<UpdateAppointmentCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateAppointmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
    {
        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a => a.Id == request.AppointmentId && !a.IsDeleted, cancellationToken);

        if (appointment == null)
            throw new Exception("Randevu bulunamadı.");

        if (request.NewScheduledAt.HasValue)
        {
            appointment.ScheduledAt = request.NewScheduledAt.Value;
        }

        if (request.NewStatus.HasValue)
        {
            appointment.Status = request.NewStatus.Value;

            if (request.NewStatus == AppointmentStatus.Cancelled)
            {
                appointment.CancelledAt = DateTimeOffset.UtcNow;
            }
            else if (request.NewStatus == AppointmentStatus.Completed)
            {
                var exists = await _context.WorkoutSessions.AnyAsync(w => w.AppointmentId == appointment.Id, cancellationToken);
                if (!exists && appointment.MembershipId.HasValue)
                {
                    var membership = await _context.Memberships.FirstOrDefaultAsync(m => m.Id == appointment.MembershipId.Value, cancellationToken);
                    if (membership != null)
                    {
                        membership.UsedSessions += 1;
                        
                        var workout = new WorkoutSession
                        {
                            Id = Guid.NewGuid(),
                            StudentId = membership.StudentId,
                            CreatedById = appointment.TrainerId,
                            MembershipId = membership.Id,
                            AppointmentId = appointment.Id,
                            Date = DateOnly.FromDateTime(appointment.ScheduledAt.LocalDateTime),
                            StartedAt = appointment.ScheduledAt,
                            EndedAt = appointment.ScheduledAt.AddMinutes(appointment.DurationMinutes),
                            DurationMinutes = appointment.DurationMinutes,
                            Status = SessionStatus.Completed,
                            CreatedAt = DateTimeOffset.UtcNow,
                            CreatedBy = appointment.TrainerId
                        };
                        _context.WorkoutSessions.Add(workout);
                    }
                }
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
