using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Payments.Commands;
using PtApp.Application.Features.Payments.Queries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<PaymentListItemDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetPaymentsListQuery());
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<bool>> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _mediator.Send(new UpdatePaymentStatusCommand(id, request.Status));
        return Ok(result);
    }
}

public record UpdateStatusRequest(string Status);
