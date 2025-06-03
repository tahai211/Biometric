using Microsoft.AspNetCore.Mvc;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Service.Biomertric;
using Biometrics.ApiService.Service.User;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Drawing.Printing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static OpenCvSharp.Stitcher;
using System.Drawing.Imaging;
using QRCoder;
using System.Drawing;
using System.IO.Compression;
using Biometrics.ApiService.Infra.Constans;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Biometrics.ApiService.Infra.Common;

namespace Biometrics.ApiService.Controllers
{
    public class RegisterBiometricRequest
    {
        public string? FaceData { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? PhoneNo { get; set; }
        public string? Password { get; set; }

    }
    public class BiometricRequest
    {
        public string? faceData { get; set; }
        public string? dataQR { get; set; }

    }
    public class RegenerateQRRequest
    {
        public string? name { get; set; }
        public string? phone { get; set; }
        public string? password { get; set; }
        public string? faceData { get; set; }

    }
    public class RegenerateQRRequestApprove
    {
        public int? id { get; set; }

    }
    [Route("biometric")]
    [ApiController]
    public class BiometricController : ControllerBase
    {
        private readonly IBiomertricService _biomertricService;

        public BiometricController(IBiomertricService biomertricService)
        {
            _biomertricService = biomertricService;
        }

        [HttpPost("register")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> RegisterBiomertric([FromBody] RegisterBiometricRequest request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                string registerBiometric = await _biomertricService.RegisterBiomertric(request.FaceData, request.UserName, request.FirstName, request.MiddleName, request.LastName,
                    request.Gender, request.Email, request.PhoneNo, request.Password);
                var decryptedContent = EE2E.ServerDecrypt("requestBody", RSAKey.PrivateKey).content;

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, GenerateQrCode(CompressString(registerBiometric)), ResposeType.TextPlain);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("regenerateQR")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> RegenerateQR([FromBody] RegenerateQRRequest request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var registerBiometric = await _biomertricService.RegenerateQR(request.name, request.phone, request.password, request.faceData);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, registerBiometric, ResposeType.ApplicationJson, "Success", "Face is match");
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain,"Fail", ex.Message);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("ApprregenerateQR")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> ApproveRegenerateQR([FromBody] RegenerateQRRequestApprove request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                string registerBiometric = await _biomertricService.ApproveRegenerateQR(request.id);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, GenerateQrCode(CompressString(registerBiometric)), ResposeType.TextPlain);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("RejectregenerateQR")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> RejectRegenerateQR([FromBody] RegenerateQRRequestApprove request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                bool registerBiometric = await _biomertricService.RejectRegenerateQR(request.id);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, new {result = registerBiometric }, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("ListregenerateQR")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> ListRegenerateQR(string? userId, int pageIndex = 1, int pageSize = 0)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var lstRegenerate = await _biomertricService.ListRegenerateQR(userId, pageIndex, pageSize);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, lstRegenerate, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain);
                return BadRequest(responeResult);
            }
        }
        public string CompressString(string text)
        {
            byte[] byteArray = Encoding.UTF8.GetBytes(text);
            using (var outputStream = new MemoryStream())
            {
                using (var gzipStream = new GZipStream(outputStream, CompressionMode.Compress))
                {
                    gzipStream.Write(byteArray, 0, byteArray.Length);
                }
                return Convert.ToBase64String(outputStream.ToArray());
            }
        }
        public static string GenerateQrCode(string data)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.M))
            using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
            {
                byte[] qrCodeImage = qrCode.GetGraphic(20);
                return $"data:image/png;base64,{Convert.ToBase64String(qrCodeImage)}";
            }
        }

        [HttpPost("positively")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> PositivelyBiomertric([FromBody] BiometricRequest request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var compare = await _biomertricService.PositivelyBiomertric(request.faceData, DecompressString(request.dataQR));
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, compare, ResposeType.ApplicationJson, "Success","Face is match");
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message, ResposeType.TextPlain, "Fail", ex.Message);
                return BadRequest(responeResult);
            }
        }
        public string DecompressString(string compressedText)
        {
            byte[] compressedBytes = Convert.FromBase64String(compressedText);
            using (var inputStream = new MemoryStream(compressedBytes))
            using (var gzipStream = new GZipStream(inputStream, CompressionMode.Decompress))
            using (var reader = new StreamReader(gzipStream, Encoding.UTF8))
            {
                return reader.ReadToEnd();
            }
        }
    }
}
