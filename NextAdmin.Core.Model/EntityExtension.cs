using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Reflection;

namespace NextAdmin.Core.Model
{
    public static class EntityExtension
    {

        public static object GetEntityPrimaryKeyValue(object entity)
        {
            var entityType = entity.GetType();
            var primaryKey = GetEntityPrimaryKeyInfo(entityType);
            if (primaryKey == null)
            {
                throw new Exception("Unable to find primary key on this entity");
            }
            return primaryKey.GetValue(entity);
        }

        public static PropertyInfo GetEntityPrimaryKeyInfo(System.Type entityType)
        {
            return entityType.GetProperties().FirstOrDefault(e => e.GetCustomAttribute<KeyAttribute>() != null);
        }

        public static List<ForeignEntityInfo> GetEntityForeignEntityInfos(System.Type entityType)
        {
            var foreignEntityInfos = new List<ForeignEntityInfo>();
            foreach (var property in entityType.GetProperties())
            {
                ForeignKeyAttribute foreignKeyAttribute = property.GetCustomAttribute<ForeignKeyAttribute>();
                if (foreignKeyAttribute == null)
                    continue;

                ForeignEntityInfo foreignEntityInfo = new ForeignEntityInfo
                {
                    ForeignEntityType = property.PropertyType,
                    ForeignEntityMemberName = property.Name,
                    ForeignEntityKeyMemberName = foreignKeyAttribute.Name
                };
                foreignEntityInfos.Add(foreignEntityInfo);
            }
            return foreignEntityInfos;
        }

        public static List<string> GetReadOnlyMembers(Type entityType)
        {
            var readOnlyMembers = new List<string>();
            foreach (var property in entityType.GetProperties())
            {
                ReadOnlyAttribute readOnlyAttribute = property.GetCustomAttribute<ReadOnlyAttribute>();
                if (readOnlyAttribute != null)
                {
                    readOnlyMembers.Add(property.Name);
                }
            }
            return readOnlyMembers;
        }


        public static void UpdateEntityJoinedMembers(object entity, NextAdminDbContext dbContext)
        {
            var pkInfo = GetEntityPrimaryKeyInfo(entity.GetType());
            var pkValue = GetEntityPrimaryKeyValue(entity);
            if (pkValue == null)
            {
                return;
            }
            var columnsToSelect = new List<string>();
            var joinedMemberNames = new List<string>();
            foreach (var property in entity.GetType().GetProperties())
            {
                JoinedMemberAttribute joinedMemberAttribute = property.GetCustomAttribute<JoinedMemberAttribute>();
                if (joinedMemberAttribute == null)
                    continue;

                var fereignEntityPath = joinedMemberAttribute.Path.Split(".");
                if (fereignEntityPath.Length == 2)
                {
                    string foreignRelationMemberName = fereignEntityPath.FirstOrDefault();
                    if (foreignRelationMemberName != null)
                    {
                        var foreignEntity = entity.GetPropetyValue(foreignRelationMemberName);
                        if (foreignEntity != null)
                        {
                            var foreignValue = foreignEntity.GetPropetyValue(fereignEntityPath.LastOrDefault());
                            entity.SetPropertyValue(property.Name, foreignValue);
                            continue;
                        }
                    }
                }

                columnsToSelect.Add(joinedMemberAttribute.Path + " AS " + property.Name);
                joinedMemberNames.Add(property.Name);
            }
            if (columnsToSelect.Count > 0)
            {
                var data = dbContext.Set(entity.GetType()).Where(pkInfo.Name + "=@0", pkValue.ToString()).Select("new(" + string.Join(",", columnsToSelect) + ")").FirstOrDefault();
                foreach (string joinedMemberName in joinedMemberNames)
                {
                    System.Type dynamicType = data.GetType();
                    var propertyValue = (object)dynamicType.GetProperty(joinedMemberName).GetValue(data, null);
                    entity.SetPropertyValue(joinedMemberName, propertyValue);
                }
            }
        }

        public static void UpdateJoinedMembers(this IEntity entity, NextAdminDbContext model)
        {
            UpdateEntityJoinedMembers(entity, model);
        }

        public static List<string> GetEntityDisplayMembers(Type entityType)
        {
            var memberNames = new Dictionary<string, int>();
            foreach (var property in entityType.GetProperties())
            {
                PreviewableAttribute displayMemberAttribute = property.GetCustomAttribute<PreviewableAttribute>();
                if (displayMemberAttribute == null)
                    continue;
                memberNames.Add(property.Name, displayMemberAttribute.Index);
            }
            return memberNames.OrderBy(e => e.Value).Select(e => e.Key).ToList();
        }

