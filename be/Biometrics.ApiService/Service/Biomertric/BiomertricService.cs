using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Numerics;
using System.Drawing;
using Microsoft.EntityFrameworkCore;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using System.IO.Compression;
using DlibDotNet;
using DlibDotNet.Extensions;
using OpenCvSharp;
using System.Drawing;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection;
using System.Text.RegularExpressions;
using Biometrics.ApiService.DTO.Entity;
using DlibDotNet.ImageDatasetMetadata;
using static QRCoder.PayloadGenerator;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;

namespace Biometrics.ApiService.Service.Biomertric
{
    public static class GlobalPaths
    {
        public static string RootPart = "D:\\DA\\BE\\";
        public static string ImagePart = "cbimage.png";
        public static string LandmarksPart = "shape_predictor_68_face_landmarks.dat";
        public static string DlibPart = "dlib_face_recognition_resnet_model_v1.dat";
    }
    public class BiomertricService : IBiomertricService
    {
        private readonly AppDbContext _context;
        //private static VideoCapture vs;
        //private static Mat outputFrame;
        private static object lockObj = new object();
        private static bool verifyFlag = false;
        private static DateTime timeoutStart;
        private static int recordId;
        private static List<double> faceData;

        public BiomertricService(AppDbContext context)
        {
            _context = context;
        }
        #region Register
        //Sử Dụng Dịch Vụ Quản Lý Bí Mật: Thay vì lấy khóa công khai từ cơ sở dữ liệu, hãy sử dụng dịch vụ quản lý bí mật để bảo mật khóa.Dịch vụ như AWS Secrets Manager, Azure Key Vault, hoặc Google Cloud Secret Manager có thể giúp bảo mật khóa công khai và bí mật.
        public async ValueTask<string> RegisterBiomertric(string? faceData, string? userName, string? firstName, string? middleName
            , string? lastName, string? gender, string? email, string? phoneNo, string? password)
        {
            var userId = await UpdateUser(userName, firstName, middleName, lastName, gender, email, phoneNo, password, null, "");
            faceData = Compress(faceData);//nén dữ liệu 
            string publicKeyPem = string.Empty;
            var keypem = await _context.ApiEncryptionTypes
            .Where(x => x.EncryptId == "IDPE")
            .Select(x => x.ParamData)
            .FirstOrDefaultAsync();

            if (keypem == null)
            {
                return "";
            }
            JObject dataParam = JsonConvert.DeserializeObject<JObject>(keypem);
            publicKeyPem = dataParam["DefaultValue"]?["PublicKey"]?.ToString();
            string privateKeyPemValue = dataParam["DefaultValue"]?["PrivateKey"]?.ToString();
            //mã hóa aes bằng key 
            var userLogin = await _context.SysUserLogins.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            var userPass = await _context.SysPasswords.Where(x => x.LoginId == userLogin.LoginId).FirstOrDefaultAsync();
            var aesEncrypt = Encryption.AESEncrypt(faceData, userPass.PasswordTemp);
            //mã hóa chuỗi băm bằng RSA 
            string message = $"{userId}.{aesEncrypt}";
            string aesPassEn = string.Empty;
            aesPassEn = EE2E.ServerEncrypt(message, "Text", publicKeyPem);
            string signature = Sign(message, privateKeyPemValue); ;
            message = $"{aesPassEn}.{signature}";
            return message;
        }
        private string Compress(string data)
        {
            byte[] dataBytes = Encoding.UTF8.GetBytes(data);
            using (MemoryStream output = new MemoryStream())
            {
                using (GZipStream gzip = new GZipStream(output, CompressionMode.Compress))
                {
                    gzip.Write(dataBytes, 0, dataBytes.Length);
                }
                return Convert.ToBase64String(output.ToArray());
            }
        }

