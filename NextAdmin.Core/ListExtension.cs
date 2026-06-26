namespace NextAdmin.Core
{
    public static class ListExtension
    {

        public static Dictionary<TKey, TValue> ToUniqueDictionary<TKey, TValue>(this List<TValue> list, Func<TValue, TKey> discriminator)
        {
            var dictionary = new Dictionary<TKey, TValue>();
            foreach (var item in list)
            {
                var key = discriminator(item);
                if (!dictionary.ContainsKey(key))
                {
                    dictionary.Add(key, item);
                }
            }
            return dictionary;
        }

    }
}
