using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;
using PtApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Memberships.Commands;

public class ScheduleItem
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan Time { get; set; }
}

public record AssignPackageCommand(
    Guid StudentId,
    Guid PackageId,
    Guid TrainerId,
    DateOnly StartDate,
    List<ScheduleItem> WeeklySchedule,
    decimal? DiscountAmount,
    PaymentMethod? PaymentMethod,
    PaymentStatus? PaymentStatus
) : IRequest<Guid>;

public class AssignPackageCommandHandler : IRequestHandler<AssignPackageCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public AssignPackageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(AssignPackageCommand request, CancellationToken cancellationToken)
    {
        var package = await _context.Packages
            .FirstOrDefaultAsync(p => p.Id == request.PackageId && !p.IsDeleted, cancellationToken);

        if (package == null)
            throw new Exception("Paket bulunamadı.");

        var student = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.StudentId && !u.IsDeleted, cancellationToken);

        if (student == null)
            throw new Exception("Danışan bulunamadı.");

        // Check if student already has an active membership (ignoring empty dummy memberships)
        var hasActiveMembership = await _context.Memberships
            .AnyAsync(m => m.StudentId == request.StudentId && m.Status == MembershipStatus.Active && !string.IsNullOrEmpty(m.PackageName), cancellationToken);

        if (hasActiveMembership)
            throw new Exception("Bu danışanın zaten aktif bir paketi bulunuyor. Yeni paket atamadan önce mevcut paketi tamamlamalı veya iptal etmelisiniz.");


        // 1. Create Membership
        var membership = new Membership
        {
            Id = Guid.NewGuid(),
            StudentId = request.StudentId,
            TrainerId = request.TrainerId,
            PackageName = package.Name,
            TotalSessions = package.TotalSessions,
            UsedSessions = 0,
            Price = package.Price - (request.DiscountAmount ?? 0),
            Currency = package.Currency,
            StartDate = request.StartDate,
            EndDate = request.StartDate.AddDays(package.ValidityDays),
            Status = MembershipStatus.Active,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _context.Memberships.Add(membership);

        if (request.PaymentStatus.HasValue)
        {
            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                MembershipId = membership.Id,
                StudentId = request.StudentId,
                Amount = membership.Price,
                Currency = membership.Currency,
                PaymentMethod = request.PaymentMethod ?? PaymentMethod.Cash,
                Status = request.PaymentStatus.Value,
                PaidAt = request.PaymentStatus == PaymentStatus.Paid ? DateTimeOffset.UtcNow : null,
                DueDate = request.StartDate,
                CreatedAt = DateTimeOffset.UtcNow,
                CreatedBy = request.TrainerId
            };
            _context.Payments.Add(payment);
        }

        // 2. Generate Appointments
        if (request.WeeklySchedule != null && request.WeeklySchedule.Any() && package.TotalSessions.HasValue)
        {
            int sessionsToCreate = package.TotalSessions.Value;
            var currentDate = request.StartDate;
            int sessionsCreated = 0;

            // Prevent infinite loop by capping weeks if something goes wrong
            int maxWeeksToSearch = 52; 
            int weeksSearched = 0;

            while (sessionsCreated < sessionsToCreate && weeksSearched < maxWeeksToSearch)
            {
                var startOfWeek = currentDate.AddDays(-(int)currentDate.DayOfWeek);

                // For each requested day of the week, create an appointment
                foreach (var schedule in request.WeeklySchedule)
                {
                    if (sessionsCreated >= sessionsToCreate) break;

                    int offsetDays = (int)schedule.DayOfWeek;
                    var targetDate = startOfWeek.AddDays(offsetDays);

                    // Ensure target date is not before StartDate (for the first week)
                    if (targetDate < request.StartDate) continue;

                    var scheduledAtLocal = targetDate.ToDateTime(TimeOnly.FromTimeSpan(schedule.Time));
                    // Convert to UTC assuming local time context. In production, consider timezones properly.
                    // For now, we assume standard local time without explicit timezone conversion mapping.
                    // To avoid offset complexities in this demo, let's just use DateTimeOffset directly
                    var scheduledAt = new DateTimeOffset(scheduledAtLocal, TimeSpan.Zero); // Or a specific offset

                    var appointment = new Appointment
                    {
                        Id = Guid.NewGuid(),
                        TrainerId = request.TrainerId,
                        MembershipId = membership.Id,
                        ScheduledAt = scheduledAt,
                        DurationMinutes = package.SessionDurationMinutes,
                        Type = package.PackageType.ToString(),
                        Status = AppointmentStatus.Booked,
                        CreatedAt = DateTimeOffset.UtcNow
                    };

                    _context.Appointments.Add(appointment);

                    var attendee = new AppointmentAttendee
                    {
                        Id = Guid.NewGuid(),
                        AppointmentId = appointment.Id,
                        StudentId = request.StudentId,
                        HasAttended = false,
                        CreatedAt = DateTimeOffset.UtcNow
                    };

                    _context.AppointmentAttendees.Add(attendee);

                    sessionsCreated++;
                }

                currentDate = currentDate.AddDays(7);
                weeksSearched++;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return membership.Id;
    }
}
