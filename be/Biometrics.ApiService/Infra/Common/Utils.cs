﻿using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Serilog;
using System.Security.Cryptography;
using System.Text;

namespace Biometrics.ApiService.Infra.Common
{
    public static class Utils
    {
        public static string ChangeValueJson(string json, string name, string value)
        {
            try
            {
                if (string.IsNullOrEmpty(json)) return "";
                var jsonData = (JObject)JsonConvert.DeserializeObject(json);
                jsonData[name] = value;
                return JsonConvert.SerializeObject(jsonData);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "ChangeValueJson: ");
                return json;
            }
        }
        public static string Decrypt(string cipherString, bool useHashing)
        {
            byte[] keyArray;
            //get the byte code of the string

            byte[] toEncryptArray = Convert.FromBase64String(cipherString);

            //Get your key from config file to open the lock!
            string key = "SecurityKey";

            if (useHashing)
            {
                //if hashing was used get the hash code with regards to your key
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                //release any resource held by the MD5CryptoServiceProvider

                hashmd5.Clear();
            }
            else
            {
                //if hashing was not implemented get the byte code of the key
                keyArray = UTF8Encoding.UTF8.GetBytes(key);
            }

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            //set the secret key for the tripleDES algorithm
            tdes.Key = keyArray;
            //mode of operation. there are other 4 modes. 
            //We choose ECB(Electronic code Book)

            tdes.Mode = CipherMode.ECB;
            //padding mode(if any extra byte added)
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(
                                 toEncryptArray, 0, toEncryptArray.Length);
            //Release resources held by TripleDes Encryptor                
            tdes.Clear();
            //return the Clear decrypted TEXT
            return UTF8Encoding.UTF8.GetString(resultArray);
        }
    }
}
