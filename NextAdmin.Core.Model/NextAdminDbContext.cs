using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.Model.QueryBuilder;
using NextAdmin.Core.Model.Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;

namespace NextAdmin.Core.Model
{
    public class NextAdminDbContext : DbContext
    {
        public NextAdminDbContextOptions Options { get; set; }

        public ResourcesEn Resources { get; set; }

        public IUser User { get; set; }

        public CultureInfo Culture { get; private set; }

        public Action<IEntity, EntityArgs> OnEntityCreated { get; set; }

        public Action<IEntity, EntityArgs> OnEntityLoaded { get; set; }

        public Action<IEntity, SavingArgs> OnEntitySaved { get; set; }

        public Action<IEntity, SavingArgs> OnEntityDeleted { get; set; }

        public Random Randomiser { get; set; }

        public Dictionary<string, object> Parameters { get; set; }

        public NextAdminDbContext()
        {
            Randomiser = new Random();
            Options = new NextAdminDbContextOptions();
            InitializeResources();
            ChangeTracker.Tracked += OnEntityTracked;
            Parameters = new Dictionary<string, object>();
        }


        public NextAdminDbContext(DbContextOptions dbContextOption)
          : base(dbContextOption)
        {
            Randomiser = new Random();
            Options = new NextAdminDbContextOptions();
            InitializeResources();
            ChangeTracker.Tracked += OnEntityTracked;
            Parameters = new Dictionary<string, object>();
        }

        public void Initialize(NextAdminDbContextOptions nextDbContextOptions)
        {
            Options = nextDbContextOptions;
            Culture = Options.Culture;
            User = nextDbContextOptions.User;
            if (User != null && !string.IsNullOrEmpty(User.Culture) && User.Culture != Options.Culture?.Name)
            {
                Culture = new CultureInfo(User.Culture);
            }
            if (Culture != null)
            {
                InitializeResources(Culture.Name.Substring(0, 2).ToLower());
            }
        }


        protected virtual void InitializeResources(string? languageCode = null)
        {
            switch (languageCode)
            {
                case "en":
                    Resources = new ResourcesEn();
                    break;
                case "fr":
                default:
                    Resources = new ResourcesFr();
                    break;
            }
        }


        private static Dictionary<string, Lock> _locksDictionary;
        public virtual Dictionary<string, Lock> GetLockDictionary()
        {
            if (_locksDictionary == null)
            {
                _locksDictionary = new Dictionary<string, Lock>();
            }
            return _locksDictionary;
        }

        public bool IsLocked(string lockId)
        {
            var locks = GetLockDictionary();
            lock (locks)
            {
                Lock _lock;
                if (!locks.TryGetValue(lockId, out _lock))
                {
                    return false;
                }
                if (_lock.ExpirationDate < DateTime.Now)
                {
                    locks.Remove(lockId);
                    return false;
                }
                return true;
            }
        }

        public Lock TryLock(string lockId, string lockKey = null, int? durationSecond = null)
        {
            var locks = GetLockDictionary();
            lock (locks)
            {
                Lock _lock;
                if (locks.TryGetValue(lockId, out _lock))
                {
                    if (_lock.ExpirationDate < DateTime.Now)
                    {
                        locks.Remove(lockId);
                        _lock = null;
                    }
                    else if (_lock.Key != lockKey)
                    {
                        return null;
                    }
                }
                if (_lock == null)
                {
                    _lock = new Lock(lockKey, durationSecond, User?.UserName);
                    locks.Set(lockId, _lock);
                }
                else
                {
                    _lock.Update(lockKey, durationSecond, User?.UserName);
                }
                return _lock;
            }
        }

        public bool TryUnlock(string lockId, string lockKey = null)
        {
            var locks = GetLockDictionary();
            lock (locks)
            {
                Lock _lock;
                if (!locks.TryGetValue(lockId, out _lock))
                {
                    return false;
                }
                if (_lock.Key != lockKey)
                {
                    return false;
                }
                locks.Remove(lockId);
                return true;
            }
        }

