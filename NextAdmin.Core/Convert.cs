using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;

namespace NextAdmin.Core
{
    public static class Convert
    {

        public static object ConvertTo(this object source, System.Type targetType)
        {
            if (source == null)
                return null;
            System.Type sourceType = source.GetType();
            if (targetType == sourceType)
                return source;
            TypeConverter converter = new TypeConverter();
            if (converter.CanConvertFrom(sourceType) && converter.CanConvertTo(targetType))
                return converter.ConvertTo(source, targetType);

            if (targetType.IsEnum)
            {
                if (sourceType.Equals(typeof(string)))
                {
                    try
                    {
                        int intVal = System.Convert.ToInt32(source);
                        int i = 0;
                        foreach (var enumValue in Enum.GetValues(targetType))
                        {
                            if (i == intVal)
                            {
                                return enumValue;
                            }
                            i++;
                        }
                    }
                    catch
                    {
                        return Enum.Parse(targetType, source.ToString());
                    }
                }
            }
            else if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(Nullable<>) && targetType.GetGenericArguments()[0].IsEnum)
            {
                if (string.IsNullOrEmpty(source.ToString()) || source.ToString() == "null")
                    return null;
                try
                {
                    int intVal = System.Convert.ToInt32(source);
                    int i = 0;
                    foreach (var enumValue in Enum.GetValues(targetType.GetGenericArguments()[0]))
                    {
                        if (i == intVal)
                        {
                            return enumValue;
                        }
                        i++;
                    }
                }
                catch
                {
                    return Enum.Parse(targetType.GetGenericArguments()[0], source.ToString());
                }
            }
            else if (targetType.Equals(typeof(DateTime)) || targetType.Equals(typeof(DateTime?)))
            {
                if (sourceType.Equals(typeof(DateTime)) || sourceType.Equals(typeof(DateTime?)))
                {
                    if (targetType.Equals(typeof(DateTime?)) || sourceType.Equals(typeof(DateTime)))
                    {
                        return source;
                    }
                    else
                    {
                        if (source == null)
                        {
                            return new DateTime();
                        }
                        else
                        {
                            return (source as DateTime?).Value;
                        }
                    }
                }
                else if (sourceType.Equals(typeof(string)))
                {
                    if (string.IsNullOrEmpty(source.ToString()))
                        return null;

                    string dateAsString = source.ToString();

                    return System.Convert.ToDateTime(source.ToString(), CultureInfo.CreateSpecificCulture("fr"));
                }
            }
            else if (targetType.Equals(typeof(int)) || targetType.Equals(typeof(int?)))
            {
                string stringInt = source.ToString();
                if (string.IsNullOrEmpty(stringInt))
                {
                    if (targetType.Equals(typeof(int?)))
                        return null;
                    return 0;
                }
                return System.Convert.ToInt32(stringInt);
            }
            else if (targetType.Equals(typeof(long)) || targetType.Equals(typeof(long?)))
            {
                string stringInt = source.ToString();
                if (string.IsNullOrEmpty(stringInt))
                {
                    if (targetType.Equals(typeof(long?)))
                        return null;
                    return 0;
                }
                return System.Convert.ToInt64(stringInt);
            }
            else if (targetType.Equals(typeof(ulong)) || targetType.Equals(typeof(ulong?)))
            {
                string stringInt = source.ToString();
                if (string.IsNullOrEmpty(stringInt))
                {
                    if (targetType.Equals(typeof(ulong?)))
                        return null;
                    return 0;
                }
                return System.Convert.ToUInt64(stringInt);
            }
            else if (targetType.Equals(typeof(decimal)) || targetType.Equals(typeof(decimal?)))
            {
                if (sourceType.Equals(typeof(string)))
                {
                    if (string.IsNullOrEmpty(source.ToString()))
                        return null;
                    return System.Convert.ToDecimal(source.ToString().Replace(',', '.'), CultureInfo.InvariantCulture);
                }
            }
            else if (targetType.Equals(typeof(float)) || targetType.Equals(typeof(float?)))
            {
                if (sourceType.Equals(typeof(string)))
                {
                    if (string.IsNullOrEmpty(source.ToString()))
                        return null;
                    return (float)System.Convert.ToDouble(source.ToString().Replace(',', '.'), CultureInfo.InvariantCulture);
                }
            }
            else if (targetType.Equals(typeof(double)) || targetType.Equals(typeof(double?)))
            {
                if (sourceType.Equals(typeof(string)))
                {
                    if (string.IsNullOrEmpty(source.ToString()))
                        return null;
                    return System.Convert.ToDouble(source.ToString().Replace(',', '.'), CultureInfo.InvariantCulture);
                }
            }
            else if (targetType.Equals(typeof(bool)) || targetType.Equals(typeof(bool?)))
            {
                if (sourceType.Equals(typeof(string)))
                {
                    if (string.IsNullOrEmpty(source.ToString()))
                        return null;
                    return source.ToString() == "true" || source.ToString() == "True" || source.ToString() == "1";
                }
            }
            else if (targetType.Equals(typeof(Guid)) || targetType.Equals(typeof(Guid?)))
            {
                if (sourceType.Equals(typeof(string)))
                {
                    if (source == null || string.IsNullOrEmpty(source.ToString()))
                    {
                        if (targetType.Equals(typeof(Guid?)))
                            return null;
                        else
                            return new Guid();
                    }
                    return new Guid(source.ToString());
                }
                else if (sourceType.Equals(typeof(Guid)) && targetType.Equals(typeof(Guid?)))
                {
                    return source;
                }
                else if (sourceType.Equals(typeof(Guid?)) && targetType.Equals(typeof(Guid)))
                {
                    if (sourceType == null)
                    {
                        throw new Exception("Unable to convert null guid to guid");
                    }
                    else
                    {
                        return (source as Guid?).Value;
                    }
                }
            }
            else if (targetType.Equals(typeof(string)))
            {
                return sourceType.ToString();
            }
            throw new Exception("Unable to convert");
        }


        public static TTarget ConvertTo<TTarget>(this object sourceData, bool tryCopyDiffrentMemberType = false)
          where TTarget : class, new()
        {
            return Copy.CopyTo(sourceData, new TTarget(), tryCopyDiffrentMemberType);
        }


        public static List<TTarget> ConvertTo<TTarget>(this IEnumerable<object> sourceDataset, bool tryCopyDiffrentMemberType = false)
          where TTarget : class, new()
        {
            var targetDataset = new List<TTarget>();
            foreach (var sourceItem in sourceDataset)
            {
                targetDataset.Add(Copy.CopyTo(sourceItem, new TTarget(), tryCopyDiffrentMemberType));
            }
            return targetDataset;
        }

        /*Convert using json*/
        public static TTarget ConvertAs<TTarget>(this object _this)
            where TTarget : class
        {
            string objectAsJson = JsonConvert.SerializeObject(_this, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            return JsonConvert.DeserializeObject<TTarget>(objectAsJson);
        }

    }
}