        public static List<string> GetEntityParentNames(Type entityType, NextAdminDbContext dbContext)
        {
            List<string> parentNames = new List<string>();
            Type? parentType = entityType;
            while (parentType != null)
            {
                parentType = parentType.BaseType;
                if (parentType != null && dbContext.Set(parentType.Name) != null)
                {
                    parentNames.Add(parentType.Name);
                }
            }
            return parentNames;
        }


        public static EntityInfo GetInfo(this IEntity entity, NextAdminDbContext dbContext)
        {
            return GetEntityInfo(entity.GetType(), dbContext);
        }

        public static EntityInfo GetEntityInfo(Type entityType, NextAdminDbContext dbContext)
        {
            var entityInfo = new EntityInfo(entityType.Name);
            entityInfo.EntityTableName = dbContext.Model.FindRuntimeEntityType(entityType).GetTableName();
            entityInfo.EntityDisplayName = GetEntityDisplayName(entityType, dbContext);//litle indian
            entityInfo.DisplayMembersNames = GetEntityDisplayMembers(entityType);
            entityInfo.EntityParentNames = GetEntityParentNames(entityType, dbContext);

            var memberDisplayNames = GetEntityMembersDisplayNames(entityType, dbContext);
            var entityPkInfo = GetEntityPrimaryKeyInfo(entityType);
            var foreignEntityInfo = GetEntityForeignEntityInfos(entityType);

            foreach (var entityPropertyInfo in entityType.GetProperties())
            {
                if (entityPropertyInfo.GetSetMethod() != null)
                {
                    var enumValues = entityPropertyInfo.GetEnumPropertyValuesLabels(dbContext).Select(e => new ValueItem(e.Key, e.Value)).ToList();

                    entityInfo.MembersInfos.Add(entityPropertyInfo.Name, new EntityMemberInfo
                    {
                        MemberName = entityPropertyInfo.Name,
                        MemberDisplayName = memberDisplayNames.ContainsKey(entityPropertyInfo.Name) ? memberDisplayNames[entityPropertyInfo.Name] : null,
                        MemberType = entityPropertyInfo.PropertyType,
                        IsPrimaryKey = entityPkInfo != null && entityPkInfo.Name == entityPropertyInfo.Name,
                        IsRequired = entityPropertyInfo.GetCustomAttribute<RequiredAttribute>() != null || (enumValues.Count > 0 && Nullable.GetUnderlyingType(entityPropertyInfo.PropertyType) == null),
                        MemberValues = enumValues,
                        ForeignEntityName = foreignEntityInfo.Where(e => e.ForeignEntityKeyMemberName == entityPropertyInfo.Name).Select(e => e.ForeignEntityType.Name).FirstOrDefault(),
                        ForeignEntityRelationName = foreignEntityInfo.Where(e => e.ForeignEntityKeyMemberName == entityPropertyInfo.Name).Select(e => e.ForeignEntityMemberName).FirstOrDefault(),
                        IsQueryable = entityPropertyInfo.GetCustomAttribute<NotMappedAttribute>() == null
                      && entityPropertyInfo.GetCustomAttribute<ForeignKeyAttribute>() == null
                      && entityPropertyInfo.GetCustomAttribute<JsonIgnoreAttribute>() == null
                      && entityPropertyInfo.PropertyType.GetJSName() != "object"
                    });
                }
            }
            return entityInfo;
        }


        public static void SetEntityData(EntityInfo entityInfo, object entity, Dictionary<string, object> data)
        {
            foreach (var dataItem in data)
            {
                var memberInfo = entityInfo.MembersInfos.Select(e => e.Value).FirstOrDefault(e => e.MemberName == dataItem.Key || e.MemberName.FirstCharToLower() == dataItem.Key.FirstCharToLower());
                if (memberInfo != null)
                {
                    var convertedValue = Core.Convert.ConvertTo(dataItem.Value, memberInfo.MemberType);
                    entity.SetPropertyValue(memberInfo.MemberName, convertedValue);
                }
            }
        }

        public static void SetEntityMemberValue(EntityInfo entityInfo, object entity, string memberName, object memberValue)
        {
            var memberInfo = entityInfo.MembersInfos.Select(e => e.Value).FirstOrDefault(e => e.MemberName == memberName || e.MemberName.FirstCharToLower() == memberName.FirstCharToLower());
            if (memberInfo != null)
            {
                var convertedValue = Core.Convert.ConvertTo(memberValue, memberInfo.MemberType);
                entity.SetPropertyValue(memberInfo.MemberName, convertedValue);
            }
        }