        public bool TryRemoveLock(Lock _lock)
        {
            var locks = GetLockDictionary();
            var removedItemCount = locks.RemoveValues(_lock);
            return removedItemCount > 0;
        }


        public Lock GetLock(string lockId)
        {
            var locks = GetLockDictionary();
            Lock _lock;
            locks.TryGetValue(lockId, out _lock);
            return _lock;
        }

        public virtual Lock TryLockEntity(string entityName, string entityId, string lockKey = null, int? durationSecond = null)
        {
            var lockId = entityName + "_" + entityId;
            return TryLock(lockId, lockKey, durationSecond);
        }

        public virtual Lock TryLockEntity(string entityName, object entity, string lockKey = null, int? durationSecond = null)
        {
            var lockId = GetEntityLockId(entityName, entity);
            if (string.IsNullOrEmpty(lockId))
            {
                return null;
            }
            return TryLock(lockId, lockKey, durationSecond);
        }

        public bool TryUnlockEntity(string entityName, string entityId, string lockKey = null)
        {
            return TryUnlock(GetEntityLockId(entityName, entityId), lockKey);
        }

        public Lock GetEntityLock(string entityName, object entity)
        {
            var lockId = GetEntityLockId(entityName, entity);
            if (string.IsNullOrEmpty(lockId))
            {
                return null;
            }
            return GetLock(lockId);
        }

        public Lock GetEntityLock(string entityName, string entityId)
        {
            var lockId = GetEntityLockId(entityName, entityId);
            if (string.IsNullOrEmpty(lockId))
            {
                return null;
            }
            return GetLock(lockId);
        }

        public virtual string GetEntityLockId(string entityName, string entityId)
        {
            return entityName + "_" + entityId;
        }

        public virtual string GetEntityLockId(string entityName, object entity)
        {
            if (entity is Entity)
            {
                var entityPrimaryKeyValue = ((Entity)entity).GetPrimaryKeyValue();
                if (entityPrimaryKeyValue != null)
                {
                    return GetEntityLockId(entityName, entityPrimaryKeyValue.ToString());
                }
            }
            return null;
        }


        private void OnEntityTracked(object sender, EntityTrackedEventArgs args)
        {
            if (!args.FromQuery)
                return;
            IEntity entity = args.Entry.Entity as IEntity;
            if (entity != null)
            {
                var entityArgs = new EntityArgs(this);
                entity.OnLoad(this, entityArgs);
                OnLoadEntity(entity, entityArgs);
            }
        }

        public virtual object GetEntity(string entityName, object entityId)
        {
            var set = Set(entityName);
            var entityType = set.ElementType;
            return GetEntity(entityType, entityId);
        }

        public virtual object GetEntity(System.Type entityType, object entityId)
        {
            var primaryKeyInfo = EntityExtension.GetEntityPrimaryKeyInfo(entityType);
            if (primaryKeyInfo == null)
            {
                throw new Exception("Unable to find primary key on this entity");
            }
            entityId = entityId.ConvertTo(primaryKeyInfo.PropertyType);
            return Find(entityType, entityId);
        }

        public virtual TEntity GetEntity<TEntity>(object entityId)
            where TEntity : class
        {
            return GetEntity(typeof(TEntity), entityId) as TEntity;
        }

        private Dictionary<string, IEntityType> _entityTypesDictionary = null;
        public virtual Dictionary<string, IEntityType> GetEntitiesTypesDictionary()
        {
            if (_entityTypesDictionary == null)
            {
                _entityTypesDictionary = new Dictionary<string, IEntityType>();
                foreach (IEntityType enityType in this.Model.GetEntityTypes())
                {
                    _entityTypesDictionary.Add(enityType.ClrType.Name, enityType);
                }
            }
            return _entityTypesDictionary;
        }


