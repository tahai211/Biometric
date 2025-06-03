using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Common;
using System.Text;
using Microsoft.AspNetCore.Mvc.Controllers;
using Biometrics.ApiService.Infra.Constans;

namespace Biometrics.ApiService.Infra.Attributes
{
    public class DecryptInputAttribute : ActionFilterAttribute
    {


        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Lấy dữ liệu từ request (ví dụ từ query string hoặc body)
            //string publicKeyPem = string.Empty;
            try
            {

                var request = context.HttpContext.Request;
                request.EnableBuffering(); // Cho phép đọc lại request body nhiều lần
                request.Body.Position = 0;

                using (var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true))
                {
                    string requestBody = await reader.ReadToEndAsync();
                    request.Body.Position = 0; // Đặt lại vị trí của stream về đầu để các middleware khác có thể sử dụng request body

                    if (requestBody.StartsWith("\"") && requestBody.EndsWith("\""))
                    {
                        requestBody = requestBody.Substring(1, requestBody.Length - 2).Replace("\\u002B", "+");
                    }

                    // Giải mã dữ liệu
                    var decryptedContent = EE2E.ServerDecrypt(requestBody, RSAKey.PrivateKey).content;
                    if (decryptedContent == null)
                    {
                        await next();
                        return;
                    }

                    var decryptedData = JsonConvert.DeserializeObject<Dictionary<string, object>>(decryptedContent);

                    // Duyệt qua tất cả các tham số của action
                    var parameters = ((ControllerActionDescriptor)context.ActionDescriptor).Parameters;
                    foreach (var parameter in parameters)
                    {
                        var parameterName = parameter.Name;

                        // Kiểm tra xem decryptedData có chứa khóa tương ứng với tham số không
                        if (decryptedData.ContainsKey(parameterName))
                        {
                            // Gán giá trị từ decryptedData vào ActionArguments
                            context.ActionArguments[parameterName] = decryptedData[parameterName];
                        }
                    }

                    // Tiếp tục thực thi hành động
                    await next();
                    Console.WriteLine("DecryptInputAttribute: Kết thúc xử lý filter.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi ra console hoặc hệ thống log để kiểm tra nguyên nhân
                Console.WriteLine($"Error in DecryptInputAttribute: {ex.Message}");
        
                // Bạn có thể trả lỗi 400 nếu cần dừng request tại đây
                //context.Result = new BadRequestObjectResult("Lỗi trong quá trình giải mã hoặc xử lý request.");
            }
        }
    }
}