        public static Dictionary<string, string> GetEntityMembersDisplayNames(Type entityType, NextAdminDbContext dbContext)
        {
            var dictionary = new Dictionary<string, string>();
            foreach (var property in entityType.GetProperties())
            {
                LabelAttribute displayResourceNameAttribute = property.GetCustomAttribute<LabelAttribute>();
                if (displayResourceNameAttribute == null)
                    continue;
                dictionary.Add(property.Name, dbContext.Resources.Get(displayResourceNameAttribute.ResourceName != null ? displayResourceNameAttribute.ResourceName : property.Name));
            }
            return dictionary;
        }


        public static Dictionary<string, string> GetMembersDisplayNames(this IEntity entity, NextAdminDbContext dbContext)
        {
            return GetEntityMembersDisplayNames(entity.GetType(), dbContext);
        }


        public static string GetEntityDisplayName(Type entityType, NextAdminDbContext dbContext)
        {
            LabelAttribute displayResourceNameAttribute = entityType.GetCustomAttribute<LabelAttribute>();
            if (displayResourceNameAttribute == null)
                return null;
            return dbContext.Resources.Get(displayResourceNameAttribute.ResourceName != null ? displayResourceNameAttribute.ResourceName : entityType.Name);
        }


        public static string GetDisplayName(this IEntity entity, NextAdminDbContext dbContext)
        {
            return GetEntityDisplayName(entity.GetType(), dbContext);
        }


        public static List<string> GetDisplayMembers(this IEntity entity)
        {
            return GetEntityDisplayMembers(entity.GetType());
        }

        public static List<string> GetDisplayValues(this IEntity entity)
        {
            return GetDisplayMembers(entity).Select(a => entity.GetMemberValue(a) as string).Where(a => !string.IsNullOrEmpty(a)).ToList();
        }

        public static string GetDisplayValue(this IEntity entity, string separator = " ")
        {
            return string.Join(" ", entity.GetDisplayValues());
        }

        public static List<string> GetOriginalDisplayValues(this IEntity entity, EntityEntry entry)
        {
            return GetDisplayMembers(entity).Select(a => entry.OriginalValues.GetValue<string>(a)).Where(a => !string.IsNullOrEmpty(a)).ToList();
        }

        public static string GetOriginalDisplayValue(this IEntity entity, EntityEntry entry, string separator = " ")
        {
            return string.Join(" ", entity.GetOriginalDisplayValues(entry));
        }

        public static object GetPrimaryKeyValue(this IEntity entity)
        {
            return GetEntityPrimaryKeyValue(entity);
        }

        public static PropertyInfo GetPrimaryKeyInfo(this IEntity entity)
        {
            return GetEntityPrimaryKeyInfo(entity.GetType());
        }

        public static object GetMemberValue<TEntity, TMember>(this TEntity entity, Expression<Func<TEntity, TMember>> member)
        {
            string memberName = NextAdmin.Core.Reflection.GetPropertyName(member);
            return NextAdmin.Core.Reflection.GetPropetyValue(entity, memberName);
        }

        public static object GetMemberValue(this IEntity entity, string memberName)
        {
            return NextAdmin.Core.Reflection.GetPropetyValue(entity, memberName);
        }

        public static bool IsUnique<TEntity, TMember>(this TEntity entity, NextAdminDbContext model, Expression<Func<TEntity, TMember>> member)
          where TEntity : class, IEntity
        {
            string memberName = NextAdmin.Core.Reflection.GetPropertyName(member);
            return entity.IsUnique(model, memberName);
        }

        public static List<ForeignEntityInfo> GetForeignEntityInfos(this IEntity entity)
        {
            return GetEntityForeignEntityInfos(entity.GetType());
        }

        public static bool IsUnique(this IEntity entity, NextAdminDbContext dbContext, string memberName)
        {
            var entityType = entity.GetType();
            object memberValue = entity.GetMemberValue(memberName);
            string primaryKeyName = entity.GetPrimaryKeyInfo().Name;
            object primaryKeyValue = entity.GetPrimaryKeyValue();
            bool isUnique = dbContext.Set(entityType).Where(memberName + " = @0 AND " + primaryKeyName + " != @1", memberValue, primaryKeyValue).Count() == 0;
            return isUnique;
        }


