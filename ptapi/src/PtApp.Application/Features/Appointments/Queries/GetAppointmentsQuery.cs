using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Appointments.Queries;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public DateTimeOffset ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
}

public record GetAppointmentsQuery(
    Guid TrainerId,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    bool IsAdmin = false
) : IRequest<List<AppointmentDto>>;

public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, List<AppointmentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAppointmentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AppointmentDto>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var dbQuery = _context.Appointments
            .Include(a => a.Attendees)
            .ThenInclude(att => att.Student)
            .Include(a => a.Membership)
            .Where(a => !a.IsDeleted)
            .Where(a => a.ScheduledAt >= request.StartDate && a.ScheduledAt <= request.EndDate);

        if (!request.IsAdmin)
        {
            dbQuery = dbQuery.Where(a => a.TrainerId == request.TrainerId);
        }

        var query = dbQuery.OrderBy(a => a.ScheduledAt);

        var appointments = await query.ToListAsync(cancellationToken);

        return appointments.Select(a => {
            var student = a.Attendees.FirstOrDefault()?.Student;
            return new AppointmentDto
            {
                Id = a.Id,
                StudentId = student?.Id ?? Guid.Empty,
                StudentName = student != null ? $"{student.FirstName} {student.LastName}" : "Bilinmiyor",
                PackageName = a.Membership?.PackageName ?? "Bilinmeyen Paket",
                ScheduledAt = a.ScheduledAt,
                DurationMinutes = a.DurationMinutes,
                Status = a.Status.ToString()
            };
        }).ToList();
    }
}
