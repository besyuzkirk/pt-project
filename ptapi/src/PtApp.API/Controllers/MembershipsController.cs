using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Memberships.Commands;
using PtApp.Domain.Enums;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Trainer")]
public class MembershipsController : ControllerBase
{
    private readonly IMediator _mediator;

    public MembershipsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("assign")]
    public async Task<ActionResult<Guid>> AssignPackage([FromBody] AssignPackageRequest request)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var trainerId))
        {
            return Unauthorized("Kullanıcı kimliği alınamadı.");
        }

        var command = new AssignPackageCommand(
            request.StudentId,
            request.PackageId,
            trainerId,
            request.StartDate,
            request.WeeklySchedule,
            request.DiscountAmount,
            request.PaymentMethod,
            request.PaymentStatus
        );

        var id = await _mediator.Send(command);
        return Ok(new { MembershipId = id });
    }
}

public class AssignPackageRequest
{
    public Guid StudentId { get; set; }
    public Guid PackageId { get; set; }
    public DateOnly StartDate { get; set; }
    public List<ScheduleItem> WeeklySchedule { get; set; } = new();
    public decimal? DiscountAmount { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
}