        public virtual IEntityType GetEntityTypeInfo(string entityName)
        {
            var entitiesTypesDictionary = GetEntitiesTypesDictionary();
            IEntityType entityInfo = null;
            if (!entitiesTypesDictionary.TryGetValue(entityName, out entityInfo))
            {
                return null;
            }
            return entityInfo;
        }

        public virtual IEntityType GetEntityTypeInfo(System.Type entityType)
        {
            return GetEntityTypeInfo(entityType.Name);
        }


        public virtual IEntityType GetEntityTypeInfo<TEntity>()
        {
            return GetEntityTypeInfo(typeof(TEntity).Name);
        }


        private Dictionary<string, IQueryable> _dbSetDictionary = null;

        public virtual IQueryable Set(string entityName)
        {
            var dbSets = Sets();
            IQueryable dbSet = null;
            if (!dbSets.TryGetValue(entityName, out dbSet))
            {
                if (!dbSets.TryGetValue(entityName.FirstCharToUpper(), out dbSet))//try find set in litle indian
                {
                    return null;
                }
            }
            return dbSet;
        }

        public virtual Dictionary<string, IQueryable> Sets()
        {
            if (_dbSetDictionary == null)
            {
                _dbSetDictionary = new Dictionary<string, IQueryable>();
                System.Type type = this.GetType();
                PropertyInfo[] properties = type.GetProperties();
                foreach (PropertyInfo propertyInfo in properties)
                {
                    string propertyName = propertyInfo.PropertyType.FullName;
                    if (!propertyName.Contains("Microsoft.EntityFrameworkCore.DbSet`1[["))
                        continue;
                    var queribale = propertyInfo.GetValue(this) as IQueryable;
                    string name = queribale.ElementType.Name;
                    _dbSetDictionary.Add(name, queribale);
                }
            }
            return _dbSetDictionary;
        }

        public virtual IQueryable Set(System.Type entityType)
        {
            return this.Set(entityType.Name);
        }


        public virtual object CreateEntity(System.Type entityType, bool init = true, bool attach = false)
        {
            return CreateEntity(entityType.Name, init, attach);
        }


        public TEntity CreateEntity<TEntity>(bool init = true, bool attach = false)
          where TEntity : class
        {
            return CreateEntity(typeof(TEntity).Name, init, attach) as TEntity;
        }


        public virtual object CreateEntity(string entityName, bool init = true, bool attach = false)
        {
            var set = this.Set(entityName);
            if (set == null)
                return null;
            var entityType = this.Set(entityName).ElementType;
            var entity = Activator.CreateInstance(entityType);
            if (attach)
                Add(entity);
            if (init && entity is IEntity)
            {
                var args = new EntityArgs(this);
                ((IEntity)entity).OnCreate(this, new EntityArgs(this));
                OnCreateEntity((IEntity)entity, args);
            }
            return entity;
        }


        public virtual void AddEntity(object entity)
        {
            this.Add(entity);
        }

        public virtual void DeleteEntity(object entity)
        {
            this.Remove(entity);
        }

        public virtual void DetachEntity(object entity)
        {
            this.Entry(entity).State = EntityState.Detached;
        }

        public SaveResult ValidateAndSave()
        {
            var saveResult = new SaveResult();
            bool hasInitTransaction = false;
            if (Database.CurrentTransaction == null)
            {
                hasInitTransaction = true;
                Database.BeginTransaction();
            }
            try
            {
                var preparResult = ValidateEntities();
                saveResult = preparResult.CopyTo(saveResult);
                if (!saveResult.Success)
                {
                    if (hasInitTransaction && Database.CurrentTransaction != null)
                    {
                        Database.RollbackTransaction();
                    }
                    return saveResult;
                }
                base.SaveChanges();
                if (hasInitTransaction)
                {
                    Database.CommitTransaction();
                }
                foreach (var entityInfo in saveResult.EntityUpdatedInfos)
                {
                    var entity = entityInfo.Entity as Entity;
                    if (entity != null)
                    {
                        entity.OnAfterSave(this, entityInfo.State);
                    }
                }
            }
            catch (DbUpdateException exception)
            {
                if (hasInitTransaction && Database.CurrentTransaction != null)
                {
                    Database.RollbackTransaction();
                }
                saveResult.DatabaseException = exception;
                saveResult.Message = "Database errors";
            }
            catch
            {
                if (hasInitTransaction && Database.CurrentTransaction != null)
                {
                    Database.RollbackTransaction();
                }
                throw;
            }
            return saveResult;
        }



