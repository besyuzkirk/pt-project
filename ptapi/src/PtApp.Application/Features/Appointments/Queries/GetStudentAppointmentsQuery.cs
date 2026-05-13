using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Appointments.Queries;

public record GetStudentAppointmentsQuery(
    Guid StudentId,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate
) : IRequest<List<AppointmentDto>>;

public class GetStudentAppointmentsQueryHandler : IRequestHandler<GetStudentAppointmentsQuery, List<AppointmentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStudentAppointmentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AppointmentDto>> Handle(GetStudentAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var appointments = await _context.Appointments
            .Include(a => a.Attendees)
            .ThenInclude(att => att.Student)
            .Include(a => a.Membership)
            .Where(a => !a.IsDeleted)
            .Where(a => a.ScheduledAt >= request.StartDate && a.ScheduledAt <= request.EndDate)
            .Where(a => a.Attendees.Any(att => att.StudentId == request.StudentId))
            .OrderBy(a => a.ScheduledAt)
            .ToListAsync(cancellationToken);

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
