
using Biometrics.ApiService.DTO;
using Biometrics.ApiService.Infra.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Infra.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly BackgroundLogService _backgroundLogService;

        public LoggingMiddleware(RequestDelegate next, BackgroundLogService backgroundLogService)
        {
            _next = next;
            _backgroundLogService = backgroundLogService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string systemID = "CIMSAPI";
            string requestId = "CIMSAPI" + DateTime.Now.ToString("yyyyMMddHHmmss");
            string referenceId = "CIMSAPI" + DateTime.Now.ToString("yyyyMMddHHmmss");
            string userName = context.User?.FindFirst("username")?.Value ?? "";
            string requestEncrypt = "", requestDecypt = "";
            string responseEncrypt = "", responseDecypt = "";
            DateTime executionTime = DateTime.Now;
            long executionDuration = 0;
            string httpMethod = context.Request.Method;
            string url = context.Request.Path;
            string httpStatusCode = "";
            string exception = "";
            string clientIp = context.Request.Headers.TryGetValue("x-forwarded-for", out var ip) ? ip : context.Connection.RemoteIpAddress?.ToString();
            string browser = context.Request.Headers.TryGetValue("User-Agent", out var userAgent) ? userAgent.ToString() : "";
            string dataReq = "";

            // Đọc dữ liệu request body
            context.Request.EnableBuffering();
            using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true))
            {
                if (httpMethod == HttpMethods.Get)
                {
                    dataReq = string.Join("&", context.Request.Query.Select(q => $"{q.Key}={q.Value}"));
                }
                else
                {
                    dataReq = await reader.ReadToEndAsync();
                    if (context.Request.Path == "/api/auth/login")
                    {
                        dataReq = Utils.ChangeValueJson(dataReq, "password", "********");
                    }
                }
                context.Request.Body.Position = 0;
            }

            requestEncrypt = "";
            requestDecypt = dataReq;

            // Sao lưu body gốc của Response
            var originalBodyStream = context.Response.Body;
            using var memoryStream = new MemoryStream();
            context.Response.Body = memoryStream;

            var watch = Stopwatch.StartNew();
            try
            {
                await _next(context);
                watch.Stop();

                // Đọc dữ liệu response
                memoryStream.Seek(0, SeekOrigin.Begin);
                responseDecypt = await new StreamReader(memoryStream).ReadToEndAsync();
                responseEncrypt = "";

                // Ghi lại dữ liệu vào response body gốc
                memoryStream.Seek(0, SeekOrigin.Begin);
                await memoryStream.CopyToAsync(originalBodyStream);

                executionDuration = watch.ElapsedMilliseconds;
                httpStatusCode = context.Response.StatusCode.ToString();
                exception = "";
            }
            catch (Exception ex)
            {
                watch.Stop();
                executionDuration = watch.ElapsedMilliseconds;
                httpStatusCode = context.Response.StatusCode.ToString();
                exception = ex.Message;

                Log.Error(ex, "Error in LoggingMiddleware");

                // Ghi lỗi vào response
                var errorDetail = new ErrorDetailsDto
                {
                    StatusCode = context.Response.StatusCode = ex.Message.Contains("|") ? 415 : 406,
                    Message = ex.Message.Contains("|") ? ex.Message.Split('|')[1] : ex.Message
                };

                var errorData = JsonSerializer.Serialize(errorDetail);
                var errorBytes = Encoding.UTF8.GetBytes(errorData);

                context.Response.ContentType = "application/json";
                context.Response.ContentLength = errorBytes.Length;
                await originalBodyStream.WriteAsync(errorBytes, 0, errorBytes.Length);
            }
            finally
            {
                // Ghi log vào background service
                await _backgroundLogService.EnqueueLogEntryAsync(new LogDto
                {
                    system_id = systemID,
                    request_id = requestId,
                    reference_id = referenceId,
                    username = userName,
                    request_encrypt = requestEncrypt,
                    request_decypt = requestDecypt,
                    response_enctypt = responseEncrypt,
                    response_decypt = responseDecypt,
                    execution_time = executionTime,
                    execution_duration = executionDuration,
                    http_method = httpMethod,
                    url = url,
                    http_status_code = httpStatusCode,
                    exception = exception,
                    ip = clientIp,
                    browser = browser
                });

                // Reset Response Body về gốc
                context.Response.Body = originalBodyStream;
            }
        }
    }
}
