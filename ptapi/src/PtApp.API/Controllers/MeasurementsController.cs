using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PtApp.Application.Features.Measurements.Commands;
using System.Security.Claims;

namespace PtApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Trainer")]
public class MeasurementsController : ControllerBase
{
    private readonly IMediator _mediator;

    public MeasurementsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<Guid>> AddMeasurement(
        [FromForm] AddMeasurementCommand command, 
        IFormFile? frontPhoto, 
        IFormFile? sidePhoto, 
        IFormFile? backPhoto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var trainerId))
        {
            return Unauthorized("Kullanıcı kimliği alınamadı.");
        }

        command.RecordedById = trainerId;
        
        string uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "measurements");
        if (!Directory.Exists(uploadDir))
            Directory.CreateDirectory(uploadDir);

        var measurementId = Guid.NewGuid(); // To use in filenames

        if (frontPhoto != null && frontPhoto.Length > 0)
        {
            var fileName = $"{measurementId}_front_{frontPhoto.FileName}";
            var path = Path.Combine(uploadDir, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await frontPhoto.CopyToAsync(stream);
            }
            command.FrontPhotoUrl = $"/uploads/measurements/{fileName}";
        }

        if (sidePhoto != null && sidePhoto.Length > 0)
        {
            var fileName = $"{measurementId}_side_{sidePhoto.FileName}";
            var path = Path.Combine(uploadDir, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await sidePhoto.CopyToAsync(stream);
            }
            command.SidePhotoUrl = $"/uploads/measurements/{fileName}";
        }

        if (backPhoto != null && backPhoto.Length > 0)
        {
            var fileName = $"{measurementId}_back_{backPhoto.FileName}";
            var path = Path.Combine(uploadDir, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await backPhoto.CopyToAsync(stream);
            }
            command.BackPhotoUrl = $"/uploads/measurements/{fileName}";
        }
        
        var id = await _mediator.Send(command);
        return Ok(new { MeasurementId = id });
    }
}
