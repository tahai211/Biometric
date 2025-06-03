using System;
using System.Net;
using Newtonsoft.Json; // Giả định bạn dùng Newtonsoft.Json cho JSON deserialization
using Newtonsoft.Json.Linq;

namespace Biometrics.Web
{
    public class ApiResponse<T>
    {
        private T _response;
        public HttpStatusCode Code { get; set; }
        public string ErrorDesc { get; set; }

        public T Response
        {
            get
            {
                return _response;
            }
            set
            {

                
                    // Giải mã và lấy content và contentType từ ServerDecryptClient
                    var decryptedResponse = Common.ServerDecrypt(value.ToString());
                //JToken.Parse(content);
                // Chuyển đổi chuỗi đã giải mã về kiểu T dựa trên contentType
                _response = ConvertToT(decryptedResponse.content, decryptedResponse.contentType);
                
            }
        }

        public string ErrorCode { get; set; }

        // Hàm chuyển đổi chuỗi đã giải mã về kiểu T, dựa trên contentType
        private dynamic ConvertToT(string content, string contentType)
        {
            try
            {
                // Kiểm tra contentType để xử lý dữ liệu tương ứng
                switch (contentType)
                {
                    case ResposeType.ApplicationJson:
                        // Nếu là JSON, dùng JSON deserialization
                        return JToken.Parse(content);

                    case ResposeType.TextPlain:
                    case ResposeType.TextHtml:
                    case ResposeType.TextJavascript:
                    case ResposeType.TextCss:
                    case ResposeType.ApplicationXml:

                         return content;

                    default:
                        throw new InvalidOperationException($"Unsupported contentType: {contentType}");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error converting content: {ex.Message}", ex);
            }
        }
    }

    // Lớp giả định cho ResposeType chứa các loại contentType
    public class ResposeType
    {
        public const string ApplicationJson = "application/json";
        public const string TextPlain = "text/plain";
        public const string TextHtml = "text/html";
        public const string TextJavascript = "text/javascript";
        public const string TextCss = "text/css";
        public const string ApplicationXml = "application/xml";
    }
}
