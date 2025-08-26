using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using NextAdmin.Core;
using NextAdmin.Core.API.ViewModels.Args;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.Core.Model.QueryBuilder;
using System.Linq.Dynamic.Core;

namespace NextAdmin.Core.API.Controllers
{
    [ApiController, Route("entity/{action}/{id?}")]
    public abstract class EntityController<TUser> : Controller<TUser>
        where TUser : class, IUser
    {


        protected virtual IEnumerable<IEntityRight> EntityRights { get { return null; } }


        private Dictionary<string, IEntityRight> _entityRightDictionary;
        public Dictionary<string, IEntityRight> EntityRightDictionary
        {
            get
            {
                if (_entityRightDictionary == null)
                {
                    _entityRightDictionary = new Dictionary<string, IEntityRight>();
                    if (EntityRights == null)
                    {
                        return _entityRightDictionary;
                    }
                    foreach (var entityRight in EntityRights)
                    {
                        _entityRightDictionary.Add(entityRight.EntityName, entityRight);
                    }
                }
                return _entityRightDictionary;
            }
        }


        public EntityController(NextAdminDbContext model = null, IConfiguration configuration = null)
          : base(model, configuration)
        {

        }

        protected virtual IEntityRight? GetUserEntityRight(string entityName)
        {
            if (this.User == null)
            {
                return null;
            }
            IEntityRight entityRight;
            if (!EntityRightDictionary.TryGetValue(entityName, out entityRight))
            {
                return null;
            }
            return entityRight;
        }

        protected virtual RightType GetUserGlobalEntityRight(string entityName)
        {
            if (this.User == null)
            {
                return RightType.Denied;
            }
            if (EntityRightDictionary.Count == 0)
            {
                return RightType.ReadWrite;
            }
            IEntityRight entityRight;
            if (!EntityRightDictionary.TryGetValue(entityName, out entityRight))
            {
                return RightType.Denied;
            }
            return entityRight.GlobalRight;
        }

        protected virtual RightType GetUserSpecificEntityRight(string entityName, object entity)
        {
            if (User == null)
            {
                return RightType.Denied;
            }
            if (EntityRightDictionary.Count == 0)
            {
                return RightType.ReadWrite;
            }
            IEntityRight entityRight;
            if (!EntityRightDictionary.TryGetValue(entityName, out entityRight))
            {
                return RightType.Denied;
            }
            if (entityRight.GetSpecificRightFunc == null)
            {
                return entityRight.GlobalRight;
            }
            return entityRight.GetSpecificRightFunc(entity);
        }

        public virtual RightType GetUserEntityRight(string? entityName = null, string? entityId = null)
        {
            if (User == null)
            {
                return RightType.Denied;
            }
            if (entityName == null)
            {
                throw new Exception("entity name is required");
            }
            if (entityId == null)
            {
                return GetUserGlobalEntityRight(entityName);
            }
            var entity = DbContext.GetEntity(entityName, entityId);
            if (entity == null)
            {
                return RightType.Denied;
            }
            return GetUserSpecificEntityRight(entityName, entity);
        }

        protected LockInfo? TryLockEntityOrGetLock(string entityName, object entity, string? lockKey)
        {
            Lock _lock = null;
            if (!string.IsNullOrEmpty(lockKey) && GetUserGlobalEntityRight(entityName) == RightType.ReadWrite)
            {
                _lock = DbContext.TryLockEntity(entityName, entity, lockKey);
            }
            if (_lock == null)
            {
                _lock = DbContext.GetEntityLock(entityName, entity);
            }
            if (_lock != null)
            {
                return new LockInfo(_lock, _lock.Key == lockKey);
            }
            return null;
        }

        [HttpGet, HttpPost]
        public virtual ApiResponse<LockInfo> TryLockEntity(string entityName, string entityId, string lockKey)
        {
            try
            {
                if (this.GetUserGlobalEntityRight(entityName) != RightType.ReadWrite)
                {
                    return ApiResponse<LockInfo?>.Error(ApiResponseCode.PermissionLevelError);
                }
                var _lock = DbContext.TryLockEntity(entityName, entityId, lockKey);
                if (_lock != null)
                {
                    return ApiResponse<LockInfo?>.Success(new LockInfo(_lock, true));
                }
                _lock = DbContext.GetEntityLock(entityName, entityId);
                if (_lock != null)
                {
                    return ApiResponse<LockInfo?>.Error(ApiResponseCode.ParametersError, new LockInfo(_lock, false));
                }
                return ApiResponse<LockInfo?>.Error(ApiResponseCode.ParametersError);
            }
            catch (Exception ex)
            {
                return ApiResponse<LockInfo?>.Error(ex);
            }
        }

        [HttpGet, HttpPost]
        public virtual ApiResponse TryUnlockEntity(string entityName, string entityId, string lockKey)
        {
            try
            {
                if (this.GetUserGlobalEntityRight(entityName) != RightType.ReadWrite)
                {
                    return ApiResponse.Error(ApiResponseCode.PermissionLevelError);
                }
                if (DbContext.TryUnlockEntity(entityName, entityId, lockKey))
                {
                    return ApiResponse.Success();
                }
                return ApiResponse.Error(ApiResponseCode.ParametersError);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
        }


        [HttpGet, HttpPost]
        public virtual GetEntitiesResponse GetEntities([FromBody] GetEntitiesArgs args)
        {
            var response = new GetEntitiesResponse();
            try
            {
                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadOnly)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString();
                    return response;
                }
                DbContext.Paramters = args.Parameters;
                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception("Unable to find Action : " + args.CustomActionName);
                    }
                    response.Entities = customAction.Invoke(this, new object[] { args }) as List<object>;
                }
                else
                {
                    SQLSelectQueryBuilder query = DbContext.SQLQuery(args.EntityName).Select(args.ColumnToSelectNames != null && args.ColumnToSelectNames.Count > 0 ? args.ColumnToSelectNames.ToArray() : new string[] { DbContext.GetEntityInfo(args.EntityName).GetPrimaryKeyName() });
                    if (args.TakeRecordCount.HasValue)
                    {
                        query = query.Take(args.TakeRecordCount.Value);
                    }
                    if (args.SkipRecordCount.HasValue)
                    {
                        query = query.Skip(args.SkipRecordCount.Value);
                    }
                    query = BuildSelectQuery(query, args);

                    var entityInfo = DbContext.GetEntityInfo(args.EntityName);
                    bool isDerived = entityInfo.EntityParentNames != null && entityInfo.EntityParentNames.Count > 0;
                    if (isDerived)
                    {
                        query = query.Where($"{entityInfo.EntityTableName}.Discriminator = ?", entityInfo.EntityName);
                    }

                    if (args.ColumnToSelectNames != null && args.ColumnToSelectNames.Count > 0)//user select columns, so we juste execute query with desired column
                    {
                        var userEntityRight = GetUserEntityRight(args.EntityName);
                        if (userEntityRight != null && userEntityRight.GetSpecificRightFunc != null)
                        {
                            throw new Exception("Entity with custom right can't select custom columns");
                        }
                        if (EntityRightDictionary.Count > 0)//Some entities has right, so we check that selected entities doesn't try to read data on theme
                        {
                            foreach (var selectQuery in args.ColumnToSelectNames)
                            {
                                foreach (var selectColumn in selectQuery.Split(','))
                                {
                                    var selectParts = selectColumn.Split('.').ToList();
                                    selectParts.Remove(selectParts.Last());
                                    foreach (var entityName in selectParts)
                                    {
                                        IEntityRight selectEntityRight;
                                        if (!EntityRightDictionary.TryGetValue(entityName, out selectEntityRight))
                                        {
                                            throw new Exception($"Entity {entityName} has no right info in a context with entities right, so access to this entity is not alowed");
                                        }
                                        if (selectEntityRight.GlobalRight < RightType.ReadOnly)
                                        {
                                            throw new Exception($"Entity {entityName} access is not allowed");
                                        }
                                        if (selectEntityRight.GetSpecificRightFunc != null)
                                        {
                                            throw new Exception($"Entity {entityName} has specific right that can't be checked, so access to this entity is forbiden");
                                        }
                                    }
                                }
                            }
                        }
                        response.Entities = query.Execute().Cast<object>().ToList();
                    }
                    else//user no select column so we execute query and instanciate entities
                    {
                        var entityPkInfo = entityInfo.GetPrimaryKeyInfo();
                        var entitiesIds = query.Execute().Select(e => e[entityPkInfo.MemberName]).Distinct().ToList();
                        int noParam = 0;
                        response.Entities = new List<object>();
                        if (entitiesIds.Count > 0)
                        {
                            object castedEntitiesIds = null;
                            if (entityPkInfo.MemberType == typeof(int?))
                            {
                                castedEntitiesIds = entitiesIds.Select(e => new int?(System.Convert.ToInt32(e))).ToList();
                            }
                            else if (entityPkInfo.MemberType == typeof(long?))
                            {
                                castedEntitiesIds = entitiesIds.Select(e => new long?(System.Convert.ToInt64(e))).ToList();
                            }
                            else if (entityPkInfo.MemberType == typeof(Guid))
                            {
                                castedEntitiesIds = entitiesIds.Select(e => new Guid(e.ToString())).ToList();
                            }
                            else if (entityPkInfo.MemberType == typeof(Guid?))
                            {
                                castedEntitiesIds = entitiesIds.Select(e => new Guid?(new Guid(e.ToString()))).ToList();
                            }
                            else
                            {
                                castedEntitiesIds = entitiesIds;
                            }
                            var linqQuery = DbContext.Set(args.EntityName).Where("@0.Contains(" + entityPkInfo.MemberName + ")", castedEntitiesIds);

                            Dictionary<object, object> entitiesDictionary = new Dictionary<object, object>();
                            foreach (object entity in linqQuery)
                            {
                                entitiesDictionary.Add(entity.GetPropetyValue(entityPkInfo.MemberName).ToString().ToLower(), entity);
                            }
                            foreach (var entityId in entitiesIds)
                            {
                                var entity = entitiesDictionary[entityId.ToString().ToLower()];
                                response.Entities.Add(entity);
                            }
                        }
                    }
                }
                response.Entities = PresentEntities(args.EntityName, response.Entities);

