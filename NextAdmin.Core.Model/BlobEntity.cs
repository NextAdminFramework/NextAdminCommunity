using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;

namespace NextAdmin.Core.Model
{
    public interface IBlobEntity : IEntity
    {
        string Blob { get; set; }

    }

    public class BlobAttribute : NotMappedAttribute
    {

    }

    public static class BlobEntity
    {
        public static void ExtendBlobEntity(this IBlobEntity entity)
        {

            entity.OnLoading += (sender, args) =>
            {
                entity.DeserializeBlob();
            };

            entity.OnSaving += (sender, args) =>
            {
                entity.SerializeBlob();
            };
        }

        public static Dictionary<string, object> DeserializeBlob(this IBlobEntity entity)
        {
            if (string.IsNullOrWhiteSpace(entity.Blob))
                return null;
            var jBlob = JObject.Parse(entity.Blob);
            Dictionary<string, object> blobMemberDictionary = new Dictionary<string, object>();
            foreach (PropertyInfo blobMemberInfo in entity.GetType().GetProperties().Where(e => e.GetCustomAttribute<BlobAttribute>() != null))
            {
                try
                {
                    var jValue = jBlob.GetValue(blobMemberInfo.Name);
                    if (jValue != null)
                    {
                        var memberValue = jValue.ToObject(blobMemberInfo.PropertyType);
                        blobMemberInfo.SetValue(entity, memberValue);
                        blobMemberDictionary.Add(blobMemberInfo.Name, memberValue);
                    }
                }
                catch
                {

                }
            }
            return blobMemberDictionary;
        }

        public static string SerializeBlob(this IBlobEntity entity)
        {
            var blobMembersDictionary = GetBlobMemberDictionary(entity);
            entity.Blob = blobMembersDictionary.ToJSON();
            return entity.Blob;
        }

        public static Dictionary<string, object> GetBlobMemberDictionary(this IBlobEntity entity)
        {
            Dictionary<string, object> blobMemberDictionary = new Dictionary<string, object>();
            foreach (PropertyInfo blobMemberInfo in entity.GetType().GetProperties().Where(e => e.GetCustomAttribute<BlobAttribute>() != null))
            {
                var blobMemberValue = blobMemberInfo.GetValue(entity);
                blobMemberDictionary.Add(blobMemberInfo.Name, blobMemberValue);
            }
            return blobMemberDictionary;
        }
    }
}
