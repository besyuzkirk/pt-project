using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;
using PtApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Dashboard.Queries;

public class DashboardAppointmentDto
{
    public Guid Id { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;
    public DateTimeOffset ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class DashboardWorkoutSessionDto
{
    public Guid Id { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class TrainerLessonCountDto
{
    public string TrainerName { get; set; } = string.Empty;
    public int LessonCount { get; set; }
}

public class PaymentMethodBreakdownDto
{
    public decimal Cash { get; set; }
    public decimal Card { get; set; }
    public decimal Transfer { get; set; }
}

public class DashboardDataDto
{
    public int ActiveMembersCount { get; set; }
    public int ThisMonthWorkoutsCount { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public decimal AllTimeRevenue { get; set; }
    public int PendingProgramsCount { get; set; }
    public PaymentMethodBreakdownDto MonthlyPaymentBreakdown { get; set; } = new();
    public List<DashboardAppointmentDto> TodayAppointments { get; set; } = new();
    public List<DashboardWorkoutSessionDto> RecentCompletedSessions { get; set; } = new();
    public List<TrainerLessonCountDto> TrainerLessonCounts { get; set; } = new();
}

public record GetDashboardDataQuery(Guid? TrainerId, bool IsAdmin) : IRequest<DashboardDataDto>;

public class GetDashboardDataQueryHandler : IRequestHandler<GetDashboardDataQuery, DashboardDataDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardDataQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDataDto> Handle(GetDashboardDataQuery request, CancellationToken cancellationToken)
    {
        var result = new DashboardDataDto();
        var today = DateOnly.FromDateTime(DateTime.Today);
        var startOfMonth = new DateOnly(DateTime.Today.Year, DateTime.Today.Month, 1);
        
        var todayStart = new DateTimeOffset(DateTime.Today).ToUniversalTime();
        var todayEnd = todayStart.AddDays(1);
        var startOfMonthUtc = new DateTimeOffset(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0, TimeSpan.Zero);

        // 1. Active Members Count
        if (request.IsAdmin)
        {
            result.ActiveMembersCount = await _context.Users
                .CountAsync(u => u.Role == Role.Student && u.IsActive && !u.IsDeleted, cancellationToken);
        }
        else if (request.TrainerId.HasValue)
        {
            result.ActiveMembersCount = await _context.Users
                .CountAsync(u => u.Role == Role.Student && u.IsActive && !u.IsDeleted &&
                                 (u.AssignedTrainerId == request.TrainerId.Value ||
                                  u.MembershipsAsStudent.Any(m => m.TrainerId == request.TrainerId.Value && m.Status == MembershipStatus.Active)), 
                            cancellationToken);
        }

        // 2. This Month's Workouts Count (Completed Workout Sessions)
        if (request.IsAdmin)
        {
            result.ThisMonthWorkoutsCount = await _context.WorkoutSessions
                .CountAsync(s => s.Date >= startOfMonth && s.Status == SessionStatus.Completed && !s.IsDeleted, cancellationToken);
        }
        else if (request.TrainerId.HasValue)
        {
            result.ThisMonthWorkoutsCount = await _context.WorkoutSessions
                .CountAsync(s => s.CreatedById == request.TrainerId.Value && s.Date >= startOfMonth && s.Status == SessionStatus.Completed && !s.IsDeleted, cancellationToken);
        }

        // 3. Revenues (Monthly & All-Time from PAID payments only)
        IQueryable<Payment> paymentsQueryBase = _context.Payments
            .Include(p => p.Membership)
            .Where(p => p.Status == PaymentStatus.Paid && !p.IsDeleted);

        if (!request.IsAdmin && request.TrainerId.HasValue)
        {
            paymentsQueryBase = paymentsQueryBase.Where(p => p.Membership.TrainerId == request.TrainerId.Value);
        }

        result.MonthlyRevenue = await paymentsQueryBase
            .Where(p => p.PaidAt >= startOfMonthUtc)
            .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;

        result.AllTimeRevenue = await paymentsQueryBase
            .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;

        // Monthly breakdown by Payment Method
        var monthlyPayments = await paymentsQueryBase
            .Where(p => p.PaidAt >= startOfMonthUtc)
            .GroupBy(p => p.PaymentMethod)
            .Select(g => new { Method = g.Key, Total = g.Sum(p => p.Amount) })
            .ToListAsync(cancellationToken);

        result.MonthlyPaymentBreakdown = new PaymentMethodBreakdownDto
        {
            Cash = monthlyPayments.FirstOrDefault(x => x.Method == PaymentMethod.Cash)?.Total ?? 0m,
            Card = monthlyPayments.FirstOrDefault(x => x.Method == PaymentMethod.Card)?.Total ?? 0m,
            Transfer = monthlyPayments.FirstOrDefault(x => x.Method == PaymentMethod.Transfer)?.Total ?? 0m
        };

        // 4. Pending Programs Count (Active members with no completed sessions yet)
        if (request.IsAdmin)
        {
            result.PendingProgramsCount = await _context.Memberships
                .Where(m => m.Status == MembershipStatus.Active && !m.IsDeleted && m.TotalSessions.HasValue)
                .SumAsync(m => (m.TotalSessions ?? 0) - m.UsedSessions, cancellationToken);
        }
        else if (request.TrainerId.HasValue)
        {
            result.PendingProgramsCount = await _context.Memberships
                .Where(m => m.TrainerId == request.TrainerId.Value && m.Status == MembershipStatus.Active && !m.IsDeleted && m.TotalSessions.HasValue)
                .SumAsync(m => (m.TotalSessions ?? 0) - m.UsedSessions, cancellationToken);
        }

        // 5. Today's Appointments (Scheduled visitors)
        var appointmentsQuery = _context.Appointments
            .Include(a => a.Trainer)
            .Include(a => a.Membership).ThenInclude(m => m!.Student)
            .Where(a => a.ScheduledAt >= todayStart && a.ScheduledAt < todayEnd && !a.IsDeleted);

        if (!request.IsAdmin && request.TrainerId.HasValue)
        {
            appointmentsQuery = appointmentsQuery.Where(a => a.TrainerId == request.TrainerId.Value);
        }

        var appointments = await appointmentsQuery
            .OrderBy(a => a.ScheduledAt)
            .ToListAsync(cancellationToken);

        result.TodayAppointments = appointments.Select(a => new DashboardAppointmentDto
        {
            Id = a.Id,
            StudentName = a.Membership != null && a.Membership.Student != null
                ? $"{a.Membership.Student.FirstName} {a.Membership.Student.LastName}"
                : "Belirtilmemiş",
            TrainerName = $"{a.Trainer.FirstName} {a.Trainer.LastName}",
            ScheduledAt = a.ScheduledAt,
            DurationMinutes = a.DurationMinutes,
            Status = a.Status.ToString()
        }).ToList();

        // 6. Recent Completed Sessions
        var sessionsQuery = _context.WorkoutSessions
            .Include(s => s.Student)
            .Include(s => s.Creator)
            .Where(s => s.Status == SessionStatus.Completed && !s.IsDeleted);

        if (!request.IsAdmin && request.TrainerId.HasValue)
        {
            sessionsQuery = sessionsQuery.Where(s => s.CreatedById == request.TrainerId.Value);
        }

        var recentSessions = await sessionsQuery
            .OrderByDescending(s => s.Date)
            .ThenByDescending(s => s.StartedAt)
            .Take(5)
            .ToListAsync(cancellationToken);

        result.RecentCompletedSessions = recentSessions.Select(s => new DashboardWorkoutSessionDto
        {
            Id = s.Id,
            StudentName = $"{s.Student.FirstName} {s.Student.LastName}",
            TrainerName = $"{s.Creator.FirstName} {s.Creator.LastName}",
            Notes = s.Notes ?? "Not eklenmemiş",
            Date = s.Date,
            Status = s.Status.ToString()
        }).ToList();

        // 7. Trainer Lesson Counts (Admin Only - Group sessions by trainer this month)
        if (request.IsAdmin)
        {
            var trainerStats = await _context.WorkoutSessions
                .Include(s => s.Creator)
                .Where(s => s.Date >= startOfMonth && s.Status == SessionStatus.Completed && !s.IsDeleted)
                .GroupBy(s => s.CreatedById)
                .Select(g => new
                {
                    TrainerId = g.Key,
                    TrainerName = g.Max(s => s.Creator.FirstName + " " + s.Creator.LastName),
                    Count = g.Count()
                })
                .OrderByDescending(g => g.Count)
                .ToListAsync(cancellationToken);

            result.TrainerLessonCounts = trainerStats.Select(t => new TrainerLessonCountDto
            {
                TrainerName = t.TrainerName ?? "Bilinmeyen Eğitmen",
                LessonCount = t.Count
            }).ToList();
        }

        return result;
    }
}
