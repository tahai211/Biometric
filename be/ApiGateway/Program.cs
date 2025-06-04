using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;
using Ocelot.Administration;
using Serilog.Events;
using System.Configuration;
using Polly;
using APIGateway.Middleware;

namespace CIMP.ApiGateway
{
    public class Program
    {
        public static IHost BuildWebHost(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .UseKestrel()
                        .UseContentRoot(Directory.GetCurrentDirectory())
                        .ConfigureAppConfiguration((hostingContext, config) =>
                        {
                            //lấy biến ASPNETCORE_ENVIRONMENT từ launchSetting
                            var _env = hostingContext.HostingEnvironment.EnvironmentName;
                            Log.Information($"Environment: {_env}");
                            config
                                .SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                                .AddJsonFile("appsettings.json", true, true)
                                .AddJsonFile($"conf/ocelot.{_env}.json")
                                .AddEnvironmentVariables();
                        })
                        .ConfigureServices(o =>
                        {
                            o.AddOcelot();
                            //.AddDelegatingHandler<PublicApiRoutingHandler>()
                            //.AddAdministration("/administration", "secret");
                        })
                        .ConfigureLogging((hostingContext, loggingbuilder) =>
                        {
                            loggingbuilder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                            loggingbuilder.AddConsole();
                            loggingbuilder.AddDebug();
                        })
                        .UseIISIntegration()
                        .Configure(app =>
                        {
                            app.UseMiddleware<RequestResponseLoggingMiddleware>();
                            app.UseOcelot().Wait();
                        });
                })
                .UseSerilog((context, services, configuration) =>
                {
                    configuration.ReadFrom.Configuration(context.Configuration)
                                 .ReadFrom.Services(services);
                });

            return host.Build();
        }

        public static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            try
            {

                Log.Information("Starting up");
                BuildWebHost(args).Run();
            }
            catch (Exception ex)
            {
                if (ex is HostAbortedException)
                {
                    throw;
                }

                Log.Fatal(ex, "Host terminated unexpectedly!");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

    }

}

//using Serilog.Events;
//using Serilog;
//using CIMP.APIGateway.Middleware;
//using Ocelot.Middleware;
//using Ocelot.DependencyInjection;
//using Ocelot.Administration;
//using Microsoft.Extensions.Diagnostics.HealthChecks;
//using Microsoft.AspNetCore.Diagnostics.HealthChecks;

//try
//{
//    var configuration = new ConfigurationBuilder()
//                .AddJsonFile("appsettings.json")
//                .Build();
//    Log.Logger = new LoggerConfiguration()
//        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
//        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
//        .ReadFrom.Configuration(configuration)
//        .CreateLogger();

//    var builder = WebApplication.CreateBuilder(args);
//    //builder.Services
//    //.AddHealthChecks()
//    //.AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);
//    builder.Services.AddOcelot(builder.Configuration);
//    builder.Host.UseSerilog((context, services, loggerConfiguration) =>
//    {
//        // Configure here Serilog instance...
//        loggerConfiguration
//            .MinimumLevel.Information()
//            .Enrich.WithProperty("ApplicationContext", "Ocelot.APIGateway")
//            .Enrich.FromLogContext()
//            .WriteTo.Console()
//            .ReadFrom.Configuration(context.Configuration);
//    });
//    var environment = builder.Environment.EnvironmentName;
//    Log.Information($"Environment: {environment}");
//    builder.Configuration.AddJsonFile($"conf/ocelot.{environment}.json");
//    WebApplication app = builder.Build();

//    app.UseRouting();
//    app.UseAuthentication();
//    app.UseAuthorization();
//    app.UseEndpoints(_ => { });

//    // Map health check endpoints
//    //app.MapHealthChecks("/hc", new HealthCheckOptions()
//    //{
//    //    Predicate = _ => true,
//    //    //ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
//    //});

//    //app.MapHealthChecks("/liveness", new HealthCheckOptions
//    //{
//    //    Predicate = r => r.Name.Contains("self")
//    //});

//    //app.UseCors("CorsPolicy");

//    await app.UseOcelot();
//    await app.RunAsync();

//    // Add services to the container.
//    //var app = builder.Build();
//    // Configure the HTTP request pipeline.
//    //app.UseHttpsRedirection();
//    //app.Run();
//}
//catch (Exception ex)
//{
//    if (ex is HostAbortedException)
//    {
//        throw;
//    }
//    Log.Fatal(ex, "Host terminated unexpectedly!");
//}
//finally
//{
//    Log.CloseAndFlush();
//}