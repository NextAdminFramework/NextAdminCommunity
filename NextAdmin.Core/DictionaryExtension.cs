using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core
{
    public static class DictionaryExtension
    {

        public static Dictionary<TKey, TValue> Set<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue value)
        {
            if (dictionary.ContainsKey(key))
            {
                dictionary[key] = value;
            }
            else
            {
                dictionary.Add(key, value);
            }
            return dictionary;
        }

        public static TValue? Get<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key)
        {
            if (dictionary.TryGetValue(key, out TValue value))
            {
                return value;
            }
            return default(TValue);
        }


        public static int GetDataHashCode<TKey, TValue>(this Dictionary<TKey, TValue> dictionary)
        {
            return string.Join("+", dictionary.Select(e => e.Key.GetHashCode().ToString() + "_" + (e.Value != null ? e.Value.GetHashCode().ToString() : ""))).GetHashCode();
        }

    }
}