        public ValidationResult ValidateEntities()
        {
            var preparSaveResult = new ValidationResult();
            preparSaveResult.EntityValidationInfos = new List<EntityValidationInfo>();
            _entitiesPrimaryKeyIncrementValues = new Dictionary<string, long>();
            Dictionary<IEntity, EntityState> _entityHandled = new Dictionary<IEntity, EntityState>();
            while (true)
            {
                int entityCount = 0;

                var entries = ChangeTracker.Entries()
                    .Where(e => e.State != EntityState.Detached).OrderByDescending(e => e.State)
                    .OrderBy(a => a.Entity is Entity ? ((Entity)a.Entity).SaveOrder : 0)
                    .ToList();
                foreach (EntityEntry entry in entries)
                {
                    IEntity entity = entry.Entity as IEntity;
                    if (entity != null && !_entityHandled.ContainsKey(entity))
                    {
                        var entityId = EntityExtension.GetEntityPrimaryKeyValue(entry.Entity);
                        _entityHandled.Add(entity, entry.State);
                        SavingArgs args = new SavingArgs(this, entry, preparSaveResult);
                        if (entry.State != EntityState.Detached)
                        {
                            if (entry.State == EntityState.Deleted)
                            {
                                entity.OnDelete(this, args);
                                OnDeleteEntity(entity, args);
                            }
                            else
                            {
                                entity.OnSave(this, args);
                                OnSaveEntity(entity, args);
                            }
                        }
                        if (args.Errors.Count > 0 || args.Warnings.Count > 0)
                        {
                            preparSaveResult.EntityValidationInfos.Add(new EntityValidationInfo(entityId, entry.Entity.GetType().Name, args.Errors, args.Warnings));
                        }
                    }
                    entityCount++;
                }
                if (ChangeTracker.Entries().Where(e => e.State != EntityState.Detached).Count() == entityCount)
                    break;
            }

            //Last secure
            var entries2 = ChangeTracker.Entries().Where(e => e.State != EntityState.Detached)//order and group by state to be sure that deleted entities are treated at the end
                .OrderByDescending(e => e.State).GroupBy(a => a.State).ToList();
            foreach (var groupedEntries in entries2)
            {
                foreach (EntityEntry entry in groupedEntries.OrderBy(a => a.Entity is Entity ? ((Entity)a.Entity).SaveOrder : 0))
                {
                    IEntity entity = entry.Entity as IEntity;
                    if (entity != null)
                    {
                        SavingArgs args = new SavingArgs(this, entry, preparSaveResult);
                        if (entry.State == EntityState.Deleted)
                        {
                            entity.OnEndDelete(this, args);
                            OnEndDeleteEntity(entity, args);
                        }
                        else
                        {
                            entity.OnEndSave(this, args);
                            OnEndSaveEntity(entity, args);
                        }
                        if (args.Errors.Count > 0 || args.Warnings.Count > 0)
                        {
                            var entityId = EntityExtension.GetEntityPrimaryKeyValue(entry.Entity);
                            preparSaveResult.EntityValidationInfos.Add(new EntityValidationInfo(entityId, entry.Entity.GetType().Name, args.Errors, args.Warnings));
                        }
                    }
                }
            }

            List<EntityUpdatedInfo> entityUpdateds = ChangeTracker.Entries().Where(e => e.State != EntityState.Detached).Select(e => new EntityUpdatedInfo(e.Entity, e.State)).ToList();
            preparSaveResult.EntityUpdatedInfos = entityUpdateds;

            if (!preparSaveResult.Success)
            {
                preparSaveResult.Message = "Validation errors";
                return preparSaveResult;
            }

            foreach (EntityUpdatedInfo entityInfo in entityUpdateds)
            {
                IEntity entity = entityInfo.Entity as IEntity;
                if (entity == null)
                    continue;
                var entry = Entry(entityInfo.Entity);
                //execute EF validation
                var entityFrameworkValidationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
                var vc = new ValidationContext(entry.Entity, null, null);
                if (entry.State != EntityState.Deleted)
                {
                    if (!Validator.TryValidateObject(entry.Entity, vc, entityFrameworkValidationResults, true))
                    {
                        List<EntityMemberValidationInfo> entityMembersValidationErrors = new List<EntityMemberValidationInfo>();
                        foreach (var validationResult in entityFrameworkValidationResults)
                        {
                            entityMembersValidationErrors.AddRange(GetValidationErrorsFromEFValidationError(validationResult));
                        }
                        var entityId = EntityExtension.GetEntityPrimaryKeyValue(entry.Entity);
                        preparSaveResult.EntityValidationInfos.Add(new EntityValidationInfo(entityId, entry.Entity.GetType().Name, entityMembersValidationErrors));
                        preparSaveResult.Message = "Entity Framework validation errors";
                    }
                }
            }
            return preparSaveResult;
        }

