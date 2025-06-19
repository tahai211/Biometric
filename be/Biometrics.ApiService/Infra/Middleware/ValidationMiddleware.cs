using System.Text.Json;
//using FluentValidation;
//using FluentValidation.Results;

namespace Biometrics.ApiService.Infra.Middleware
{
    public class ValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceProvider _serviceProvider;

        public ValidationMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
        {
            _next = next;
            _serviceProvider = serviceProvider;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Method is "POST" or "PUT" or "PATCH")
            {
                var endpoint = context.GetEndpoint();
                var actionDescriptor = endpoint?.Metadata
                    .GetMetadata<Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor>();

                var parameter = actionDescriptor?.Parameters
                    .FirstOrDefault(p => p.ParameterType.IsClass && p.BindingInfo?.BindingSource?.Id == "Body");

                if (parameter == null)
                {
                    await _next(context); return;
                }

                var bodyType = parameter.ParameterType;

                object model = null;

                if (context.Request.ContentType?.StartsWith("application/json") == true)
                {
                    context.Request.EnableBuffering();
                    using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                    var bodyString = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;

                    model = JsonSerializer.Deserialize(bodyString, bodyType, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else if (context.Request.ContentType?.StartsWith("multipart/form-data") == true)
                {
                    var form = await context.Request.ReadFormAsync();
                    model = Activator.CreateInstance(bodyType);

                    foreach (var prop in bodyType.GetProperties())
                    {
                        if (prop.SetMethod == null || !prop.SetMethod.IsPublic) continue;

                        if (typeof(IFormFile).IsAssignableFrom(prop.PropertyType))
                        {
                            var file = form.Files.FirstOrDefault(f => f.Name == prop.Name);
                            if (file != null)
                                prop.SetValue(model, file);
                        }
                        else if (prop.PropertyType == typeof(string) && form.TryGetValue(prop.Name, out var value))
                        {
                            prop.SetValue(model, value.ToString());
                        }
                        else if (form.TryGetValue(prop.Name, out var rawValue))
                        {
                            try
                            {
                                var converted = Convert.ChangeType(rawValue.ToString(), prop.PropertyType);
                                prop.SetValue(model, converted);
                            }
                            catch { /* ignore conversion errors */ }
                        }
                    }
                }

                if (model != null)
                {
                    //var validatorType = typeof(IValidator<>).MakeGenericType(bodyType);
                    //var validator = _serviceProvider.GetService(validatorType);

                    //if (validator != null)
                    //{
                    //    dynamic dynamicValidator = validator;
                    //    dynamic dynamicContext = Activator.CreateInstance(typeof(ValidationContext<>).MakeGenericType(bodyType), model);

                    //    ValidationResult validationResult = await dynamicValidator.ValidateAsync(dynamicContext);

                    //    if (!validationResult.IsValid)
                    //    {
                    //        var errors = validationResult.Errors
                    //            .GroupBy(x => x.PropertyName)
                    //            .ToDictionary(
                    //                g => g.Key,
                    //                g => g.Select(x => x.ErrorMessage).ToArray()
                    //            );

                    //        context.Response.StatusCode = StatusCodes.Status200OK;
                    //        context.Response.ContentType = "application/json";

                    //        var firstError = errors.FirstOrDefault();
                    //        var firstErrorMessage = firstError.Value?.FirstOrDefault() ?? "Validation error";

                    //        await context.Response.WriteAsync(JsonSerializer.Serialize(new
                    //        {
                    //            resCode = "203",
                    //            resDesc = firstErrorMessage,
                    //        }));
                    //        return;
                    //    }
                    //}
                }
            }

            await _next(context);
        }
    }
}
