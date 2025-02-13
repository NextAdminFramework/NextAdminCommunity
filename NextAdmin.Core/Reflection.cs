using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace NextAdmin.Core
{
    public static class Reflection
    {


        public static string GetPropertyName<T, TMember>(Expression<Func<T, TMember>> member)
        {
            MemberExpression memberExpression = (MemberExpression)member.Body;
            return memberExpression.Member.Name;
        }


        public static string GetPropertyName<T, TMember>(this T obj, Expression<Func<T, TMember>> member)
          where T : class
        {
            MemberExpression memberExpression = (MemberExpression)member.Body;
            return memberExpression.Member.Name;
        }

        public static object GetPropetyValue(this object obj, string memberName)
        {
            System.Type type = obj.GetType();
            return type.GetProperty(memberName).GetValue(obj);
        }

        public static object TryGetPropetyValue(this object obj, string memberName)
        {
            System.Type type = obj.GetType();
            var property = type.GetProperty(memberName);
            if (property == null)
            {
                return null;
            }
            return property.GetValue(obj);
        }

        public static void SetPropertyValue(this object obj, string memberName, object value)
        {
            System.Type type = obj.GetType();
            PropertyInfo memberPropertyInfo = type.GetProperty(memberName);
            memberPropertyInfo.SetValue(obj, value);
        }

        public static bool TrySetPropertyValue(this object obj, string memberName, object value)
        {
            System.Type type = obj.GetType();
            PropertyInfo memberPropertyInfo = type.GetProperty(memberName);
            if (memberPropertyInfo == null)
            {
                return false;
            }
            memberPropertyInfo.SetValue(obj, value);
            return true;
        }

        public static Type GetPropertyType(this object obj, string propertyName)
        {
            System.Type type = obj.GetType();
            return GetPropertyType(type, propertyName);
        }

        public static Type GetPropertyType(this System.Type objType, string propertyName)
        {
            return objType.GetProperty(propertyName).PropertyType;
        }


        public static List<string> GetPropertiesNames(this object obj)
        {
            return obj.GetType().GetProperties().Select(e => e.Name).ToList();
        }

        public static IEnumerable<Type> GetAllClassesImplementingInterface<T>()
        {
            var @interface = typeof(T);
            return @interface.IsInterface
                       ? AppDomain.CurrentDomain.GetAssemblies()
                             .SelectMany(assembly => assembly.GetTypes())
                             .Where(type => !type.IsInterface
                                         && !type.IsAbstract
                                         && type.GetInterfaces().Contains(@interface))
                       : new Type[] { };
        }


    }

}
