using QRCoder;
using System.Drawing.Imaging;
using System.IO;
using DlibDotNet;
using DlibDotNet.Extensions;
using OpenCvSharp;
using static QRCoder.PayloadGenerator;
using System.Text;
using System.Security.Cryptography;
using System.Drawing;
using ZXing;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using ZXing.QrCode;
using Microsoft.AspNetCore.Components.Forms;
using Newtonsoft.Json;

namespace Biometrics.Web.ApiClient
{
    public static class GlobalPaths
    {
        public static string RootPart = "D:\\DA\\BE\\";
        public static string ImagePart = "cbimage.png";
        public static string LandmarksPart = "D:\\DA\\BE\\Biometrics\\shape_predictor_68_face_landmarks.dat";
        public static string DlibPart = "D:\\DA\\BE\\Biometrics\\dlib_face_recognition_resnet_model_v1.dat";
    }
    public class BiometricApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly IWebHostEnvironment _env;

        public BiometricApiClient(HttpClient httpClient, IWebHostEnvironment env)
        {
            _httpClient = httpClient;
            _env = env;
            
        }

        // Phương thức đăng ký thông tin sinh trắc học
        public async Task<object> RegisterBiometricAsync(string faceData, string userName, string firstName, string middleName, string? lastName, string? gender, string? email, string? phoneNo,string password, CancellationToken cancellationToken = default)
        {
            password = Sha256(password);
            var requestBody = new
            {
                faceData,
                userName,
                firstName,
                middleName,
                lastName,
                gender,
                email,
                phoneNo,
                password,
            };
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/biometric/register", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy list response", ex);
            }
            return apiResponse;
        }
        public static string Sha256(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
        public async Task<string> ConvertToBase64DataUrl(IBrowserFile file)
        {
            // Define MIME type based on the file extension
            string mimeType = GetMimeType(file.Name);

            // Read the file into a byte array
            using (var memoryStream = new MemoryStream())
            {
                await file.OpenReadStream().CopyToAsync(memoryStream);
                byte[] buffer = memoryStream.ToArray();

                // Convert byte array to base64 string
                string base64String = Convert.ToBase64String(buffer);

                // Create base64 data URL
                return $"data:{mimeType};base64,{base64String}";
            }
        }

        // Helper method to get MIME type from file extension
        private string GetMimeType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            switch (extension)
            {
                case ".png":
                    return "image/png";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".gif":
                    return "image/gif";
                default:
                    return "application/octet-stream";
            }
        }
        public async Task<string> AnalyzeQR(string dataUrl)
        {

            byte[] imageBytes = Base64DataUrlToByteArray(dataUrl);
            //Stream stream = new MemoryStream(imageBytes);

            try
            {
                using (var image = SixLabors.ImageSharp.Image.Load<SixLabors.ImageSharp.PixelFormats.Rgba32>(imageBytes))
                {
                    var reader = new ZXing.ImageSharp.BarcodeReader<SixLabors.ImageSharp.PixelFormats.Rgba32>();
                    var result = reader.Decode(image);
                    return result?.Text;
                }
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc.Message);
                return null;
            }
        }
        public string ByteArrayToBase64DataUrl(byte[] byteArray, string format = "image/*")
        {
            var base64String = Convert.ToBase64String(byteArray);
            return $"data:{format};base64,{base64String}";


        }
        public byte[] Base64DataUrlToByteArray(string dataUrl)
        {
            string[] dataString = dataUrl.Split(";");
            string[] dataBase64String = dataString[1].Split(",");
            string base64String = dataBase64String[1];
            return Convert.FromBase64String(base64String);
        }
        public async Task<string> AnalyzeFace( string imagePath)
        {
            //// Chuyển đổi dữ liệu Base64 sang hình ảnh và lưu tạm
            //byte[] imageBytes = Convert.FromBase64String(base64Image.Split(',')[1]); // Bỏ phần 'data:image/png;base64,'
            //string tempFilePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.png");
            //System.IO.File.WriteAllBytes(tempFilePath, imageBytes);

            // Sử dụng hàm GetFaceData để lấy đặc điểm khuôn mặt
            string faceDescriptor = GetFaceData(imagePath);

            // Xóa file tạm
            //System.IO.File.Delete(tempFilePath);

            return faceDescriptor;
        }

        private string GetFaceData(string imagePath)
        {
            string shapePredictorPath = Path.Combine(_env.WebRootPath, "data/shape_predictor_68_face_landmarks.dat");
            string netModelPath = Path.Combine(_env.WebRootPath, "data/dlib_face_recognition_resnet_model_v1.dat");
            using (var detector = Dlib.GetFrontalFaceDetector())
            using (var sp = ShapePredictor.Deserialize(shapePredictorPath.Replace(@"\", "/")))
            using (var net = DlibDotNet.Dnn.LossMetric.Deserialize(netModelPath.Replace(@"\", "/")))
            using (var img = Dlib.LoadImageAsMatrix<RgbPixel>(imagePath))
            {
                var faces = new List<Matrix<RgbPixel>>();
                foreach (var face in detector.Operator(img))
                {
                    var shape = sp.Detect(img, face);
                    var faceChipDetail = Dlib.GetFaceChipDetails(shape, 150, 0.25);
                    var faceChip = Dlib.ExtractImageChip<RgbPixel>(img, faceChipDetail);
                    faces.Add(faceChip);
                }

                if (!faces.Any())
                    return string.Empty;

                var faceDescriptors = net.Operator(faces);
                var descriptor = faceDescriptors[0];

                return Convert.ToBase64String(descriptor.ToArray().SelectMany(BitConverter.GetBytes).ToArray());
            }
        }


        // Phương thức xác thực thông tin sinh trắc học
        public async Task<object> PositivelyBiometricAsync(string faceData, string dataQR, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                faceData,
                dataQR
            };

            var response = await _httpClient.PostAsJsonAsync("/biometric/positively", requestBody, cancellationToken);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>(cancellationToken: cancellationToken);
        }
        public async Task<ApiResponse<dynamic>> ListRegenerateQRAsync(string? userId, int pageIndex = 1, int pageSize = 0, CancellationToken cancellationToken = default)
        {
            var requestBody = new {
                userId,
                pageSize,
                pageIndex
            };
            var temp = Common.ServerEncrypt(JsonConvert.SerializeObject(requestBody), "application/json");


            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/biometric/ListregenerateQR", temp, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy list response", ex);
            }
            return apiResponse;
        }
        public async Task<object> ApproveRegenerateQRAsync( int id, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                id
            };
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/biometric/ApprregenerateQR", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy list response", ex);
            }
            return apiResponse;
        }
        public async Task<object> RejectRegenerateQRAsync(int id, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                id
            };
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/biometric/RejectregenerateQR", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy list response", ex);
            }
            return apiResponse;
        }
        //public static string GenerateQrCode(string data)
        //{
        //    using (var qrGenerator = new QRCodeGenerator())
        //    {
        //        var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        //        var qrCode = new QRCode(qrCodeData);
        //        using (var bitmap = qrCode.GetGraphic(20))
        //        {
        //            using (var stream = new MemoryStream())
        //            {
        //                bitmap.Save(stream, ImageFormat.Png);
        //                return $"data:image/png;base64,{Convert.ToBase64String(stream.ToArray())}";
        //            }
        //        }
        //    }
        //}
    }
}