        private string Decompress(string compressedData)
        {
            byte[] compressedBytes = Convert.FromBase64String(compressedData);
            using (MemoryStream input = new MemoryStream(compressedBytes))
            using (GZipStream gzip = new GZipStream(input, CompressionMode.Decompress))
            using (MemoryStream output = new MemoryStream())
            {
                gzip.CopyTo(output);
                return Encoding.UTF8.GetString(output.ToArray());
            }
        }
        public static string Sign(string message, string privateKeyPem)
        {
            try
            {
                // Xóa các phần không cần thiết trong PEM
                string key = Regex.Replace(privateKeyPem, @"-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----|\s", "");

                // Chuyển đổi từ Base64 sang byte array
                byte[] keyBytes = Convert.FromBase64String(key);

                // Tính giá trị hash của thông điệp
                byte[] hashBytes;
                using (SHA256 sha256 = SHA256.Create())
                {
                    hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(message));
                }

                // Tạo chữ ký bằng cách sử dụng thuật toán RSA
                byte[] signatureBytes;
                using (RSA rsa = RSA.Create())
                {
                    rsa.ImportRSAPrivateKey(keyBytes, out _);

                    // Sử dụng PSS padding và SHA-256 cho ký
                    signatureBytes = rsa.SignHash(hashBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pss);
                }

                // Chuyển đổi chữ ký thành chuỗi hex
                return BitConverter.ToString(signatureBytes).Replace("-", "").ToLower();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        #endregion
        #region RegenerateQR
        public async ValueTask<object> RegenerateQR(string name, string phone,string password, string faceData)
        {
            var userInfo = await _context.SysUsers.Where(x => x.PhoneNo == phone && x.FullName.ToLower().Replace(" ","").Equals(name.ToLower().Replace(" ", ""))).FirstOrDefaultAsync();
            if (userInfo != null)
            {
                var user = await _context.SysUserLogins.Where(x => x.UserId == userInfo.UserId).FirstOrDefaultAsync();
                string userId = userInfo.UserId;
                password = Encryption.EncryptPassword(user.LoginId, password);
                if (await _context.SysPasswords.AnyAsync(x => x.LoginId == user.LoginId && x.Password == password && x.ServiceId == "MB"))
                {
                    if(await _context.SysRequestRegenerateQRs.AnyAsync(x => x.UserId == userId && x.Status == "P"))
                    {
                        throw new SysException("requestisexited", "Request is exited");
                    }
                    SysRequestRegenerateQR sysRequestRegenerateQR = new SysRequestRegenerateQR();
                    sysRequestRegenerateQR.UserId = userId;
                    sysRequestRegenerateQR.FaceData = faceData;
                    sysRequestRegenerateQR.Status = "P";
                    sysRequestRegenerateQR.UserCreated = "SYS";
                    sysRequestRegenerateQR.DateCreated = DateTime.Now;
                    _context.SysRequestRegenerateQRs.Add(sysRequestRegenerateQR);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    throw new SysException("incorrectinformation", "incorrect information");
                }
            }
            else
            {
                throw new SysException("incorrectinformation", "incorrect information");
            }

        }
        public async ValueTask<object> ListRegenerateQR(string? userId, int pageIndex = 0, int pageSize = 15)
        {
            int skip = ((pageIndex - 1) * pageSize);

            var lstPages = await _context.SysRequestRegenerateQRs.AsQueryable().Where(x => (string.IsNullOrEmpty(userId) || x.UserId == userId) && x.Status == "P"
                ).Select(x => new
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    Status = x.Status
                }).ToListAsync();
            var total = lstPages.Count();
            if (pageSize != 0)
            {
                var data = lstPages.Skip(skip).Take(pageSize);
                int pages = lstPages.Count() % pageSize >= 1 ? lstPages.Count() / pageSize + 1 : lstPages.Count() / pageSize;
                return new { data = data, pages = pages, total = total };
            }
            else
            {
                return new { data = lstPages, pages = 0 };
            }
        }
        public async ValueTask<bool> RejectRegenerateQR(int? id)
        {
            var request = await _context.SysRequestRegenerateQRs.Where(x => x.Id == id && x.Status == "P").FirstOrDefaultAsync();
            if (request == null)
            {
                throw new SysException("requestisnotexited", "Request is not exited");
            }
            else {
                request.Status = "D";

            }
            await _context.SaveChangesAsync();
            return true;
        }
        public async ValueTask<string> ApproveRegenerateQR( int? id)
        {
            var request = await _context.SysRequestRegenerateQRs.Where(x => x.Id == id && x.Status == "P").FirstOrDefaultAsync();
            if (request == null)
            {
                throw new SysException("requestisnotexited", "Request is not exited");
            }
            var userInfo = await _context.SysUsers.Where(x => x.UserId == request.UserId).FirstOrDefaultAsync();
            string faceData = Compress(request.FaceData);//nén dữ liệu 
            string publicKeyPem = string.Empty;
            var keypem = await _context.ApiEncryptionTypes
            .Where(x => x.EncryptId == "IDPE")
            .Select(x => x.ParamData)
            .FirstOrDefaultAsync();

            if (keypem == null)
            {
                return "";
            }
            dynamic personal = new
            {
                FirstName = userInfo.FirstName,
                MiddleName = userInfo.MiddleName,
                LastName = userInfo.LastName,
                Gender = userInfo.Gender,
                Email = userInfo.Email,
                PhoneNo = userInfo.PhoneNo
            };
            JObject dataParam = JsonConvert.DeserializeObject<JObject>(keypem);
            publicKeyPem = dataParam["DefaultValue"]?["PublicKey"]?.ToString();
            string privateKeyPemValue = dataParam["DefaultValue"]?["PrivateKey"]?.ToString();
            //mã hóa aes bằng key 
            //string personalInfo = JsonConvert.SerializeObject(personal);
            var userLogin = await _context.SysUserLogins.Where(x => x.UserId == request.UserId).FirstOrDefaultAsync();
            var userPass = await _context.SysPasswords.Where(x => x.LoginId == userLogin.LoginId).FirstOrDefaultAsync();
            var aesEncrypt = Encryption.AESEncrypt(faceData, userPass.PasswordTemp);
            //lấy chuỗi mã hóa băm bằng sha256 
            //var sha512Hash = Encryption.Sha512(aesEncrypt);
            //mã hóa chuỗi băm bằng RSA 
            string message = $"{userInfo.UserId}.{aesEncrypt}";
            string aesPassEn = string.Empty;
            //using (RSA rsa = RSA.Create())
            //{
            //    rsa.ImportFromPem(publicKeyPem);
            //    aesPassEn = Encryption.RSAEncrypt(message, rsa.ExportParameters(false), true);
            //}
            aesPassEn = EE2E.ServerEncrypt(message, "Text", publicKeyPem);

            string signature = Sign(message, privateKeyPemValue); ;
            message = $"{aesPassEn}.{signature}";
            request.Status = "A";
            await _context.SaveChangesAsync();
            return message;
        }
        #endregion
        #region Check
        public async ValueTask<object> PositivelyBiomertric(string faceData, string dataQR)
        {
            string publicKeyPem = string.Empty;
            var keypem = await _context.ApiEncryptionTypes
            .Where(x => x.EncryptId == "IDPE")
            .Select(x => x.ParamData)
            .FirstOrDefaultAsync();

            if (keypem == null)
            {
                return "";
            }
            JObject dataParam = JsonConvert.DeserializeObject<JObject>(keypem);
            publicKeyPem = dataParam["DefaultValue"]?["PublicKey"]?.ToString();
            string privateKeyPemValue = dataParam["DefaultValue"]?["PrivateKey"]?.ToString();
            if (string.IsNullOrEmpty(privateKeyPemValue))
            {
                throw new SysException("", "Private key not found");
            }
            var qrData = dataQR;
            var parts = qrData.Split('.');
            if (parts.Length != 2)
            {
                throw new SysException("", "Invalid QR Code data");
            }
            var encryptedMessage = parts[0];
            var signature = parts[1];
            string decryptedMessage;
            var result = EE2E.ServerDecrypt(encryptedMessage.Trim('"'), privateKeyPemValue);
            decryptedMessage = string.IsNullOrEmpty(result.Item1) ? null : result.Item1;
            // Kiểm tra chữ ký
            if (!VerifySign(decryptedMessage, signature, publicKeyPem))
            {
                throw new SysException("", "Invalid signature");
            }
            var messageParts = decryptedMessage.Split('.');
            if (messageParts.Length != 2)
            {
                throw new SysException("", "Invalid decrypted message format");
            }
            string userId = messageParts[0];
            string FaceData = messageParts[1];
            //string aesEncryptedInfo = messageParts[2];
            var userLogin = await _context.SysUserLogins.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            var userPass = await _context.SysPasswords.Where(x => x.LoginId == userLogin.LoginId).FirstOrDefaultAsync();
            // Giải mã AES
            FaceData = Encryption.AESDecrypt(FaceData, userPass.PasswordTemp);
            FaceData = Decompress(FaceData);
            // Xác thực khuôn mặt
            if (!ValidateFaceData(FaceData, faceData))
            {
                throw new SysException("", "Face data does not match");
            }
            // Tạo phản hồi xác thực thành công
            return new
            {
                UserId = userId
            };
        }

