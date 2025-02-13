using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace NextAdmin.Core
{
    public static class Encryption
    {

        public static string HashString(this string stringToHash)
        {
            byte[] data = System.Text.Encoding.UTF8.GetBytes(stringToHash);
            data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
            string hashedString = System.Convert.ToBase64String(data);
            return hashedString;
        }


        public static string EncryptString(string plainText, string key)
        {
            var encoding = Encoding.UTF8;
            try
            {
                RijndaelManaged aes = new RijndaelManaged();
                aes.KeySize = 256;
                aes.BlockSize = 128;
                aes.Padding = PaddingMode.PKCS7;
                aes.Mode = CipherMode.CBC;

                aes.Key = encoding.GetBytes(key);
                aes.GenerateIV();

                ICryptoTransform AESEncrypt = aes.CreateEncryptor(aes.Key, aes.IV);
                byte[] buffer = encoding.GetBytes(plainText);

                string encryptedText = System.Convert.ToBase64String(AESEncrypt.TransformFinalBlock(buffer, 0, buffer.Length));

                String mac = "";

                mac = BitConverter.ToString(HmacSHA256(System.Convert.ToBase64String(aes.IV) + encryptedText, key)).Replace("-", "").ToLower();

                var keyValues = new Dictionary<string, object>
                {
                    { "iv", System.Convert.ToBase64String(aes.IV) },
                    { "value", encryptedText },
                    { "mac", mac },
                };

                return System.Convert.ToBase64String(encoding.GetBytes(Serialization.ToJSON(keyValues)));
            }
            catch (Exception e)
            {
                throw new Exception("Error encrypting: " + e.Message);
            }
        }

        public static string DecryptString(string encryptedText, string key)
        {
            var encoding = Encoding.UTF8;
            try
            {
                RijndaelManaged aes = new RijndaelManaged();
                aes.KeySize = 256;
                aes.BlockSize = 128;
                aes.Padding = PaddingMode.PKCS7;
                aes.Mode = CipherMode.CBC;
                aes.Key = encoding.GetBytes(key);

                // Base 64 decode
                byte[] base64Decoded = System.Convert.FromBase64String(encryptedText);
                string base64DecodedStr = encoding.GetString(base64Decoded);

                // JSON Decode base64Str

                var payload = Serialization.FromJSON<Dictionary<string, string>>(base64DecodedStr);

                aes.IV = System.Convert.FromBase64String(payload["iv"]);

                ICryptoTransform AESDecrypt = aes.CreateDecryptor(aes.Key, aes.IV);
                byte[] buffer = System.Convert.FromBase64String(payload["value"]);

                return encoding.GetString(AESDecrypt.TransformFinalBlock(buffer, 0, buffer.Length));
            }
            catch (Exception e)
            {
                throw new Exception("Error decrypting: " + e.Message);
            }
        }

        static byte[] HmacSHA256(String data, String key)
        {
            var encoding = Encoding.UTF8;
            using (HMACSHA256 hmac = new HMACSHA256(encoding.GetBytes(key)))
            {
                return hmac.ComputeHash(encoding.GetBytes(data));
            }
        }


    }
}
