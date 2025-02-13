using NextAdmin.Core;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLQueryBuilder
    {

        public NextAdminDbContext DbContext { get; protected set; }

        public EntityInfo MainEntityInfo { get; protected set; }

        protected Dictionary<string, EntityInfo> _entitiesInfos;

        protected Dictionary<string, string> _jointures = new Dictionary<string, string>();

        public SQLQueryBuilder(NextAdminDbContext dbContext, IEnumerable<EntityInfo> entitiesInfo, string mainEntityName)
        {
            DbContext = dbContext;
            _entitiesInfos = entitiesInfo.ToDictionary(e => e.EntityName);
            MainEntityInfo = entitiesInfo.FirstOrDefault(e => e.EntityName == mainEntityName);
        }

        public SQLQueryBuilder(SQLQueryBuilder query)
        {
            DbContext = query.DbContext;
            _entitiesInfos = query._entitiesInfos;
            _jointures = new Dictionary<string, string>(query._jointures);
            MainEntityInfo = query.MainEntityInfo;
        }

        public virtual SQLSelectQueryBuilder Select(params string[] columns)
        {
            var clone = new SQLSelectQueryBuilder(this);
            return clone.Select(columns);
        }

        public virtual SQLSelectCountQueryBuilder SelectCount(params string[] columns)
        {
            var clone = new SQLSelectCountQueryBuilder(this);
            return clone.Select(columns);
        }

        public virtual SQLSelectSumQueryBuilder SelectSum(params string[] columns)
        {
            var clone = new SQLSelectSumQueryBuilder(this);
            return clone.Select(columns);
        }

        public virtual SQLSelectMinQueryBuilder SelectMin(params string[] columns)
        {
            var clone = new SQLSelectMinQueryBuilder(this);
            return clone.Select(columns);
        }

        public virtual SQLSelectMaxQueryBuilder SelectMax(params string[] columns)
        {
            var clone = new SQLSelectMaxQueryBuilder(this);
            return clone.Select(columns);
        }

        public virtual SQLCreateTableQueryBuilder CreateTable()
        {
            return new SQLCreateTableQueryBuilder(this);
        }

        public virtual SQLCreateColumnQueryBuilder CreateColumn(string columnName)
        {
            return new SQLCreateColumnQueryBuilder(this, columnName);
        }

        public virtual SQLRenameColumnQueryBuilder RenameColumn(string previousName, string newColumnName)
        {
            return new SQLRenameColumnQueryBuilder(this, previousName, newColumnName);
        }

        public virtual SQLAddForeignKeyConstraintQueryBuilder AddForeignKey(string columnName)
        {
            return new SQLAddForeignKeyConstraintQueryBuilder(this, columnName);
        }


        public virtual SQLCreateIndexQueryBuilder CreateIndex(string indexName, params string[] columns)
        {
            return new SQLCreateIndexQueryBuilder(this, indexName, columns);
        }

        public virtual SQLDropIndexQueryBuilder DropIndex(string indexName)
        {
            return new SQLDropIndexQueryBuilder(this, indexName);
        }

        public virtual SQLDropColumnQueryBuilder DropColumn(string columnName)
        {
            return new SQLDropColumnQueryBuilder(this, columnName);
        }

        public virtual SQLInsertQueryBuilder Insert(params ColumnValue[] columnsValues)
        {
            var insertQuery = new SQLInsertQueryBuilder(this);
            if (columnsValues.Length > 0)
            {
                insertQuery = insertQuery.SetValues(columnsValues);
            }
            return insertQuery;
        }

        public virtual SQLUpdateQueryBuilder Update(object pkValue, params ColumnValue[] columnsValues)
        {
            var updateQUery = new SQLUpdateQueryBuilder(this, pkValue);
            if (columnsValues.Length > 0)
            {
                updateQUery = updateQUery.SetValues(columnsValues);
            }
            return updateQUery;
        }

        public virtual SQLUpdateQueryBuilder Update(params ColumnValue[] columnsValues)
        {
            var updateQUery = new SQLUpdateQueryBuilder(this);
            if (columnsValues.Length > 0)
            {
                updateQUery = updateQUery.SetValues(columnsValues);
            }
            return updateQUery;
        }

        public virtual SQLDeleteQueryBuilder Delete(object pkValue)
        {
            var deleteQuery = new SQLDeleteQueryBuilder(this, pkValue);
            return deleteQuery;
        }

        protected string ParseRelationPath(string path)
        {
            var relationParts = path.Split(".").ToList();

            string currentRelationName = null;
            var currentEntityInfo = MainEntityInfo;
            while (relationParts.Count > 0)
            {
                var relationPart = relationParts[0];
                var nextRelationName = currentRelationName == null ? relationPart : currentRelationName + "_" + relationPart;

                var relationForeignKeyMemberInfo = currentEntityInfo.MembersInfos.Select(e => e.Value).FirstOrDefault(e => e.ForeignEntityRelationName == relationPart);
                if (relationForeignKeyMemberInfo == null)
                {
                    return path;
                }
                var nextEntityInfo = _entitiesInfos[relationForeignKeyMemberInfo.ForeignEntityName];

                if (!_jointures.ContainsKey(nextRelationName))
                {
                    string join = "LEFT JOIN " + nextEntityInfo.EntityTableName + " as " + nextRelationName + " ON " + nextRelationName + "." + nextEntityInfo.GetPrimaryKeyName() + " = " + (currentRelationName != null ? currentRelationName : currentEntityInfo.EntityTableName) + "." + relationForeignKeyMemberInfo.MemberName;
                    _jointures.Add(nextRelationName, join);
                }
                currentRelationName = nextRelationName;
                currentEntityInfo = nextEntityInfo;
                relationParts.RemoveAt(0);
            }
            return currentRelationName;
        }

        protected string PerseQueryPart(string queryPart)
        {
            var delimiters = new char[] { ' ', ',', '(', ')', '<', '>', '=', '-', '!', '?', '@', '\n', '\r' };
            string outputQuery = "";
            foreach (string subQueryPart in queryPart.SplitWithDelimiters(delimiters))
            {
                if (subQueryPart.Contains("."))//composed path, so we get relation
                {
                    var pathWithColumnName = subQueryPart.Split(".");
                    string path = string.Join(".", pathWithColumnName.Take(pathWithColumnName.Length - 1));
                    string column = pathWithColumnName.LastOrDefault();
                    string compositeRelationName = ParseRelationPath(path);
                    outputQuery += subQueryPart.Replace(path + "." + column, compositeRelationName + "." + column);
                }
                else if (MainEntityInfo.MembersInfos.Select(e => e.Value).FirstOrDefault(e => e.IsQueryable && e.MemberName.ToLower() == subQueryPart.ToLower()) != null)////column name of main entity
                {
                    outputQuery += subQueryPart.Replace(subQueryPart, MainEntityInfo.EntityTableName + "." + subQueryPart);
                }
                else//various sql statement so simply add it
                {
                    outputQuery += subQueryPart;
                }
            }
            return outputQuery;
        }

        public virtual List<ColumnInfo> GetSchemaColumnInfos()
        {
            var result = DbContext.ExecuteRawSQL($"SELECT * FROM sqlite_master WHERE type = 'table' AND tbl_name = '{MainEntityInfo.EntityTableName}'").FirstOrDefault();
            if (result == null)
                return null;
            return result["sql"].ToString().ExtractTags("(", ")").FirstOrDefault().Split(',').Select(a =>
            {
                var columnInfos = a.Split(" ");
                string name = columnInfos[0].Replace("'", "");
                string type = columnInfos.Length > 1 ? columnInfos[1] : "";
                return new ColumnInfo { Name = name, Type = type };
            }).ToList();
        }

        public virtual bool CheckIfTableExist()
        {
            return GetSchemaColumnInfos() != null;
        }

        public virtual bool CheckIfIndexExist(string indexName)
        {
            return DbContext.ExecuteRawSQL($"SELECT * FROM sqlite_master WHERE type = 'index' AND name = '{indexName}' AND tbl_name = '{MainEntityInfo.EntityTableName}'").Count > 0;
        }

        public virtual bool CheckIfColumnExist(string columnName)
        {
            var columnInfos = GetSchemaColumnInfos();
            if (columnInfos == null)
                return false;
            return columnInfos.Any(a => a.Name == columnName);
        }

        public virtual void DropTable()
        {
            DbContext.ExecuteRawSQL("DROP TABLE " + MainEntityInfo.EntityTableName);
        }

    }


    public class ColumnInfo
    {

        public string Name { get; set; }

        public string Type { get; set; }
    }


    public class FormatedQuery
    {

        public string SQL { get; set; }

        public List<object> Parameters { get; set; }

        public FormatedQuery()
        {
            Parameters = new List<object>();
        }
    }

    public class ColumnValue
    {

        public string Column { get; set; }

        public object Value { get; set; }

        public ColumnValue(string column, object value)
        {
            Column = column;
            Value = value;
        }
    }
}
