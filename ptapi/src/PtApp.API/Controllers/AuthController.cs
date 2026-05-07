using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Auth.Commands;
using PtApp.Application.Features.Auth.DTOs;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpPost("register-phone")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<AuthResponseDto>> RegisterWithPhone(RegisterWithPhoneCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpPost("request-otp")]
    public async Task<ActionResult<string>> RequestOtp(RequestOtpCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpPost("verify-otp")]
    public async Task<ActionResult<AuthResponseDto>> VerifyOtp(VerifyOtpCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenCommand command)
    {
        return await _mediator.Send(command);
    }
}