        protected virtual void OnCreateEntity(IEntity entity, EntityArgs args)
        {
            if (OnEntityCreated != null)
            {
                OnEntityCreated(entity, args);
            }
        }

        protected virtual void OnLoadEntity(IEntity entity, EntityArgs args)
        {
            if (OnEntityLoaded != null)
            {
                OnEntityLoaded(entity, args);
            }
        }

        protected virtual void OnSaveEntity(IEntity entity, SavingArgs args)
        {
            if (OnEntitySaved != null)
            {
                OnEntitySaved(entity, args);
            }
        }

        protected virtual void OnEndSaveEntity(IEntity entity, SavingArgs args)
        {

        }

        protected virtual void OnEndDeleteEntity(IEntity entity, SavingArgs args)
        {

        }

        protected virtual void OnDeleteEntity(IEntity entity, SavingArgs args)
        {
            if (OnEntityDeleted != null)
            {
                OnEntityDeleted(entity, args);
            }
        }

        protected List<EntityMemberValidationInfo> GetValidationErrorsFromEFValidationError(System.ComponentModel.DataAnnotations.ValidationResult error)
        {
            var errors = new List<EntityMemberValidationInfo>();
            foreach (string memberName in error.MemberNames)
            {
                var validationError = new EntityMemberValidationInfo();
                if (error.ErrorMessage.Contains("field is required"))
                {
                    validationError.Code = ValidationErrorCode.RequiredField.ToString();
                    validationError.Message = Resources.Error_RequiredField;
                    validationError.MemberName = memberName;
                }
                errors.Add(validationError);
            }
            return errors;
        }


        private Dictionary<string, long> _entitiesPrimaryKeyIncrementValues = new Dictionary<string, long>();
        public virtual long GetNextPrimaryKeyIncrementValue(System.Type entityType)
        {
            return GetNextPrimaryKeyIncrementValue(entityType.Name);
        }