        private string DecryptQRCode(string qrCodeData)
        {
            // Giả sử bạn có hàm để giải mã QR Code
            return qrCodeData; // Placeholder, thay thế bằng hàm giải mã thực sự
        }
        // Kiểm tra chữ ký
        /// <summary>
        /// 
        /// </summary>
        /// <param name="message">thông điệp cần xác thực</param>
        /// <param name="signatureHex">chuỗi chữ ký số</param>
        /// <returns></returns>
        public static bool VerifySign(string message, string signatureHex, string publicKeyPem)
        {
            try
            {
                // Xóa các phần không cần thiết trong PEM
                string key = Regex.Replace(publicKeyPem, @"-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s", "");

                // Chuyển đổi từ Base64 sang byte array
                byte[] keyBytes = Convert.FromBase64String(key);

                // Tính giá trị hash của thông điệp
                byte[] messageBytes = Encoding.UTF8.GetBytes(message);
                byte[] hashBytes;
                using (SHA256 sha256 = SHA256.Create())
                {
                    hashBytes = sha256.ComputeHash(messageBytes);
                }

                // Chuyển đổi chữ ký từ chuỗi hex sang byte array
                byte[] signatureBytes = Enumerable.Range(0, signatureHex.Length / 2)
                    .Select(x => Convert.ToByte(signatureHex.Substring(x * 2, 2), 16))
                    .ToArray();

                // Xác minh chữ ký bằng RSA
                using (RSA rsa = RSA.Create())
                {
                    rsa.ImportSubjectPublicKeyInfo(keyBytes, out _);

                    // Sử dụng PSS padding và SHA-256 cho xác minh chữ ký
                    return rsa.VerifyHash(hashBytes, signatureBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pss);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }
        //private bool ValidateFaceData(string storedFaceData, string providedFaceData)
        //{
        //    // Chuyển đổi chuỗi Base64 thành đối tượng Mat của OpenCvSharp
        //    Mat ConvertBase64ToMat(string base64String)
        //    {
        //        var imageBytes = Convert.FromBase64String(base64String);
        //        using (var ms = new MemoryStream(imageBytes))
        //        {
        //            return Cv2.ImDecode(ms.ToArray(), ImreadModes.Color);
        //        }
        //    }

        //    // Chuyển đổi từ OpenCvSharp.Mat sang DlibDotNet.Matrix<RgbPixel>
        //    Matrix<RgbPixel> ConvertMatToDlibMatrix(Mat mat)
        //    {
        //        var height = mat.Rows;
        //        var width = mat.Cols;
        //        var dlibMatrix = new Matrix<RgbPixel>(height, width);

        //        for (int y = 0; y < height; y++)
        //        {
        //            for (int x = 0; x < width; x++)
        //            {
        //                var color = mat.At<Vec3b>(y, x);
        //                dlibMatrix[y, x] = new RgbPixel { Red = color.Item2, Green = color.Item1, Blue = color.Item0 };
        //            }
        //        }

        //        return dlibMatrix;
        //    }

        //    using (var detector = Dlib.GetFrontalFaceDetector())
        //    using (var sp = ShapePredictor.Deserialize(Path.Combine(GlobalPaths.RootPart, GlobalPaths.LandmarksPart).Replace(@"\", "/")))
        //    using (var facerec = DlibDotNet.Dnn.LossMetric.Deserialize(Path.Combine(GlobalPaths.RootPart, GlobalPaths.DlibPart).Replace(@"\", "/")))
        //    {
        //        var storedImg = ConvertBase64ToMat(providedFaceData);

        //        if (storedImg.Empty() )
        //            return false;

        //        // Chuyển đổi từ Mat của OpenCvSharp sang Dlib Matrix
        //        var storedMatrix = ConvertMatToDlibMatrix(storedImg);

        //        try
        //        {
        //            // Phát hiện khuôn mặt trong các ảnh đã đọc
        //            var storedFaces = detector.Operator(storedMatrix);

        //            // Kiểm tra xem có khuôn mặt nào được phát hiện hay không
        //            if (storedFaces.Length == 0)
        //                return false;

        //            // Dự đoán các điểm đặc trưng trên khuôn mặt
        //            var storedShape = sp.Detect(storedMatrix, storedFaces[0]);

        //            // Tạo các danh sách chứa khuôn mặt và các điểm đặc trưng
        //            var storedFaceList = new List<Matrix<RgbPixel>> { Dlib.ExtractImageChip<RgbPixel>(storedMatrix, Dlib.GetFaceChipDetails(storedShape, 150, 0.25)) };


        //            var storedFaceDescriptors = facerec.Operator(storedFaceList);

        //            // So sánh mô tả của hai khuôn mặt bằng cách tính khoảng cách Euclid giữa chúng
        //            var storedDescriptor = storedFaceDescriptors[0];
        //            var providedDescriptor = DecodeBase64ToMatrix(storedFaceData,128);
        //            var distance = Dlib.Length(storedDescriptor - providedDescriptor);

        //            return distance < 0.6; // Ngưỡng để coi hai khuôn mặt là giống nhau
        //        }
        //        finally
        //        {
        //            // Giải phóng tài nguyên
        //            storedMatrix.Dispose();
        //        }
        //    }
        //}
        private bool ValidateFaceData(string storedFaceData, string providedFaceData)
        {
            //using (var detector = Dlib.GetFrontalFaceDetector())
            //using (var sp = ShapePredictor.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.LandmarksPart).Replace(@"\", "/")))
            //using (var net = DlibDotNet.Dnn.LossMetric.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.DlibPart).Replace(@"\", "/")))
            //using (var img = Dlib.LoadImageAsMatrix<RgbPixel>(providedFaceData))
            //{
            //    var faces = new List<Matrix<RgbPixel>>();
            //    foreach (var face in detector.Operator(img))
            //    {
            //        var shape = sp.Detect(img, face);
            //        var faceChipDetail = Dlib.GetFaceChipDetails(shape, 150, 0.25);
            //        var faceChip = Dlib.ExtractImageChip<RgbPixel>(img, faceChipDetail);
            //        faces.Add(faceChip);
            //    }

            //    if (!faces.Any())
            //        return false;

            //    var faceDescriptors = net.Operator(faces);
            //    var storedDescriptor = faceDescriptors[0];
            //    var providedDescriptor = DecodeBase64ToMatrix(storedFaceData, 128);
            //    var distance = Dlib.Length(storedDescriptor - providedDescriptor);

            //    return distance < 0.6; // Ngưỡng để coi hai khuôn mặt là giống nhau
            //}
            var storedDescriptor = DecodeBase64ToMatrix(storedFaceData, 128);
            var providedDescriptor = DecodeBase64ToMatrix(providedFaceData, 128);

            // Tính toán khoảng cách giữa hai mô tả khuôn mặt
            var distance = Dlib.Length(storedDescriptor - providedDescriptor);

            // So sánh khoảng cách với ngưỡng (0.6) để quyết định có giống nhau không
            return distance < 0.4;
        }
        private bool ValidateFaceDataNotDecode(string storedFaceData, string providedFaceData)
        {
            // Chuyển đổi chuỗi Base64 thành đối tượng Mat của OpenCvSharp
            Mat ConvertBase64ToMat(string base64String)
            {
                var imageBytes = Convert.FromBase64String(base64String);
                using (var ms = new MemoryStream(imageBytes))
                {
                    return Cv2.ImDecode(ms.ToArray(), ImreadModes.Color);
                }
            }

            // Chuyển đổi từ OpenCvSharp.Mat sang DlibDotNet.Matrix<RgbPixel>
            Matrix<RgbPixel> ConvertMatToDlibMatrix(Mat mat)
            {
                var height = mat.Rows;
                var width = mat.Cols;
                var dlibMatrix = new Matrix<RgbPixel>(height, width);

                for (int y = 0; y < height; y++)
                {
                    for (int x = 0; x < width; x++)
                    {
                        var color = mat.At<Vec3b>(y, x);
                        dlibMatrix[y, x] = new RgbPixel { Red = color.Item2, Green = color.Item1, Blue = color.Item0 };
                    }
                }

                return dlibMatrix;
            }

            using (var detector = Dlib.GetFrontalFaceDetector())
            using (var sp = ShapePredictor.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.LandmarksPart).Replace(@"\", "/")))
            using (var facerec = DlibDotNet.Dnn.LossMetric.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.DlibPart).Replace(@"\", "/")))
            {
                var storedImg = ConvertBase64ToMat(storedFaceData);
                var providedImg = ConvertBase64ToMat(providedFaceData);

                if (storedImg.Empty() || providedImg.Empty())
                    return false;

                // Chuyển đổi từ Mat của OpenCvSharp sang Dlib Matrix
                var storedMatrix = ConvertMatToDlibMatrix(storedImg);
                var providedMatrix = ConvertMatToDlibMatrix(providedImg);

                try
                {
                    // Phát hiện khuôn mặt trong các ảnh đã đọc
                    var storedFaces = detector.Operator(storedMatrix);
                    var providedFaces = detector.Operator(providedMatrix);

                    // Kiểm tra xem có khuôn mặt nào được phát hiện hay không
                    if (storedFaces.Length == 0 || providedFaces.Length == 0)
                        return false;

                    // Dự đoán các điểm đặc trưng trên khuôn mặt
                    var storedShape = sp.Detect(storedMatrix, storedFaces[0]);
                    var providedShape = sp.Detect(providedMatrix, providedFaces[0]);

                    // Tạo các danh sách chứa khuôn mặt và các điểm đặc trưng
                    var storedFaceList = new List<Matrix<RgbPixel>> { Dlib.ExtractImageChip<RgbPixel>(storedMatrix, Dlib.GetFaceChipDetails(storedShape, 150, 0.25)) };
                    var providedFaceList = new List<Matrix<RgbPixel>> { Dlib.ExtractImageChip<RgbPixel>(providedMatrix, Dlib.GetFaceChipDetails(providedShape, 150, 0.25)) };

                    var storedFaceDescriptors = facerec.Operator(storedFaceList);
                    var providedFaceDescriptors = facerec.Operator(providedFaceList);

                    // So sánh mô tả của hai khuôn mặt bằng cách tính khoảng cách Euclid giữa chúng
                    var storedDescriptor = storedFaceDescriptors[0];
                    var providedDescriptor = providedFaceDescriptors[0];
                    var distance = Dlib.Length(storedDescriptor - providedDescriptor);

                    return distance < 0.6; // Ngưỡng để coi hai khuôn mặt là giống nhau
                }
                finally
                {
                    // Giải phóng tài nguyên
                    storedMatrix.Dispose();
                    providedMatrix.Dispose();
                }
            }
        }
        //private string GetFaceData(string storedFaceData)
        //{
        //    // Chuyển đổi chuỗi Base64 thành đối tượng Mat của OpenCvSharp
        //    Mat ConvertBase64ToMat(string base64String)
        //    {
        //        var imageBytes = Convert.FromBase64String(base64String);
        //        using (var ms = new MemoryStream(imageBytes))
        //        {
        //            return Cv2.ImDecode(ms.ToArray(), ImreadModes.Color);
        //        }
        //    }

        //    // Chuyển đổi từ OpenCvSharp.Mat sang DlibDotNet.Matrix<RgbPixel>
        //    Matrix<RgbPixel> ConvertMatToDlibMatrix(Mat mat)
        //    {
        //        var height = mat.Rows;
        //        var width = mat.Cols;
        //        var dlibMatrix = new Matrix<RgbPixel>(height, width);

        //        for (int y = 0; y < height; y++)
        //        {
        //            for (int x = 0; x < width; x++)
        //            {
        //                var color = mat.At<Vec3b>(y, x);
        //                dlibMatrix[y, x] = new RgbPixel { Red = color.Item2, Green = color.Item1, Blue = color.Item0 };
        //            }
        //        }

        //        return dlibMatrix;
        //    }

        //    using (var detector = Dlib.GetFrontalFaceDetector())
        //    using (var sp = ShapePredictor.Deserialize(GlobalPaths.RootPart, GlobalPaths.LandmarksPart))
        //    using (var facerec = DlibDotNet.Dnn.LossMetric.Deserialize(GlobalPaths.RootPart, GlobalPaths.LandmarksPart))
        //    {
        //        var storedImg = ConvertBase64ToMat(storedFaceData);

        //        if (storedImg.Empty() )
        //            return string.Empty;

        //        // Chuyển đổi từ Mat của OpenCvSharp sang Dlib Matrix
        //        var storedMatrix = ConvertMatToDlibMatrix(storedImg);

        //        try
        //        {
        //            // Phát hiện khuôn mặt trong các ảnh đã đọc
        //            var storedFaces = detector.Operator(storedMatrix);

        //            // Kiểm tra xem có khuôn mặt nào được phát hiện hay không
        //            if (storedFaces.Length == 0 )
        //                return string.Empty;

        //            // Dự đoán các điểm đặc trưng trên khuôn mặt
        //            var storedShape = sp.Detect(storedMatrix, storedFaces[0]);

        //            // Tạo các danh sách chứa khuôn mặt và các điểm đặc trưng
        //            var storedFaceList = new List<Matrix<RgbPixel>> { Dlib.ExtractImageChip<RgbPixel>(storedMatrix, Dlib.GetFaceChipDetails(storedShape, 150, 0.25)) };

        //            var storedFaceDescriptors = facerec.Operator(storedFaceList);

        //            // So sánh mô tả của hai khuôn mặt bằng cách tính khoảng cách Euclid giữa chúng
        //            var storedDescriptor = storedFaceDescriptors[0];

        //            return Convert.ToBase64String(storedDescriptor.ToArray().SelectMany(BitConverter.GetBytes)
        //                  .ToArray()); 
        //        }
        //        finally
        //        {
        //            // Giải phóng tài nguyên
        //            storedMatrix.Dispose();
        //        }
        //    }
        //}
        private static string GetFaceData(string imagePath)
        {
            using (var detector = Dlib.GetFrontalFaceDetector())
            using (var sp = ShapePredictor.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.LandmarksPart).Replace(@"\", "/")))
            using (var net = DlibDotNet.Dnn.LossMetric.Deserialize(Path.Combine(Directory.GetCurrentDirectory(), GlobalPaths.DlibPart).Replace(@"\", "/")))
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
        private DlibDotNet.Matrix<float> DecodeBase64ToMatrix(string base64String, int dimensions)
        {
            // Giải mã chuỗi Base64 thành mảng byte
            var bytes = Convert.FromBase64String(base64String);

            // Kiểm tra kích thước của dữ liệu
            int expectedSize = dimensions * sizeof(float);
            if (bytes.Length != expectedSize)
            {
                throw new SysException("Invaliddatasize", "Invalid data size");
            }

            // Chuyển đổi mảng byte thành mảng float
            var floats = new float[dimensions];
            for (int i = 0; i < expectedSize; i += sizeof(float))
            {
                floats[i / sizeof(float)] = BitConverter.ToSingle(bytes, i);
            }

            // Khởi tạo Matrix<float> với mảng float
            var matrix = new DlibDotNet.Matrix<float>(dimensions, 1);
            for (int i = 0; i < dimensions; i++)
            {
                matrix[i, 0] = floats[i];
            }

            return matrix;
        }

        #endregion
        public async ValueTask<object> UpdateUser(string userName,  string firstName, string middleName, string lastName,
        string gender, string email, string phoneNo,string password,  dynamic rolesBO, string id)
        {
            var userId = id;
            var serviceIds = "MB";
            SysUser user = await _context.SysUsers.Where(m => m.UserId == userId).FirstOrDefaultAsync();
            string userPerform = "";

            if (user != null) throw new SysException("bo_user_name", "User is existed");
            var check = _context.SysLoginInfos.Where(m => m.LoginName == userName && m.Status != "D" && m.ServiceId == serviceIds).Join(_context.SysUserLogins,
                    login => login.LoginId, userlogin => userlogin.LoginId, (login, userlogin) => new { login.LoginId }).Count();

            if (check > 0 )
            {
                throw new SysException("bo_user_name", "User Name is existed");
            }
            user = new SysUser();
            user.UserId = Guid.NewGuid().ToString("N").Substring(0, 16);
            user.UserCreated = "userPerform";
            user.DateCreated = DateTime.Now;
            user.Status = "A";

            user.UserType = "";
            user.PhoneNo = phoneNo;
            user.FirstName = firstName;
            user.MiddleName = middleName;
            user.LastName = lastName;
            user.FullName = firstName + " " + middleName + " " + lastName;
            user.Gender = gender;
            user.Address = "";
            user.Email = email;
            user.Birthday =  null ;
            user.BranchCode = "";
            user.CompanyId = "";


            user.PolicyId = 2;

            _context.SysUsers.Add(user);

            var LoginId = Guid.NewGuid().ToString("N");

            password = Encryption.EncryptPassword(LoginId, password);

            SysLoginInfo loginInfo = new SysLoginInfo();
            loginInfo.LoginId = LoginId;
            loginInfo.LoginName = userName;
            loginInfo.LoginType = "QR";
            loginInfo.AuthenType = "PASSWORD";
            loginInfo.FailNumber = 0;
            loginInfo.NewLogin = true;
            loginInfo.NewLogin = false;
            loginInfo.PolicyId = 2;
            loginInfo.DateExpired = DateTime.Now.AddYears(20);
            loginInfo.Status = "A";
            loginInfo.UserCreated = userId;
            loginInfo.DateCreated = DateTime.Now;
            loginInfo.ServiceId = "MB";
            _context.SysLoginInfos.Add(loginInfo);
            SysPassword pass = new SysPassword();
            string passwordTemp = Encryption.GenaratePassword(8, true);
            pass.PasswordTemp = Encryption.GenerateRandomKey();
            pass.ServiceId = "MB";
            pass.LoginId = loginInfo.LoginId;
            pass.Type = "PASSWORD";
            pass.Password = password;
            SysUserLogin login = new SysUserLogin();
            login.UserId = user.UserId;
            login.LoginId = LoginId;
            login.Status = "A";
            _context.SysUserLogins.Add(login);
            _context.SysPasswords.Add(pass);

            if (rolesBO != null && rolesBO.Count > 0)
            {
                foreach (string item in rolesBO)
                {
                    SysUserInRole userinRole = new SysUserInRole();
                    userinRole.UserId = user.UserId;
                    userinRole.RoleId = int.Parse(item);
                    _context.SysUserInRoles.Add(userinRole);
                }
            }
            await _context.SaveChangesAsync();
            return user.UserId;
        }
    }
}
