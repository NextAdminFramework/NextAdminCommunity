using System.Text;

namespace NextAdmin.Core
{
    public static class Base64
    {

        public static string ToBase64(this string stringToEncode, Encoding encoding = null)
        {
            if (encoding == null)
                encoding = Encoding.UTF8;
            var data = encoding.GetBytes(stringToEncode);
            return System.Convert.ToBase64String(data);
        }


        public static string FromBase64(this string b64String, Encoding encoding = null)
        {
            if (encoding == null)
                encoding = Encoding.UTF8;
            byte[] data = System.Convert.FromBase64String(b64String);
            return encoding.GetString(data);
        }


    }
}
