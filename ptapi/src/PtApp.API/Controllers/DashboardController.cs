using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Dashboard.Queries;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator _mediator)
    {
        this._mediator = _mediator;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardDataDto>> GetStats()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Kullanıcı kimliği alınamadı.");

        var roleString = User.FindFirst(ClaimTypes.Role)?.Value;
        bool isAdmin = roleString == "Admin";

        var query = new GetDashboardDataQuery(isAdmin ? null : userId, isAdmin);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