        public static List<KeyValuePair<int, string>> GetEnumPropertyValuesLabels(this PropertyInfo property, NextAdminDbContext dbContext)
        {
            var values = new List<KeyValuePair<int, string>>();
            var nullableType = Nullable.GetUnderlyingType(property.PropertyType);
            if (property.PropertyType.IsEnum || (nullableType != null && nullableType.IsEnum))
            {
                var enumType = nullableType == null ? property.PropertyType : nullableType;
                foreach (var enumValue in Enum.GetValues(enumType))
                {
                    string enumDisplayValue = enumValue.ToString();
                    var enumValuesMembersInfos = enumType.GetMember(enumDisplayValue);
                    var enumValueMemberInfo = enumValuesMembersInfos.FirstOrDefault(m => m.DeclaringType == enumType);
                    LabelAttribute displayResourceNameAttribute = enumValueMemberInfo.GetCustomAttribute<LabelAttribute>();
                    if (displayResourceNameAttribute != null)
                    {
                        enumDisplayValue = dbContext.Resources.Get(displayResourceNameAttribute.ResourceName != null ? displayResourceNameAttribute.ResourceName : enumValueMemberInfo.Name);
                    }
                    var value = new KeyValuePair<int, string>((int)enumValue, enumDisplayValue);
                    values.Add(value);
                }
            }

            return values;
        }



        /////////////DETAILS

        public static List<DetailsCollectionInfo> GetEntityDetailsInfos(object entity)
        {
            var dbCollectionInfos = new List<DetailsCollectionInfo>();

            foreach (var property in entity.GetType().GetProperties())
            {
                DetailsAttribute detailsAttribute = property.GetCustomAttribute<DetailsAttribute>();
                if (detailsAttribute == null)
                {
                    continue;
                }
                string propertyFullName = property.PropertyType.FullName;
                propertyFullName = propertyFullName.Substring(propertyFullName.IndexOf("[[") + 2);
                propertyFullName = propertyFullName.Substring(0, propertyFullName.IndexOf(","));
                string detailEntityName = propertyFullName.Split('.').LastOrDefault();
                if (string.IsNullOrWhiteSpace(detailEntityName))
                {
                    continue;
                }

                var detailCollection = property.GetValue(entity) as IList;

                dbCollectionInfos.Add(new DetailsCollectionInfo
                {
                    Property = property,
                    CollectionMemberName = property.Name,
                    Collection = detailCollection,
                    DetailEntityName = detailEntityName,
                    DetailForeignKeyName = detailsAttribute.DetailForeignKeyName,
                    MasterKeyName = detailsAttribute.MasterKeyName,
                    AutoLoad = detailsAttribute.AutoLoad,
                    AutoUpdate = detailsAttribute.AutoUpdate,
                    AutoDelete = detailsAttribute.AutoDelete,
                });
            }
            return dbCollectionInfos;
        }

        public static List<DetailsCollectionInfo> GetDetailsInfos(this IEntity entity)
        {
            return GetEntityDetailsInfos(entity);
        }

        public static IList LoadEntityDetails(object entity, NextAdminDbContext dbContext, DetailsCollectionInfo detailCollectionInfo, bool reloadIfNotEmpty = false)
        {
            if (detailCollectionInfo.Collection == null)
            {
                detailCollectionInfo.Collection = Activator.CreateInstance(detailCollectionInfo.Property.PropertyType) as IList;
                detailCollectionInfo.Property.SetValue(entity, detailCollectionInfo.Collection);
            }
            else if (detailCollectionInfo.Collection.Count > 0)
            {
                if (reloadIfNotEmpty)
                {
                    detailCollectionInfo.Collection.Clear();
                }
                else
                {
                    return detailCollectionInfo.Collection;
                }
            }
            object masterKeyValue = detailCollectionInfo.MasterKeyName != null ? entity.GetPropetyValue(detailCollectionInfo.MasterKeyName) : GetEntityPrimaryKeyValue(entity);
            if (masterKeyValue != null)
            {
                foreach (var detail in dbContext.Set(detailCollectionInfo.DetailEntityName).Where(detailCollectionInfo.DetailForeignKeyName + " = @0", masterKeyValue))
                {
                    detailCollectionInfo.Collection.Add(detail);
                }
            }
            return detailCollectionInfo.Collection;
        }


        public static List<IList> LoadEntityDetails(object entity, NextAdminDbContext dbContext, string[] detailNames, bool reloadIfNotEmpty = false)
        {
            var entityDbCollectionInfos = GetEntityDetailsInfos(entity);

            var detailsCollections = new List<IList>();
            foreach (var collectionInfo in entityDbCollectionInfos)
            {
                if (detailNames == null || detailNames.Length == 0 || detailNames.FirstOrDefault(e => e.ToLower() == collectionInfo.CollectionMemberName.ToLower()) != null)
                {
                    LoadEntityDetails(entity, dbContext, collectionInfo, reloadIfNotEmpty);
                    detailsCollections.Add(collectionInfo.Collection);
                }
            }
            return detailsCollections;
        }


