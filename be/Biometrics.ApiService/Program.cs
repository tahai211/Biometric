using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Middleware;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Models.User;
using Biometrics.ApiService.Service.Biomertric;
using Biometrics.ApiService.Service.Cache;
using Biometrics.ApiService.Service.Policy;
using Biometrics.ApiService.Service.Portal;
using Biometrics.ApiService.Service.Role;
using Biometrics.ApiService.Service.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using StackExchange.Redis;
using System;
using System.Reflection;
using System.Text;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using ZiggyCreatures.Caching.Fusion;
using ZiggyCreatures.Caching.Fusion.Backplane.StackExchangeRedis;
using ZiggyCreatures.Caching.Fusion.Serialization.NewtonsoftJson;
using Biometrics.ApiService.Infra.Common;
using Microsoft.AspNetCore.Authorization;
using Biometrics.ApiService.Infra.Permission;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using MassTransit;
using Biometrics.ApiService.Infra;

var builder = WebApplication.CreateBuilder(args);

// Load cấu hình appsettings.json (mặc định đã load trong CreateBuilder rồi)

// Cấu hình Serilog từ appsettings.json
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Cấu hình JwtSettings từ appsettings.json
builder.Services.Configure<JWT>(builder.Configuration.GetSection("AppSettings"));

// Cấu hình Authentication - JWT Bearer
var secret = Utils.Decrypt(builder.Configuration["App:secret_key"] ?? "", true);
var key = Encoding.ASCII.GetBytes(secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer( x =>
    {
        x.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                return Task.CompletedTask;
            }
        };
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .AddAuthenticationSchemes("Bearer")
        .Build();

    void AddPolicy(string permission) => options.AddPolicy(
        permission,
        policy => policy.Requirements.Add(new PermissionRequirement(permission)));

    var dataPermission = new List<string>();// PermissionConst.getPermission();
    foreach (var item in dataPermission)
    {
        AddPolicy(item);
    }
});



builder.Services.AddMemoryCache(); // In-memory
// Cấu hình Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.InstanceName = builder.Configuration["redis:instance"];
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions()
    {
        EndPoints = { builder.Configuration["redis:connection"] ?? "" },
        Password = builder.Configuration["redis:password"],
        AbortOnConnectFail = true,
        ConnectTimeout = 30000,
        AllowAdmin = true,
        AsyncTimeout = 30000,
        ConnectRetry = 3,
    };
});
//Cấu hình HybridCache để dùng cả redis và memory
var redisOptions = new RedisCacheOptions
{
    ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions
    {
        EndPoints = { builder.Configuration["redis:connection"] ?? "localhost:6379" },
        Password = builder.Configuration["redis:password"],
        AbortOnConnectFail = true,
        ConnectTimeout = 30000,
        AllowAdmin = true,
        AsyncTimeout = 30000,
        ConnectRetry = 3
    }
};
//FusionCache Config
builder.Services.AddFusionCache()
    .WithOptions(options =>
    {
        options.DistributedCacheCircuitBreakerDuration = TimeSpan.FromSeconds(2);

        options.FailSafeActivationLogLevel = LogLevel.Debug;
        options.SerializationErrorsLogLevel = LogLevel.Warning;
        options.DistributedCacheSyntheticTimeoutsLogLevel = LogLevel.Debug;
        options.DistributedCacheErrorsLogLevel = LogLevel.Error;
        options.FactorySyntheticTimeoutsLogLevel = LogLevel.Debug;
        options.FactoryErrorsLogLevel = LogLevel.Error;
    })
    .WithDefaultEntryOptions(new FusionCacheEntryOptions
    {
        Duration = TimeSpan.FromMinutes(30),

        IsFailSafeEnabled = true,
        FailSafeMaxDuration = TimeSpan.FromHours(1),
        FailSafeThrottleDuration = TimeSpan.FromSeconds(1),

        FactorySoftTimeout = TimeSpan.FromMilliseconds(500),
        //Nếu Redis lỗi nhiều lần, sẽ “ngắt mạch” (circuit breaker) trong 2 giây
        FactoryHardTimeout = TimeSpan.FromMilliseconds(2000),
    })
    //.WithSerializer(
    //    //Dùng Newtonsoft.Json để serialize/deserialize object khi lưu vào Redis.
    //    new FusionCacheNewtonsoftJsonSerializer()
    //)
    //.WithDistributedCache(
    //    new RedisCache(new RedisCacheOptions() { Configuration = builder.Configuration["redis:connection"] ?? "" })
    //)
    //.WithBackplane(
    //    //Cho phép invalid cache theo nhóm giữa nhiều instance (rất quan trọng trong load balancing).
    //    new RedisBackplane(new RedisBackplaneOptions() { Configuration = builder.Configuration["redis:connection"] ?? "" })
    //);
     //Dùng Newtonsoft.Json để serialize/deserialize object khi lưu vào Redis.
    .WithSerializer(new FusionCacheNewtonsoftJsonSerializer())
    .WithDistributedCache(new RedisCache(redisOptions))
    //Cho phép invalid cache theo nhóm giữa nhiều instance (rất quan trọng trong load balancing).
    .WithBackplane(new RedisBackplane(new RedisBackplaneOptions
    {
        Configuration = $"{builder.Configuration["redis:connection"]},password={builder.Configuration["redis:password"]}"
    }));
