using DlibDotNet.ImageDatasetMetadata;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static QRCoder.PayloadGenerator;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Constans;

namespace Biometrics.ApiService.Infra.Common.HttpCustom
{
    public class HttpBase
    {
        private readonly AppDbContext _context;

        public HttpBase(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context)); // Kiểm tra null
        }

        public HttpStatusCode code { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorDesc { get; set; }
        public dynamic response { get; set; }

        public HttpBase( HttpStatusCode code, dynamic message,string type = ResposeType.ApplicationJson,string errorCode = "success", string errorDesc = "success",bool encript = true) 
        {
            this.code = code;
            this.ErrorCode = errorCode;
            this.ErrorDesc = errorDesc;
            this.response = encript ? EncryptResponse(type == ResposeType.ApplicationJson ? JsonConvert.SerializeObject(message) : message , type).GetAwaiter().GetResult(): message;
        }

        private async Task<string> EncryptResponse(string message, string type)
        {
            //string publicKeyPem = string.Empty;
            ////var keypem = await _context.ApiEncryptionTypes
            ////    .Where(x => x.EncryptId == "IDPE")
            ////    .Select(x => x.ParamData)
            ////    .FirstOrDefaultAsync();
            //var keypem = "{   \"Params\":[\"PrivateKey\", \"PublicKey\"],   \"DefaultValue\":{    \"PrivateKey\":\"-----BEGIN RSA PRIVATE KEY-----\\r\\nMIICXAIBAAKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB6HR3KNV9D0+TuetWAyr1fNYo\\r\\nYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJnUJ7TG+G5ZtynhgxKkSDMjn5\\r\\nU3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zwzmgcyrKViO6bA4V9xQIDAQAB\\r\\nAoGAQYPLLNmbhZLSOA3PkTF5Us7lz9lOMphepsAbLl5NPmw6zvYcrk7GxZv2Pg1I\\r\\nvZkEeBqIUSkvhwWu3BMv/QWG5R9VEdra0G+t9+pUTkftfoiWoDoBfLZ1392sIY+3\\r\\nY6faWnbSFrAuGsjR++Wa5TgFW+Z2Uot/sHL3J04SEtJjmVUCQQDr6xhnmtIfcUdU\\r\\nfVTvL2SYix7kNBYzUxc4ctfH5xB3wiihkV9i5SC4StVgeIxltf4lJfcmrY+ZSGip\\r\\nD4inECDDAkEA1I+fAhgqLiUKSzbMi0FA0x12eHIfiCCU9IweSBGA7wjkV08sA9SL\\r\\ncxSp/vpapSn4zK/ojAjB1gFHnhy0eh5+1wJBAOKEBxmrCGdSL6fK8tr5CUCCC3YX\\r\\nIN3EwP3dHpv8ms4x6StAVnKxBxqMF5YaCMu70zo92rETYlZNtNfmZ1Ho5VsCQA0h\\r\\nEeE/PNu8zfX3XIr9bNOdbkPiSLBP0uOIBBbPffdFxVTfPwi9iB+Dlzx4mkC5ZvS9\\r\\nqM99evuM+K97dmpUl+ECQHozKD0YCR6UEpKwWhbI+0B31c1Wju3JtoPjL0l/akbG\\r\\ncALjSq3TbJScrO5G1bkeBVSbPHxY7clLC9Lkqij4okM=\\r\\n-----END RSA PRIVATE KEY-----\",    \"PublicKey\":\"-----BEGIN PUBLIC KEY-----\\r\\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB\\r\\n6HR3KNV9D0+TuetWAyr1fNYoYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJ\\r\\nnUJ7TG+G5ZtynhgxKkSDMjn5U3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zw\\r\\nzmgcyrKViO6bA4V9xQIDAQAB\\r\\n-----END PUBLIC KEY-----\"   },   \"OtherData\":{   }  }";

            //if (keypem == null)
            //{
            //    return "";
            //}

            //JObject dataParam = JsonConvert.DeserializeObject<JObject>(keypem);
            //publicKeyPem = dataParam["DefaultValue"]?["PublicKey"]?.ToString();
            //string privateKeyPemValue = dataParam["DefaultValue"]?["PrivateKey"]?.ToString();

            return EE2E.ServerEncrypt(message, type, RSAKey.PublicKey);
        }
    }
}
