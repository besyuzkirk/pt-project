using PtApp.Domain.Entities;
using System.Security.Claims;

namespace PtApp.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(AppUser user, IList<string> roles);
    string GenerateRefreshToken();
}
