using System.Reflection;

namespace NextAdmin.Core
{
    public static class Copy
    {

        private static bool _isPrimitiv(System.Type t)
        {
            return !t.IsClass || t == typeof(string);
        }

        public static TTarget CopyTo<TTarget>(this object sourceData, TTarget target = null, bool tryCopyDifferentMemberType = false, bool copyNullValues = true, IEnumerable<string> memberNamesToCopy = null, IEnumerable<string> memberNamesToExclude = null, bool copyNonPrimitiveType = true, bool copyInvariantName = true)
          where TTarget : class
        {
            if (copyInvariantName)
            {
                if (memberNamesToCopy != null)
                {
                    memberNamesToCopy = memberNamesToCopy.Select(e => e.ToLower()).ToList();
                }
                if (memberNamesToExclude != null)
                {
                    memberNamesToExclude = memberNamesToExclude.Select(e => e.ToLower()).ToList();
                }
            }

            Dictionary<string, PropertyInfo> childPropertyDictionary = new Dictionary<string, PropertyInfo>();
            foreach (var childProperty in target.GetType().GetProperties())
            {
                if (childProperty.SetMethod != null)
                {
                    childPropertyDictionary.Add(childProperty.Name, childProperty);
                }
            }
            foreach (var sourceProperty in sourceData.GetType().GetProperties())
            {
                if (memberNamesToCopy != null && !memberNamesToCopy.Contains(copyInvariantName ? sourceProperty.Name.ToLower() : sourceProperty.Name))
                    continue;
                if (memberNamesToExclude != null && memberNamesToExclude.Contains(copyInvariantName ? sourceProperty.Name.ToLower() : sourceProperty.Name))
                    continue;

                PropertyInfo targetProperty = null;
                if (childPropertyDictionary.TryGetValue(sourceProperty.Name, out targetProperty))
                {
                    if (!copyNonPrimitiveType && !_isPrimitiv(sourceProperty.PropertyType))
                        continue;
                    if (sourceProperty.PropertyType == targetProperty.PropertyType)
                    {
                        var sourceValue = sourceProperty.GetValue(sourceData);
                        if (sourceValue != null || copyNullValues)
                        {
                            targetProperty.SetValue(target, sourceValue);
                        }
                    }
                    else if (tryCopyDifferentMemberType)
                    {
                        object sourceValue = sourceProperty.GetValue(sourceData);
                        if (sourceValue != null)
                        {
                            try
                            {
                                if (sourceValue != null || copyNullValues)
                                {
                                    targetProperty.SetValue(target, sourceValue.ToString().ConvertTo(targetProperty.PropertyType));
                                }
                            }
                            catch
                            {

                            }
                        }
                    }
                }
            }
            return target;
        }



        public static TObject Clone<TObject>(this TObject _this)
        {
            return _this.ToJSON().FromJSON<TObject>();
        }

        public static object Clone(this object _this)
        {
            return _this.ToJSON().FromJSON();
        }

    }
}
