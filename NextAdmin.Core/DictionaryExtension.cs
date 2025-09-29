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

        public static TValue? GetOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue defaultValue = default(TValue))
        {
            if (dictionary.TryGetValue(key, out TValue value))
            {
                return value;
            }
            return defaultValue;
        }

        public static TOut? GetOrDefaultAs<TKey, TValue, TOut>(this Dictionary<TKey, TValue> dictionary, TKey key, TOut defaultValue = default(TOut))
        {
            TValue outValue;
            if (dictionary.TryGetValue(key, out outValue))
            {
                return outValue.To<TOut>();
            }
            return defaultValue;
        }

        public static TValue? GetOrDefault<TValue>(this System.Collections.IDictionary dictionary, string key, TValue defaultValue = default(TValue))
        {
            if (dictionary.Contains(key))
            {
                return (TValue)dictionary[key];
            }
            return defaultValue;
        }

        public static TValue? GetOrDefaultAs<TValue>(this System.Collections.IDictionary dictionary, string key, TValue defaultValue = default(TValue))
        {
            if (dictionary.Contains(key))
            {
                return dictionary[key].To<TValue>();
            }
            return defaultValue;
        }

        public static int GetDataHashCode<TKey, TValue>(this Dictionary<TKey, TValue> dictionary)
        {
            return string.Join("+", dictionary.Select(e => e.Key.GetHashCode().ToString() + "_" + (e.Value != null ? e.Value.GetHashCode().ToString() : ""))).GetHashCode();
        }

    }
}