        public virtual long GetNextPrimaryKeyIncrementValue(string entityName)
        {
            var entityInfo = this.GetEntityInfo(entityName);
            if (!_entitiesPrimaryKeyIncrementValues.ContainsKey(entityInfo.EntityTableName))
            {
                long entityPk = 0;
                string primaryKeyName = entityInfo.GetPrimaryKeyName();

                var lastEntity = SQLQuery(entityInfo.EntityName).Select(primaryKeyName).OrderBy(primaryKeyName + " DESC").Take(1).Execute().FirstOrDefault();
                if (lastEntity != null)
                {
                    var pkStringValue = lastEntity[primaryKeyName].ToString();
                    if (!string.IsNullOrEmpty(pkStringValue))
                    {
                        entityPk = System.Convert.ToInt64(pkStringValue);
                    }
                }
                _entitiesPrimaryKeyIncrementValues[entityInfo.EntityTableName] = entityPk;
            }
            return _entitiesPrimaryKeyIncrementValues[entityInfo.EntityTableName] = _entitiesPrimaryKeyIncrementValues[entityInfo.EntityTableName] + 1;
        }


        public virtual List<Dictionary<string, object>> ExecuteRawSQL(string sqlQuery, Dictionary<string, object> parameters)
        {
            var resultSet = new List<Dictionary<string, object>>();
            using (var cmd = this.Database.GetDbConnection().CreateCommand())
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }

