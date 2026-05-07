using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Appointments.Commands;
using PtApp.Application.Features.Appointments.Queries;
using PtApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Trainer")]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("calendar")]
    public async Task<ActionResult<List<AppointmentDto>>> GetCalendarAppointments(
        [FromQuery] DateTimeOffset startDate, 
        [FromQuery] DateTimeOffset endDate,
        [FromQuery] bool onlyMine = false)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var trainerId))
        {
            return Unauthorized("Kullanıcı kimliği alınamadı.");
        }

        var isAdmin = User.IsInRole("Admin") && !onlyMine;
        var query = new GetAppointmentsQuery(trainerId, startDate, endDate, isAdmin);
        return await _mediator.Send(query);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAppointment(Guid id, [FromBody] UpdateAppointmentRequest request)
    {
        var command = new UpdateAppointmentCommand(id, request.NewScheduledAt, request.NewStatus);
        await _mediator.Send(command);
        return NoContent();
    }
}

public class UpdateAppointmentRequest
{
    public DateTimeOffset? NewScheduledAt { get; set; }
    public AppointmentStatus? NewStatus { get; set; }
}
