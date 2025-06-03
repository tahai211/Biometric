﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Middleware;
using Biometrics.ApiService.Models.User;
using Biometrics.ApiService.Service.Biomertric;
using Biometrics.ApiService.Service.Policy;
using Biometrics.ApiService.Service.Portal;
using Biometrics.ApiService.Service.Role;
using Biometrics.ApiService.Service.User;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Reflection;
using System.Text;
using Biometrics.ApiService.Infra.Attributes;
using Quartz;

namespace Biometrics.ApiService
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Cấu hình JwtSettings từ appsettings.json
            services.Configure<JWT>(Configuration.GetSection("AppSettings"));

            // Đăng ký xác thực JWT
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = true;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidIssuer = Configuration["AppSettings:JwtIssuer"],
                    ValidAudience = Configuration["AppSettings:JwtAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["AppSettings:JwtKey"])),
                    ClockSkew = TimeSpan.Zero
                };
            });
            //services.AddQuartz(q =>
            //{
            //    q.UsePersistentStore(storeOptions =>
            //    {
            //        storeOptions.UseProperties = true;
            //        storeOptions.UseSqlServer("Server=DESKTOP-64VAPQE\\MSSQLSERVERTAHAI;Database=DBBiometric;Trusted_Connection=True;Encrypt=False;");
            //        storeOptions.UseClustering();
            //        options.UseJsonSerializer();
            //    });
            //});
            //services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

            // Đăng ký và cấu hình cho Swagger
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "v1",
                    Title = "BIOMETRIC API",
                    Description = "BIOMETRIC API",
                    TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact
                    {
                        Name = "Shayne Boyer",
                        Email = string.Empty,
                        Url = new Uri("https://twitter.com/spboyer"),
                    },
                    License = new Microsoft.OpenApi.Models.OpenApiLicense
                    {
                        Name = "Use under LICX",
                        Url = new Uri("https://example.com/license"),
                    }
                });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            // Đăng ký dịch vụ
            services.AddControllers();

            // Đăng ký DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("Default"))
            );

            //services.AddHttpsRedirection(options =>
            //{
            //    options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
            //    options.HttpsPort = 9991; // Cổng sử dụng cho HTTPS
            //});

            // Đăng ký UserService vào DI container
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IBiomertricService, BiomertricService>();
            services.AddTransient<IPolicyService, PolicyService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<IPortalService, PortalService>();
            //services.AddControllers(options =>
            //{
            //    options.Filters.Add<DecryptInputAttribute>();
            //});
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Cấu hình middleware của bạn ở đây (ví dụ: routing, logging, ...).
            if (env.IsDevelopment())
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

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Biometrics.ApiService V1");
            });

            app.UseMiddleware<RoleCheckMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers(); // Đăng ký các Controllers trong dự án của bạn.
            });
        }
    }
}
