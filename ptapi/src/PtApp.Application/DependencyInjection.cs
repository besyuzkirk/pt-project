using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;

namespace PtApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);
        // services.AddAutoMapper(assembly); // Will add when we have profiles

        return services;
    }
}
