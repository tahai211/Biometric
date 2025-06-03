using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Infra.Constans
{
    public class StaticVariable
    {
        public const int ExpiresToken = 24;//Hours
        public const int ExpiresTokenRefresh = 10;//days
    }
    public class ResposeType
    {
        public const string ApplicationJson = "application/json";
        public const string TextPlain = "text/plain";
        public const string TextHtml = "text/html";
        public const string TextJavascript = "text/javascript";
        public const string TextCss = "text/css";
        public const string ApplicationXml = "application/xml";
    }
    public class RSAKey
    {
        public const string PublicKey = "-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB\r\n6HR3KNV9D0+TuetWAyr1fNYoYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJ\r\nnUJ7TG+G5ZtynhgxKkSDMjn5U3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zw\r\nzmgcyrKViO6bA4V9xQIDAQAB\r\n-----END PUBLIC KEY-----";
        public const string PrivateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQDD4wsRYFjwwy7hJ7eTiMJ88sxB6HR3KNV9D0+TuetWAyr1fNYo\r\nYYMPBDzleHteJQBCI+hDkizf4ls8gucvDO2Yl/FJnUJ7TG+G5ZtynhgxKkSDMjn5\r\nU3E5RNVfqlkmJB2joFeiHusKccMJl+SNZwIpL+zwzmgcyrKViO6bA4V9xQIDAQAB\r\nAoGAQYPLLNmbhZLSOA3PkTF5Us7lz9lOMphepsAbLl5NPmw6zvYcrk7GxZv2Pg1I\r\nvZkEeBqIUSkvhwWu3BMv/QWG5R9VEdra0G+t9+pUTkftfoiWoDoBfLZ1392sIY+3\r\nY6faWnbSFrAuGsjR++Wa5TgFW+Z2Uot/sHL3J04SEtJjmVUCQQDr6xhnmtIfcUdU\r\nfVTvL2SYix7kNBYzUxc4ctfH5xB3wiihkV9i5SC4StVgeIxltf4lJfcmrY+ZSGip\r\nD4inECDDAkEA1I+fAhgqLiUKSzbMi0FA0x12eHIfiCCU9IweSBGA7wjkV08sA9SL\r\ncxSp/vpapSn4zK/ojAjB1gFHnhy0eh5+1wJBAOKEBxmrCGdSL6fK8tr5CUCCC3YX\r\nIN3EwP3dHpv8ms4x6StAVnKxBxqMF5YaCMu70zo92rETYlZNtNfmZ1Ho5VsCQA0h\r\nEeE/PNu8zfX3XIr9bNOdbkPiSLBP0uOIBBbPffdFxVTfPwi9iB+Dlzx4mkC5ZvS9\r\nqM99evuM+K97dmpUl+ECQHozKD0YCR6UEpKwWhbI+0B31c1Wju3JtoPjL0l/akbG\r\ncALjSq3TbJScrO5G1bkeBVSbPHxY7clLC9Lkqij4okM=\r\n-----END RSA PRIVATE KEY-----";
    }
}
