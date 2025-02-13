using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Text;

namespace NextAdmin.Core
{
    public static class Serialization
    {

        public const long JsonMaxNumberValue = 9007199254740992;

        public static string ToJSON(this object _this, bool forceCamelCase = false)
        {
            if (forceCamelCase)
            {
                return JsonConvert.SerializeObject(_this, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }
            else
            {
                return JsonConvert.SerializeObject(_this);
            }
        }

        public static object FromJSON(this string _this)
        {
            return JsonConvert.DeserializeObject(_this);
        }

        public static object FromJSON(this string _this, Type type)
        {
            return JsonConvert.DeserializeObject(_this, type);
        }

        public static TObject FromJSON<TObject>(this string _this, bool forceCamelCase = false)
        {
            if (forceCamelCase)
            {
                return JsonConvert.DeserializeObject<TObject>(_this, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }
            else
            {
                return JsonConvert.DeserializeObject<TObject>(_this);
            }
        }

        public static string ToJSONBase64(this object _this, Encoding encoding = null, bool forceLittleEndian = false)
        {
            return _this.ToJSON(forceLittleEndian).ToBase64(encoding);
        }

        public static object FromJSONBase64(this string b64String, Encoding encoding = null)
        {
            return b64String.FromBase64(encoding).FromJSON();
        }

        public static TObject FromJSONBase64<TObject>(this string b64String, Encoding encoding = null)
        {
            return b64String.FromBase64(encoding).FromJSON<TObject>();
        }

    }
}
