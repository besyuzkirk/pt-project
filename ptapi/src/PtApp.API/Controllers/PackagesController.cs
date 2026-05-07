using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Packages.Commands;
using PtApp.Application.Features.Packages.Queries;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Trainer")]
public class PackagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PackagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<PackageDto>>> GetAll()
    {
        return await _mediator.Send(new GetAllPackagesQuery());
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreatePackageCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetAll), new { id }, id);
    }
}