// Add anti-forgery services
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});
//var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>();
var allowedOrigins = builder.Configuration["App:CorsOrigins"]?.Split(',');
Log.Information("CorsOrigins: {0}", allowedOrigins);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            if (allowedOrigins != null)
            {
                builder.WithOrigins(allowedOrigins)
                                   .AllowAnyHeader()
                                   .AllowAnyMethod()
                                   .AllowCredentials();
            }
        });
});

//ussing masstransit for RabitMQ
builder.Services.AddMassTransit(x =>
{
    x.SetKebabCaseEndpointNameFormatter();

    x.AddConsumer<LogConsumer>(); // Consumer xử lý LogDto

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"]);
            h.Password(builder.Configuration["RabbitMQ:Password"]);
        });

        cfg.ReceiveEndpoint("log-queue", e =>
        {
            e.ConfigureConsumer<LogConsumer>(context);
        });
    });
});



//builder.Services.AddOpenTelemetry() // Cài đặt OpenTelemetry (cần package OpenTelemetry.Extensions.Hosting)

//    .ConfigureResource(r => r.AddService("dotnet-app", serviceInstanceId: Environment.MachineName))
//    // Đặt tên service là "dotnet-app" và đặt instance id là tên máy

//    .WithMetrics(meterBuilder => meterBuilder
//        .AddAspNetCoreInstrumentation() // Thu thập metrics cho ASP.NET Core (số request, độ trễ, ...)
//        .AddHttpClientInstrumentation() // Thu thập metrics cho HttpClient (các request HTTP outbound)
//        .AddRuntimeInstrumentation() // Thu thập metrics runtime (.NET GC, heap, thread count, ...)
//        .AddProcessInstrumentation() // Thu thập metrics về tiến trình (CPU, memory)
//        .AddPrometheusExporter() // Xuất metrics theo định dạng Prometheus (thường để Prometheus server scrape)
//    )

//    .WithTracing(tracing => tracing
//        .AddAspNetCoreInstrumentation(options =>
//        {
//            // Có thể dùng Filter để bỏ qua đo lường 1 số route, ví dụ /metrics
//        })
//    );


// Cấu hình Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "BIOMETRIC API",
        Description = "BIOMETRIC API",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Shayne Boyer",
            Email = string.Empty,
            Url = new Uri("https://twitter.com/spboyer"),
        },
        License = new OpenApiLicense
        {
            Name = "Use under LICX",
            Url = new Uri("https://example.com/license"),
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Đăng ký các service trong DI container
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"))
);

builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IBiomertricService, BiomertricService>();
builder.Services.AddTransient<IPolicyService, PolicyService>();
builder.Services.AddTransient<IRoleService, RoleService>();
builder.Services.AddTransient<IPortalService, PortalService>();
builder.Services.AddScoped<ICacheSerrvice, CacheService>();

// Tạo app
var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Biometrics.ApiService V1");
});

// Nếu bạn có middleware custom
// app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<RoleCheckMiddleware>();

app.MapControllers();

try
{
    Log.Information("Starting Biometrics.ApiService");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application failed to start correctly");
}
finally
{
    Log.CloseAndFlush();
}