                OnGetEntities(args.EntityName, args, response.Entities);
                response.Code = ApiResponseCode.Success.ToString();
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }


        protected SQLSelectQueryBuilder BuildSelectQuery(SQLSelectQueryBuilder query, GetEntitiesArgs args)
        {
            if (!string.IsNullOrWhiteSpace(args.WhereQuery))
            {
                if (args.WhereQueryArgs != null)
                {
                    query = query.Where(args.WhereQuery, args.WhereQueryArgs.Select(a =>
                    {
                        if (a is JArray)
                        {
                            var array = ((JArray)a).ToObject<object[]>();
                            return array;
                        }
                        return a;
                    }).ToArray());
                }
                else
                {
                    query = query.Where(args.WhereQuery);
                }
            }
            if (args.OrderColumnNames != null && args.OrderColumnNames.Count > 0)
            {
                query = query.OrderBy(args.OrderColumnNames.ToArray());
            }
            if (args.SkipRecordCount.HasValue)
            {
                if (args.OrderColumnNames == null || args.OrderColumnNames.Count == 0)
                {
                    query = query.OrderBy(query.MainEntityInfo.GetPrimaryKeyName());
                }
                query = query.Skip(args.SkipRecordCount.Value);
            }
            if (args.TakeRecordCount.HasValue)
            {
                query = query.Take(args.TakeRecordCount.Value);
            }
            if (args.IsSelectDistinctQuery)
            {
                query = query.Distinct();
            }
            return query;
        }



        protected virtual void OnGetEntities(string entityName, GetEntitiesArgs args, List<object> entities)
        {



        }


        [HttpGet, HttpPost]
        public virtual GetEntityResponse GetEntity(GetEntityArgs args)
        {
            var response = new GetEntityResponse();
            try
            {
                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadOnly)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString(); ;
                    return response;
                }
                if (args.EntityId == null)
                {
                    throw new Exception("Entity id can't be null");
                }
                DbContext.Paramters = args.Parameters;
                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception($"Unable to find Action : {args.CustomActionName}");
                    }
                    response.Entity = customAction.Invoke(this, new object[] { args }) as List<object>;
                }
                else
                {
                    var mainEntity = DbContext.GetEntity(args.EntityName, args.EntityId);
                    response.Entity = PresentEntity(args.EntityName, mainEntity);
                    if (response.Entity == null)
                    {
                        response.Message = "Unable to find entity";
                        response.Code = ApiResponseCode.ParametersError.ToString();
                        return response;
                    }

                    if (args.DetailToLoadNames != null)
                    {
                        EntityExtension.LoadEntityDetails(response.Entity, DbContext, args.DetailToLoadNames.ToArray());
                    }
                }

                OnGetEntity(response.Entity);
                if (response.Entity != null && !string.IsNullOrEmpty(args.LockKey))
                {
                    response.LockInfo = TryLockEntityOrGetLock(args.EntityName, response.Entity, args.LockKey);
                }
                response.Code = ApiResponseCode.Success.ToString();
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString(); ;
            }
            return response;
        }

        [HttpGet, HttpPost]
        public virtual GetEntityResponse CreateEntity(ViewModels.Args.EntityArgs args)
        {
            var response = new GetEntityResponse();
            try
            {
                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadOnly)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString();
                    return response;
                }
                DbContext.Paramters = args.Parameters;
                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception("Unable to find Action : " + args.CustomActionName);
                    }
                    response.Entity = customAction.Invoke(this, new object[] { args }) as List<object>;
                }
                else
                {
                    response.Entity = DbContext.CreateEntity(args.EntityName) as Entity;
                }
                response.Entity = PresentEntity(args.EntityName, response.Entity);
                response.Code = ApiResponseCode.Success.ToString();
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }

        protected virtual void OnCreateEntity(object entity)
        {



        }

        protected virtual void OnGetEntity(object entity)
        {



        }


        protected object? PresentEntity(string entityName, object? entity)
        {
            if (entity == null)
            {
                return null;
            }
            return PresentEntities(entityName, new object[] { entity }).FirstOrDefault();
        }

        protected virtual List<object> PresentEntities(string entityName, IEnumerable<object>? entitiies)
        {
            if (entitiies == null)
            {
                return new List<object>();
            }
            return entitiies.Where(a => this.GetUserSpecificEntityRight(entityName, a) >= RightType.ReadOnly).ToList();
        }


        [HttpGet, HttpPost]
        public virtual DeleteEntityResponse DeleteEntity(GetEntityArgs args)
        {
            var response = new DeleteEntityResponse();
            try
            {
                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadWrite)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString(); ;
                    return response;
                }
                DbContext.Paramters = args.Parameters;
                object entityToDelete = null;
                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception("Unable to find Action : " + args.CustomActionName);
                    }
                    entityToDelete = customAction.Invoke(this, new object[] { args }) as List<object>;
                }
                else
                {
                    entityToDelete = DbContext.GetEntity(args.EntityName, args.EntityId);
                    if (entityToDelete == null)
                    {
                        response.Code = ApiResponseCode.ValidationError.ToString(); ;
                        response.Message = "Unable to find this element";
                        return response;
                    }
                }
                if (entityToDelete != null)
                {
                    DbContext.DeleteEntity(entityToDelete);
                    OnDeleteEntity(entityToDelete);
                }

                var saveResult = DbContext.ValidateAndSave();
                FillSaveResponse(saveResult, response);
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }

        protected virtual void OnDeleteEntity(object entityToDelete)
        {



        }


        [HttpPost]
        public virtual SaveEntityResponse SaveEntity([FromBody] SaveEntityArgs args)
        {
            var response = new SaveEntityResponse();
            try
            {
                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadWrite)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString();
                    return response;
                }
                DbContext.Paramters = args.Parameters;
                var entityType = DbContext.Set(args.EntityName).ElementType;
                object entityToAddOrUpdate = args.Entity.ToObject(entityType);
                var entityId = EntityExtension.GetEntityPrimaryKeyValue(entityToAddOrUpdate);
                var serializedEntity = DbContext.GetEntity(entityType, entityId);
                if (serializedEntity == null)
                {
                    DbContext.Add(entityToAddOrUpdate);
                }
                else
                {
                    if (!string.IsNullOrEmpty(args.LockKey))
                    {
                        var entityLock = DbContext.GetEntityLock(args.EntityName, serializedEntity);
                        if (entityLock != null && entityLock.Key != args.LockKey)
                        {
                            response.Code = ApiResponseCode.LockError.ToString();
                            return response;
                        }
                    }
                    if (args.ConflictAction == ConflictAction.Cancel && serializedEntity is ITraceableEntity && entityToAddOrUpdate is ITraceableEntity)
                    {
                        var newVersion = entityToAddOrUpdate as ITraceableEntity;
                        var previousVersion = serializedEntity as ITraceableEntity;
                        if (newVersion.ModificationDate.HasValue && previousVersion.ModificationDate.HasValue && newVersion.ModificationDate < previousVersion.ModificationDate)
                        {
                            response.Code = "VERSION_CONFLICT";
                            return response;
                        }
                    }

                    var entityReadOnlyMembers = EntityExtension.GetReadOnlyMembers(entityToAddOrUpdate.GetType());
                    var jsonPropertyNames = args.Entity.OfType<JProperty>()
                        .Where(a => entityReadOnlyMembers.FirstOrDefault(erm => erm.ToLower() == a.Name.ToLower()) == null)
                        .Select(e => e.Name).ToList();
                    entityToAddOrUpdate.CopyTo(serializedEntity, false, true, jsonPropertyNames);
                    entityToAddOrUpdate = serializedEntity;
                }

                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception("Unable to find Action : " + args.CustomActionName);
                    }
                    customAction.Invoke(this, new object[] { args, entityToAddOrUpdate });
                }
                OnSaveEntity(entityToAddOrUpdate);

                var saveResult = DbContext.ValidateAndSave();
                FillSaveResponse(saveResult, response);
                if (saveResult.Success)
                {
                    OnEndSaveEntities(saveResult);
                    response.Entity = PresentEntity(args.EntityName, entityToAddOrUpdate);
                }
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }



        protected virtual void OnSaveEntity(object entity)
        {



        }


        protected virtual void OnEndSaveEntities(SaveResult result)
        {



        }



        [HttpPost]
        public virtual SaveEntitiesResponse SaveEntities([FromBody] SaveEntitiesArgs args)
        {
            var response = new SaveEntitiesResponse();
            response.Entities = new List<object>();
            try
            {

                if (this.GetUserGlobalEntityRight(args.EntityName) < RightType.ReadWrite)
                {
                    response.Code = ApiResponseCode.PermissionLevelError.ToString(); ;
                    return response;
                }
                DbContext.Paramters = args.Parameters;
                var entityType = DbContext.Set(args.EntityName).ElementType;
                if (args.EntitiesToAddOrUpdate != null && args.EntitiesToAddOrUpdate.Count() > 0)
                {
                    foreach (var jsonEntityData in args.EntitiesToAddOrUpdate)
                    {
                        object entityToAddOrUpdate = jsonEntityData.ToObject(entityType);
                        var entityPk = EntityExtension.GetEntityPrimaryKeyValue(entityToAddOrUpdate);
                        var serializedEntity = DbContext.GetEntity(entityType, entityPk);
                        if (serializedEntity == null)
                        {
                            DbContext.Add(entityToAddOrUpdate);
                            OnSaveEntity(entityToAddOrUpdate);
                            response.Entities.Add(entityToAddOrUpdate);
                        }
                        else
                        {
                            var jsonPropertyNames = jsonEntityData.OfType<JProperty>().Select(e => e.Name).ToList();
                            entityToAddOrUpdate.CopyTo(serializedEntity, false, true, jsonPropertyNames);
                            OnSaveEntity(serializedEntity);
                            response.Entities.Add(serializedEntity);
                        }
                    }
                }
                List<object> entitiesToDelete = new List<object>();
                if (args.EntitiesToDeleteIds != null && args.EntitiesToDeleteIds.Count > 0)
                {
                    foreach (var entityId in args.EntitiesToDeleteIds)
                    {
                        var entityToDelete = DbContext.GetEntity(args.EntityName, entityId);
                        entitiesToDelete.Add(entityToDelete);
                        OnDeleteEntity(entityToDelete);
                        DbContext.DeleteEntity(entityToDelete);
                    }
                }
                if (args.CustomActionName != null)
                {
                    var customAction = GetType().GetMethod(args.CustomActionName);
                    if (customAction == null)
                    {
                        throw new Exception("Unable to find Action : " + args.CustomActionName);
                    }
                    customAction.Invoke(this, new object[] { args, response.Entities, entitiesToDelete });
                }
                var saveResult = DbContext.ValidateAndSave();
                if (saveResult.Success)
                {
                    OnEndSaveEntities(saveResult);
                }
                FillSaveResponse(saveResult, response);
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }



        public static void FillSaveResponse(SaveResult saveResult, ISaveResponse response)
        {
            if (response.Errors == null)
            {
                response.Errors = new List<EntityError>();
            }
            if (response.Warnings == null)
            {
                response.Warnings = new List<EntityError>();
            }
            if (saveResult.EntityValidationInfos != null && saveResult.EntityValidationInfos.Count > 0)
            {
                foreach (EntityValidationInfo validationResult in saveResult.EntityValidationInfos)
                {
                    response.Errors.AddRange(validationResult.Errors.Select((e) => new EntityError
                    {
                        EntityId = validationResult.EntityId,
                        EntityName = validationResult.EntityName,
                        MemberName = e.MemberName != null ? e.MemberName.FirstCharToLower() : null,
                        Message = e.Message,
                        ErrorCode = e.Code
                    }));

                    response.Warnings.AddRange(validationResult.Warning.Select((e) => new EntityError
                    {
                        EntityId = validationResult.EntityId,
                        EntityName = validationResult.EntityName,
                        MemberName = e.MemberName != null ? e.MemberName.FirstCharToLower() : null,
                        Message = e.Message,
                        ErrorCode = e.Code
                    }));
                }
            }
            if (saveResult.EntityUpdatedInfos != null && saveResult.EntityUpdatedInfos.Count > 0)
            {
                response.UpdateInfos = saveResult.EntityUpdatedInfos.Where(a => a.Entity is Entity
                && a.State != Microsoft.EntityFrameworkCore.EntityState.Unchanged
                && a.State != Microsoft.EntityFrameworkCore.EntityState.Detached).Select(a => new ViewModels.Responses.UpdateEntityInfo
                {
                    EntityName = a.Entity.GetType().Name,
                    EntityId = EntityExtension.GetEntityPrimaryKeyValue(a.Entity),
                    ActionType = UpdateEntityActionTypeHelper.GetUpdateEntityActionTypeFromEntityState(a.State)
                }).ToList();
            }

            if (saveResult.Success)
            {
                response.Code = ApiResponseCode.Success.ToString();
            }
            else if (saveResult.DatabaseException != null)
            {
                response.Message = saveResult.DatabaseException.Message;
                response.Code = ApiResponseCode.DbError.ToString();
                response.Exception = saveResult.DatabaseException;
            }
            else
            {
                response.Message = saveResult.Message;
                response.Code = ApiResponseCode.ValidationError.ToString();
            }
        }


        public List<ViewModels.Responses.EntityInfo> GetEntityInfos()
        {
            return DbContext.GetEntityInfos().Values.Select(e => new ViewModels.Responses.EntityInfo(e)).ToList();
        }

        public ViewModels.Responses.EntityInfo GetEntityInfo(string entityName)
        {
            return new ViewModels.Responses.EntityInfo(DbContext.GetEntityInfo(entityName));
        }
    }


    public interface IEntityRight
    {

        public string EntityName { get; set; }

        public RightType GlobalRight { get; set; }

        public Func<object, RightType>? GetSpecificRightFunc { get; set; }


    }


    public class EntityRight<TEntity> : IEntityRight
    {

        public string EntityName { get; set; }

        public RightType GlobalRight { get; set; }

        public Func<object, RightType>? GetSpecificRightFunc { get; set; }


        public EntityRight(RightType right, Func<TEntity, RightType>? condition = null)
        {
            EntityName = typeof(TEntity).Name;
            GlobalRight = right;
            GetSpecificRightFunc = condition as Func<object, RightType>;
        }

        public EntityRight(Func<TEntity, RightType>? condition = null)
        {
            EntityName = typeof(TEntity).Name;
            GlobalRight = RightType.ReadWrite;
            if (condition != null)
            {
                GetSpecificRightFunc = (entity) =>
                {
                    return condition((TEntity)entity);
                };
            }
        }
    }

    public class EntityRight : IEntityRight
    {

        public string EntityName { get; set; }

        public RightType GlobalRight { get; set; }

        public Func<object, RightType>? GetSpecificRightFunc { get; set; }


        public EntityRight(string entityName, RightType right, Func<object, RightType>? condition = null)
        {
            EntityName = entityName;
            GlobalRight = right;
            GetSpecificRightFunc = condition;
        }

        public EntityRight(string entityName, Func<object, RightType>? condition = null)
        {
            EntityName = entityName;
            GetSpecificRightFunc = condition;
        }
    }




}
