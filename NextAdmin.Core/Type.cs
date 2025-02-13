using System;

namespace NextAdmin.Core
{

    public static class TypeExtension
    {

        public static string GetJSName(this Type type)
        {
            if (type.IsArray)
            {
                return "array";
            }
            if (type.IsEnum)
            {
                return "enum";
            }
            if (type == typeof(bool) || type == typeof(bool?))
            {
                return "boolean";
            }
            if (type == typeof(int) || type == typeof(int?) || type == typeof(long) || type == typeof(long?) || type == typeof(float) || type == typeof(float?) || type == typeof(double) || type == typeof(double?) || type == typeof(decimal) || type == typeof(decimal?))
            {
                return "number";
            }
            if (type == typeof(DateTime) || type == typeof(DateTime?))
            {
                return "date";
            }
            if (type == typeof(string))
            {
                return "string";
            }
            if (type.IsClass)
            {
                return "object";
            }
            return "any";
        }


        public static string GetSQLName(this Type type)
        {
            if (type.IsArray)
            {
                return "TEXT";
            }
            if (type.IsEnum || type.IsNullableEnum())
            {
                return "INT";
            }
            if (type == typeof(bool) || type == typeof(bool?))
            {
                return "BOOLEAN";
            }
            if (type == typeof(int) || type == typeof(int?) || type == typeof(uint) || type == typeof(uint?) || type == typeof(long) || type == typeof(long?) || type == typeof(ulong) || type == typeof(ulong?))
            {
                return "INT";
            }
            if (type == typeof(float) || type == typeof(float?) || type == typeof(double) || type == typeof(double?) || type == typeof(decimal) || type == typeof(decimal?))
            {
                return "DOUBLE";
            }
            if (type == typeof(DateTime) || type == typeof(DateTime?))
            {
                return "DATETIME";
            }
            if (type == typeof(string))
            {
                return "TEXT";
            }
            if (type.IsClass)
            {
                return "TEXT";
            }
            return "TEXT";
        }


        public static bool IsNullableEnum(this Type t)
        {
            return t.IsGenericType &&
                   t.GetGenericTypeDefinition() == typeof(Nullable<>) &&
                   t.GetGenericArguments()[0].IsEnum;
        }
        public static bool IsNullable(this Type t)
        {
            return Nullable.GetUnderlyingType(t) != null;
        }

    }
}
