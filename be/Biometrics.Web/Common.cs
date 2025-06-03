using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace Biometrics.Web
{
    public class Common
    {

            public const string PublicKey = "-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB\r\n6HR3KNV9D0+TuetWAyr1fNYoYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJ\r\nnUJ7TG+G5ZtynhgxKkSDMjn5U3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zw\r\nzmgcyrKViO6bA4V9xQIDAQAB\r\n-----END PUBLIC KEY-----";
            public const string PrivateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB6HR3KNV9D0+TuetWAyr1fNYo\r\nYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJnUJ7TG+G5ZtynhgxKkSDMjn5\r\nU3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zwzmgcyrKViO6bA4V9xQIDAQAB\r\nAoGAQYPLLNmbhZLSOA3PkTF5Us7lz9lOMphepsAbLl5NPmw6zvYcrk7GxZv2Pg1I\r\nvZkEeBqIUSkvhwWu3BMv/QWG5R9VEdra0G+t9+pUTkftfoiWoDoBfLZ1392sIY+3\r\nY6faWnbSFrAuGsjR++Wa5TgFW+Z2Uot/sHL3J04SEtJjmVUCQQDr6xhnmtIfcUdU\r\nfVTvL2SYix7kNBYzUxc4ctfH5xB3wiihkV9i5SC4StVgeIxltf4lJfcmrY+ZSGip\r\nD4inECDDAkEA1I+fAhgqLiUKSzbMi0FA0x12eHIfiCCU9IweSBGA7wjkV08sA9SL\r\ncxSp/vpapSn4zK/ojAjB1gFHnhy0eh5+1wJBAOKEBxmrCGdSL6fK8tr5CUCCC3YX\r\nIN3EwP3dHpv8ms4x6StAVnKxBxqMF5YaCMu70zo92rETYlZNtNfmZ1Ho5VsCQA0h\r\nEeE/PNu8zfX3XIr9bNOdbkPiSLBP0uOIBBbPffdFxVTfPwi9iB+Dlzx4mkC5ZvS9\r\nqM99evuM+K97dmpUl+ECQHozKD0YCR6UEpKwWhbI+0B31c1Wju3JtoPjL0l/akbG\r\ncALjSq3TbJScrO5G1bkeBVSbPHxY7clLC9Lkqij4okM=\r\n-----END RSA PRIVATE KEY-----";
        
        public static (string content, string contentType) ServerDecrypt(string data)
        {
            
            // Tách các phần của dữ liệu
            int aesKeyLen = Convert.ToInt32(data.Substring(0, 8), 16);
            int contentTypeLen = Convert.ToInt32(data.Substring(8, 2), 16);

            string aesKeyEn = data.Substring(10, aesKeyLen);
            string aesPass;
            using (RSA rsa = RSA.Create())
            {
                rsa.ImportFromPem(PrivateKey.ToCharArray());
                aesPass = Encryption.RSADecrypt(aesKeyEn, rsa.ExportParameters(true));
            }
            //string aesKey = Encoding.UTF8.GetString(aesPass);
            string dataSumEn = data.Substring(10 + aesKeyLen);
            string dataSum = Encryption.AESDecryptWithPassword(dataSumEn, aesPass);

            string contentType = dataSum.Substring(0, contentTypeLen);
            string dataDe = dataSum.Substring(contentTypeLen);

            return (dataDe, contentType);
        }
        public static string ServerEncrypt(string input, string contentType)
        {
            
            // Tạo một mật khẩu AES ngẫu nhiên
            string aesPass = Guid.NewGuid().ToString();

            // Kết hợp contentType và input thành một chuỗi để mã hóa
            string dataToEncrypt = contentType + input;

            // Mã hóa dữ liệu bằng AES với mật khẩu AES đã tạo
            string encryptedData = Encryption.AESEncryptWithPassword(dataToEncrypt, aesPass);

            // Mã hóa mật khẩu AES bằng RSA với khóa công khai
            string aesPassEncrypted;
            using (RSA rsa = RSA.Create())
            {
                rsa.ImportFromPem(PublicKey);
                rsa.ImportParameters(rsa.ExportParameters(false));
                aesPassEncrypted = Encryption.RSAEncrypt(aesPass, rsa.ExportParameters(false));
            }

            // Kết hợp các phần tử đã mã hóa để tạo dữ liệu cuối cùng
            string encryptedDataWithHeader = $"{aesPassEncrypted.Length.ToString("x8")}{contentType.Length.ToString("x2")}{aesPassEncrypted}{encryptedData}";

            return encryptedDataWithHeader;
        }
        public static string ServerEncryptClient(string content, string contentType)
        {
            try
            {
                
                // Tính toán độ dài của khóa công khai và contentType
                string rsaClientLen = "00000000" + PublicKey.Length.ToString("x").PadLeft(8, '0');
                string contentTypeLen = "00" + contentType.Length.ToString("x").PadLeft(2, '0');

                // Kết hợp các thành phần dữ liệu
                string dataSum = rsaClientLen + contentTypeLen + PublicKey + contentType + content;

                // Sinh mật khẩu AES
                string passAes = Guid.NewGuid().ToString();

                // Mã hóa dữ liệu bằng AES
                string dataEn = Encryption.AESEncryptWithPassword(dataSum, passAes);

                // Mã hóa mật khẩu AES bằng RSA
                string passRsa = string.Empty;
                using (RSA rsa = RSA.Create())
                {
                    rsa.ImportFromPem(PublicKey);
                    rsa.ImportParameters(rsa.ExportParameters(false));
                    passRsa = Encryption.RSAEncrypt(passAes, rsa.ExportParameters(false));
                }
                string passRsaLen = "00000000" + passRsa.Length.ToString("x").PadLeft(8, '0');

                // Kết hợp mật khẩu RSA với dữ liệu mã hóa
                string strSum = passRsaLen + passRsa + dataEn;

                return strSum;
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và báo lỗi nếu cần
                Console.WriteLine($"Error encrypting data: {ex.Message}");
                throw;
            }
        }

        public class Encryption
        {
            #region RSA
            public static string RSAEncrypt(string Data, RSAParameters RSAKey, bool DoOAEPPadding = false)
            {
                var arrData = Encoding.UTF8.GetBytes(Data);
                var arrEnData = RSAEncrypt(arrData, RSAKey);
                return Convert.ToBase64String(arrEnData);
            }
            public static byte[] RSAEncrypt(byte[] Data, RSAParameters RSAKey, bool DoOAEPPadding = false)
            {
                try
                {
                    using (RSA rsa = RSA.Create())
                    {
                        rsa.ImportParameters(RSAKey);
                        return rsa.Encrypt(Data, DoOAEPPadding ? RSAEncryptionPadding.OaepSHA256 : RSAEncryptionPadding.Pkcs1);
                    }
                }
                catch (CryptographicException e)
                {
                    Console.WriteLine(e.Message);
                    throw e;
                }
            }
            public static string RSADecrypt(string Data, RSAParameters RSAKey, bool DoOAEPPadding = false)
            {
                var arrEnData = Convert.FromBase64String(Data);
                var arrDeData = RSADecrypt(arrEnData, RSAKey);
                return Encoding.UTF8.GetString(arrDeData);
            }
            public static byte[] RSADecrypt(byte[] Data, RSAParameters RSAKey, bool DoOAEPPadding = false)
            {
                try
                {
                    using (RSA rsa = RSA.Create())
                    {
                        rsa.ImportParameters(RSAKey);
                        return rsa.Decrypt(Data, DoOAEPPadding ? RSAEncryptionPadding.OaepSHA256 : RSAEncryptionPadding.Pkcs1);
                    }
                }
                catch (CryptographicException e)
                {
                    Console.WriteLine(e.ToString());
                    throw e;
                }
            }
            #endregion
            #region AES
            static string salt = "ZGgIddJOLDv7l1fH7BCKplG2j4iAnAQ3";
            static readonly byte[] saltAES = Encoding.ASCII.GetBytes("yO3NV1mhssvqWNMbG3atWie5V6PcLlTc");
            static string defaultAESPass = "bNDPWqKCrTFjgyOiDJ47v7Babl4vhpE3oGBrUxqog625mb8vX7p3oOE6G7JLHpMt";
            public static string GenaratePassword(int len, bool onlyDigit = true)
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
                return new string(Enumerable.Repeat(chars, len)
                    .Select(s => s[(new Random()).Next(s.Length)]).ToArray());
            }
            public static string EncryptPasswordPlantext(string loginId, string passwordPlantext)
            {
                return EncryptPassword(loginId, Sha256(passwordPlantext));
            }
            public static string EncryptPassword(string loginId, string password)
            {
                if (password.Length != 64)
                    throw new Exception("Password must be encrypted as SHA256");
                string mixSatl = string.Concat(salt.Zip(password.Substring(20, 32), (a, b) => new[] { a, b }).SelectMany(c => c));
                return Sha256((loginId + mixSatl + password).ToLower());
            }
            public static string AESEncrypt(string input)
            {
                return AESEncryptWithPassword(input, defaultAESPass);
            }
            public static string AESEncryptWithPassword(string input, string password)
            {
                byte[] bytesToBeEncrypted = Encoding.UTF8.GetBytes(input);
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

                byte[] encryptedBytes = null;

                // Set your salt here, change it to meet your flavor:
                // The salt bytes must be at least 8 bytes.

                using (MemoryStream ms = new MemoryStream())
                {
                    using (Aes AES = Aes.Create())
                    {
                        AES.KeySize = 256;
                        AES.BlockSize = 128;

                        var key = new Rfc2898DeriveBytes(passwordBytes, saltAES, 1000);
                        AES.Key = key.GetBytes(AES.KeySize / 8);
                        AES.IV = key.GetBytes(AES.BlockSize / 8);

                        AES.Mode = CipherMode.CBC;

                        using (var cs = new CryptoStream(ms, AES.CreateEncryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(bytesToBeEncrypted, 0, bytesToBeEncrypted.Length);
                            cs.Close();
                        }
                        encryptedBytes = ms.ToArray();
                    }
                }

                return Convert.ToBase64String(encryptedBytes);
            }
            public static string AESDecrypt(string input)
            {
                return AESDecryptWithPassword(input, defaultAESPass);
            }
            public static string AESDecryptWithPassword(string input, string password)
            {
                byte[] bytesToBeDecrypted = Convert.FromBase64String(input);
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

                byte[] decryptedBytes = null;

                // Set your salt here, change it to meet your flavor:
                // The salt bytes must be at least 8 bytes.

                using (MemoryStream ms = new MemoryStream())
                {
                    using (Aes AES = Aes.Create())
                    {
                        AES.KeySize = 256;
                        AES.BlockSize = 128;

                        var key = new Rfc2898DeriveBytes(passwordBytes, saltAES, 1000);
                        AES.Key = key.GetBytes(AES.KeySize / 8);
                        AES.IV = key.GetBytes(AES.BlockSize / 8);

                        AES.Mode = CipherMode.CBC;

                        using (var cs = new CryptoStream(ms, AES.CreateDecryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(bytesToBeDecrypted, 0, bytesToBeDecrypted.Length);
                            cs.Close();
                        }
                        decryptedBytes = ms.ToArray();
                    }
                }

                return Encoding.UTF8.GetString(decryptedBytes);
            }
            #endregion

            #region SHA
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
            public static string Sha512(string rawData)
            {
                // Create a SHA512   
                using (SHA512 sha512Hash = SHA512.Create())
                {
                    // ComputeHash - returns byte array  
                    byte[] bytes = sha512Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                    // Convert byte array to a string   
                    StringBuilder builder = new StringBuilder();
                    for (int i = 0; i < bytes.Length; i++)
                    {
                        builder.Append(bytes[i].ToString("x2"));
                    }
                    return builder.ToString();
                }
            }
            #endregion

            #region smart otp
            public static string RandomString(int length)
            {
                Random random = new Random();
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                return new string(Enumerable.Repeat(chars, length)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
            }
            public static string GetSmartOTPSecret(string deviceId, string secretKey)
            {
                for (int i = 0; i < deviceId.Length; i++)
                {
                    int pos = Convert.ToInt32(i * 3.14);
                    while (pos > 256)
                    {
                        pos = pos - 256;
                    }
                    secretKey = secretKey.Insert(pos, deviceId[i].ToString());
                }
                return Sha256(secretKey);
            }
            #endregion
        }
    }
}
