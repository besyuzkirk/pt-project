using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Entities;
using PtApp.Infrastructure.Persistence;
using PtApp.Infrastructure.Persistence.Interceptors;
using PtApp.Infrastructure.Services;
using System.Text;

namespace PtApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<UpdateAuditableEntitiesInterceptor>();
        services.AddHttpContextAccessor();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["Secret"] ?? "super_secret_key_1234567890123456";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
            };
        });

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IOtpService, OtpService>();
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}