        public static List<IList> LoadDetails(this IEntity entity, NextAdminDbContext dbContext, string[] detailNames)
        {
            return LoadEntityDetails(entity, dbContext, detailNames);
        }


        public static IList LoadDetails(this IEntity entity, NextAdminDbContext dbContext, DetailsCollectionInfo detailCollectionInfo, bool reloadIfNotEmpty = false)
        {
            return LoadEntityDetails(entity, dbContext, detailCollectionInfo, reloadIfNotEmpty);
        }


        public static IList LoadDetails(this IEntity entity, NextAdminDbContext dbContext, string detailName, bool reloadIfNotEmpty = false)
        {
            var collectionInfo = entity.GetDetailsInfos().FirstOrDefault(a => a.CollectionMemberName == detailName);
            if (collectionInfo == null)
            {
                return null;
            }
            return LoadEntityDetails(entity, dbContext, collectionInfo, reloadIfNotEmpty);
        }

        /*Return details without loading thems into entity member list*/
        public static List<T> GetDetails<T>(this IEntity entity, NextAdminDbContext dbContext, DetailsCollectionInfo detailCollectionInfo)
        {
            var details = new List<T>();
            object masterKeyValue = detailCollectionInfo.MasterKeyName != null ? entity.GetPropetyValue(detailCollectionInfo.MasterKeyName) : entity.GetPrimaryKeyValue();
            if (masterKeyValue != null)
            {
                foreach (var detail in dbContext.Set(detailCollectionInfo.DetailEntityName).Where(detailCollectionInfo.DetailForeignKeyName + " = @0", masterKeyValue))
                {
                    details.Add((T)detail);
                }
            }
            return details;
        }


        public static IList AttachDetails(this IEntity entity, NextAdminDbContext dbContext, DetailsCollectionInfo detailCollectionInfo)
        {
            if (detailCollectionInfo.Collection == null)
            {
                return null;
            }

            var toAttachDetailsDictionary = new Dictionary<object, IEntity>();
            foreach (IEntity detailToAttach in detailCollectionInfo.Collection)
            {
                var detailToAttachPrimaryKey = detailToAttach.GetPrimaryKeyValue();
                if (detailToAttachPrimaryKey == null)
                {
                    throw new Exception("Promary key value required");
                }
                toAttachDetailsDictionary.Add(detailToAttachPrimaryKey, detailToAttach);
            }

            var serializedDetails = entity.GetDetails<IEntity>(dbContext, detailCollectionInfo);
            foreach (var serializedDetail in serializedDetails)
            {
                var serilizedDetailPrimaryKey = serializedDetail.GetPrimaryKeyValue();
                if (serilizedDetailPrimaryKey == null)
                {
                    throw new Exception("Promary key value required");
                }
                if (toAttachDetailsDictionary.ContainsKey(serilizedDetailPrimaryKey))//Update serialized detail 
                {
                    var detailToAttach = toAttachDetailsDictionary[serilizedDetailPrimaryKey];
                    Copy.CopyTo(detailToAttach, serializedDetail);
                    toAttachDetailsDictionary.Remove(serilizedDetailPrimaryKey);
                    detailCollectionInfo.Collection.Remove(detailToAttach);
                    detailCollectionInfo.Collection.Add(serializedDetail);
                    dbContext.Attach(serializedDetail);
                }
                else//delete not axisting serlized detail
                {
                    dbContext.DeleteEntity(serializedDetail);
                }
            }
            foreach (var detailToAttach in toAttachDetailsDictionary.Values)//add new detail
            {
                dbContext.Add(detailToAttach);
            }

            ForeignEntityInfo relationInfo = null;
            foreach (var detail in detailCollectionInfo.Collection)
            {
                if (relationInfo == null)
                {
                    var foreignEntityInfo = GetForeignEntityInfos(detail as IEntity);
                    relationInfo = foreignEntityInfo.FirstOrDefault(a => a.ForeignEntityKeyMemberName == detailCollectionInfo.DetailForeignKeyName);
                }
                if (relationInfo != null)
                {
                    detail.SetPropertyValue(relationInfo.ForeignEntityMemberName, entity);
                }
                object masterKeyValue = detailCollectionInfo.MasterKeyName != null ? entity.GetPropetyValue(detailCollectionInfo.MasterKeyName) : entity.GetPrimaryKeyValue();
                detail.SetPropertyValue(detailCollectionInfo.DetailForeignKeyName, masterKeyValue);
            }
            return detailCollectionInfo.Collection;
        }


    }

}