                if (parameters != null)
                {
                    foreach (KeyValuePair<string, object> param in parameters)
                    {
                        if (param.Value is object[])
                        {
                            var arrayObjects = param.Value as object[];
                            if (arrayObjects.Length > 0)
                            {
                                List<string> newParamNames = new List<string>(); ;
                                foreach (var value in arrayObjects)
                                {
                                    DbParameter dbParameter = cmd.CreateParameter();
                                    dbParameter.ParameterName = "@" + Guid.NewGuid().ToString().Replace("-", "");
                                    dbParameter.Value = value;
                                    cmd.Parameters.Add(dbParameter);
                                    newParamNames.Add(dbParameter.ParameterName);
                                }
                                sqlQuery = sqlQuery.Replace(param.Key, string.Join(',', newParamNames));
                            }
                            else
                            {
                                DbParameter dbParameter = cmd.CreateParameter();
                                dbParameter.ParameterName = param.Key;
                                dbParameter.Value = DBNull.Value;
                                cmd.Parameters.Add(dbParameter);
                            }
                        }
                        else
                        {
                            DbParameter dbParameter = cmd.CreateParameter();
                            dbParameter.ParameterName = param.Key;
                            dbParameter.Value = param.Value ?? DBNull.Value;
                            cmd.Parameters.Add(dbParameter);
                        }
                    }
                }
                cmd.CommandText = sqlQuery;
                using (var dataReader = cmd.ExecuteReader())
                {
                    while (dataReader.Read())
                    {
                        var dataDictionary = new Dictionary<string, object>();
                        for (var noField = 0; noField < dataReader.FieldCount; noField++)
                        {
                            var fieldName = dataReader.GetName(noField);
                            var fieldValue = dataReader[noField];
                            dataDictionary.TryAdd(fieldName, fieldValue);
                        }
                        if (dataDictionary.Count > 0)
                        {
                            resultSet.Add(dataDictionary);
                        }
                    }
                }
            }
            return resultSet;
        }
        public virtual List<Dictionary<string, object>> ExecuteRawSQL(string sqlQuery, params object[] parameters)
        {
            Dictionary<string, object> parametersDictionary = new Dictionary<string, object>();
            int i = 0;
            foreach (var param in parameters)
            {
                parametersDictionary.Add("@" + i, param);
                i++;
            }
            return ExecuteRawSQL(sqlQuery, parametersDictionary);
        }


        public virtual SQLQueryBuilder SQLQuery(string entityName, params EntityInfo[] additionalEntitiesInfos)
        {
            var entitiesInfo = GetEntityInfos().Values.ToList();
            if (additionalEntitiesInfos != null)
            {
                foreach (var additionalEntityInfo in additionalEntitiesInfos)
                {
                    var existingEntityInfo = entitiesInfo.FirstOrDefault(e => e.EntityName == additionalEntityInfo.EntityName);
                    if (existingEntityInfo != null)
                    {
                        entitiesInfo.Remove(existingEntityInfo);
                    }
                    entitiesInfo.Add(additionalEntityInfo);
                }
            }
            return new SQLQueryBuilder(this, entitiesInfo, entityName);
        }

        public virtual SQLQueryBuilder SQLQuery(Type entityType, params EntityInfo[] additionalEntitiesInfos)
        {
            return SQLQuery(entityType.Name, additionalEntitiesInfos);
        }

        public virtual SQLQueryBuilder SQLQuery<TEntity>(params EntityInfo[] additionalEntitiesInfos)
        {
            return SQLQuery(typeof(TEntity), additionalEntitiesInfos);
        }

        protected Dictionary<string, EntityInfo> _entityInfos = null;
        public virtual Dictionary<string, EntityInfo> GetEntityInfos()
        {
            if (_entityInfos == null)
            {
                _entityInfos = new Dictionary<string, EntityInfo>();
                foreach (var keyValue in Sets())
                {
                    _entityInfos.Add(keyValue.Key, EntityExtension.GetEntityInfo(keyValue.Value.ElementType, this));
                }
            }
            return _entityInfos;
        }

        public virtual void ClearEntityInfos()
        {
            _entityInfos = null;
        }

        public virtual EntityInfo GetEntityInfo(string entityName)
        {
            EntityInfo entityInfo = null;
            if (GetEntityInfos().TryGetValue(entityName, out entityInfo))
            {
                return entityInfo;
            }
            return null;
        }


        public virtual List<TEntity> GetTrackedEntities<TEntity>(params EntityState[] states)
        {
            return ChangeTracker.Entries().Where(e => e.State != EntityState.Detached && (states == null || states.Length == 0 || states.Contains(e.State)) && e.Entity is TEntity)
                .Select(e => e.Entity).Cast<TEntity>().ToList();
        }

        public virtual List<TEntity> GetEntities<TEntity>(Func<IQueryable<TEntity>, IQueryable<TEntity>> filter = null)
            where TEntity : class
        {
            List<TEntity> serilizedEntities = (filter == null ? Set<TEntity>() : filter(Set<TEntity>())).ToList().Where(e => Entry(e).State != EntityState.Deleted).ToList();
            var addingsEntities = (filter == null ? GetTrackedEntities<TEntity>() : filter(GetTrackedEntities<TEntity>().AsQueryable()).ToList()).Where(e => Entry(e).State != EntityState.Deleted).ToList();
            serilizedEntities.AddRange(addingsEntities);
            serilizedEntities = serilizedEntities.Distinct().ToList();
            return serilizedEntities;
        }

        public void DetachAllEntities()
        {
            ChangeTracker.Clear();
        }

        private bool _isDisposed = false;
        public override void Dispose()
        {
            if (!_isDisposed)
            {
                try
                {
                    ChangeTracker.Tracked -= OnEntityTracked;
                }
                catch
                {

                }
            }
            _isDisposed = true;
            base.Dispose();
        }

    }





    public class EntitiesUpdateArgs : EventArgs
    {

        public List<EntityUpdatedInfo> EntityUpdatedInfos { get; set; }

    }

    public class EntityUpdatedInfo
    {

        public EntityUpdatedInfo(object entity, EntityState state)
        {
            Entity = entity;
            State = state;
        }

        public object Entity { get; set; }

        public EntityState State { get; set; }
    }


    public class ValidationResult
    {
        public virtual bool Success
        {
            get
            {
                return ErrorCount == 0;
            }
        }

        public virtual int ErrorCount
        {
            get
            {
                return EntityValidationInfos.Where(e => e.Errors.Count() > 0).Count();
            }
        }

        public string Message { get; set; }

        public int EntityAffectedCount
        {
            get
            {
                return EntityUpdatedInfos.Count;
            }
        }

        public List<EntityValidationInfo> EntityValidationInfos { get; set; }

        public List<EntityUpdatedInfo> EntityUpdatedInfos { get; set; }


        public ValidationResult()
        {
            EntityValidationInfos = new List<EntityValidationInfo>();
            EntityUpdatedInfos = new List<EntityUpdatedInfo>();
        }
    }


    public class NextAdminDbContextOptions
    {
        public CultureInfo Culture { get; private set; }

        public IConfiguration AppConfig { get; protected set; }

        public IUser User { get; protected set; }

        public NextAdminDbContextOptions(IConfiguration appConfig = null, CultureInfo cultureInfo = null, IUser user = null)
        {
            AppConfig = appConfig;
            Culture = cultureInfo;
            User = user;
        }
    }


    public class SaveResult : ValidationResult
    {

        public override bool Success
        {
            get
            {
                return DatabaseException == null && ErrorCount == 0;
            }
        }

        public DbUpdateException DatabaseException { get; set; }

    }



    public class EntityValidationInfo
    {
        public string EntityName { get; set; }

        public object EntityId { get; set; }

        public List<EntityMemberValidationInfo> Errors { get; set; }

        public List<EntityMemberValidationInfo> Warning { get; set; }

        public EntityValidationInfo()
        {
        }

        public EntityValidationInfo(object entityId, string entityName, List<EntityMemberValidationInfo> errors = null, List<EntityMemberValidationInfo> warnings = null)
        {
            if (errors == null)
            {
                errors = new List<EntityMemberValidationInfo>();
            }
            if (warnings == null)
            {
                warnings = new List<EntityMemberValidationInfo>();
            }
            EntityId = entityId;
            EntityName = entityName;
            Errors = errors;
            Warning = warnings;
        }


    }

    public class EntityMemberValidationInfo
    {
        public string Message { get; set; }

        public string Code { get; set; }

        public string MemberName { get; set; }




        public EntityMemberValidationInfo(string memberName, string errorMessage, string code = null)
        {
            Message = errorMessage;
            MemberName = memberName;
            Code = code;
        }

        public EntityMemberValidationInfo(string errorMessage)
        {
            Message = errorMessage;
        }

        public EntityMemberValidationInfo()
        {


        }


    }



    public class EntityArgs
    {
        public NextAdminDbContext DbContext { get; set; }


        internal EntityArgs(NextAdminDbContext dbContext)
        {
            DbContext = dbContext;
        }
    }


    public enum ValidationErrorCode
    {
        RequiredField


    }



    public class SavingArgs : EntityArgs
    {

        public EntityEntry Entry { get; set; }

        public List<EntityMemberValidationInfo> Errors { get; private set; }

        public List<EntityMemberValidationInfo> Warnings { get; private set; }

        public ValidationResult ValidationResult { get; set; }

        internal SavingArgs(NextAdminDbContext dbContext, EntityEntry entry, ValidationResult validationResult)
          : base(dbContext)
        {
            Entry = entry;
            Errors = new List<EntityMemberValidationInfo>();
            Warnings = new List<EntityMemberValidationInfo>();
            ValidationResult = validationResult;
        }


        public EntityMemberValidationInfo AddError(string memberName, string message, string code = null)
        {
            var error = new EntityMemberValidationInfo(memberName, message, code);
            Errors.Add(error);
            return error;
        }
        public EntityMemberValidationInfo AddError(string message)
        {
            var error = new EntityMemberValidationInfo(message);
            Errors.Add(error);
            return error;
        }

        public EntityMemberValidationInfo AddWarning(string memberName, string message, string code = null)
        {
            var warning = new EntityMemberValidationInfo(memberName, message, code);
            Warnings.Add(warning);
            return warning;
        }
        public EntityMemberValidationInfo AddWarning(string message, string code = null)
        {
            var warning = new EntityMemberValidationInfo(message, code);
            Warnings.Add(warning);
            return warning;
        }


    }


}
