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
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("calendar")]
    [Authorize(Roles = "Admin,Trainer")]
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

    [HttpGet("my-sessions")]
    public async Task<ActionResult<List<AppointmentDto>>> GetMySessions(
        [FromQuery] DateTimeOffset startDate, 
        [FromQuery] DateTimeOffset endDate)
    {
        var roleString = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (roleString != "Student")
        {
            return Forbid();
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var studentId))
        {
            return Unauthorized("Kullanıcı kimliği alınamadı.");
        }

        var query = new GetStudentAppointmentsQuery(studentId, startDate, endDate);
        return await _mediator.Send(query);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult> UpdateAppointment(Guid id, [FromBody] UpdateAppointmentRequest request)
    {
        var command = new UpdateAppointmentCommand(id, request.NewScheduledAt, request.NewStatus);
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPost("check-in")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<CheckInResultDto>> CheckIn([FromBody] CheckInRequest request)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? trainerId = null;
        if (!string.IsNullOrEmpty(userIdString) && Guid.TryParse(userIdString, out var parsedId))
        {
            trainerId = parsedId;
        }

        var command = new CheckInAppointmentCommand(request.StudentId, trainerId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}

public class CheckInRequest
{
    public Guid StudentId { get; set; }
}

public class UpdateAppointmentRequest
{
    public DateTimeOffset? NewScheduledAt { get; set; }
    public AppointmentStatus? NewStatus { get; set; }
}
