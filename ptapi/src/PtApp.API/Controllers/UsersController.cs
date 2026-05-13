using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Users.DTOs;
using PtApp.Application.Features.Users.Queries;
using PtApp.Domain.Enums;
using System.Security.Claims;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Tüm danışanları listeler (Admin only)
    /// </summary>
    [HttpGet("students")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserListDto>>> GetStudents()
    {
        return await _mediator.Send(new GetUsersByRoleQuery(Role.Student));
    }

    /// <summary>
    /// Giriş yapmış trainer'ın kendi danışanlarını listeler (Trainer only)
    /// </summary>
    [HttpGet("my-students")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<List<UserListDto>>> GetMyStudents()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var trainerId))
            return Unauthorized("Kullanıcı kimliği alınamadı.");

        return await _mediator.Send(new GetMyStudentsQuery(trainerId));
    }

    /// <summary>
    /// Tüm trainerları ve adminleri listeler (Admin only)
    /// </summary>
    [HttpGet("trainers")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserListDto>>> GetTrainers()
    {
        return await _mediator.Send(new GetTrainersAndAdminsQuery());
    }

    /// <summary>
    /// Danışan profil detaylarını getirir (Admin, Trainer ve Danışanın kendisi görebilir)
    /// </summary>
    [HttpGet("students/{id}")]
    public async Task<ActionResult<StudentProfileDto>> GetStudentProfile(Guid id)
    {
        var roleString = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (roleString == "Student")
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !Guid.TryParse(userIdString, out var studentId) || studentId != id)
            {
                return Forbid();
            }
        }

        return await _mediator.Send(new GetStudentProfileQuery(id));
    }

    /// <summary>
    /// Danışanın temel bilgilerini ve atanan eğitmenini günceller
    /// </summary>
    [HttpPut("students/{id}")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult> UpdateStudent(Guid id, [FromBody] PtApp.Application.Features.Users.Commands.UpdateStudentCommand command)
    {
        if (id != command.StudentId)
        {
            return BadRequest("URL içindeki ID ile body içindeki StudentId eşleşmiyor.");
        }

        await _mediator.Send(command);
        return NoContent();
    }
}

