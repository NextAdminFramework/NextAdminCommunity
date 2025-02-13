using NextAdmin.Core;
using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLCreateColumnQueryBuilder : SQLQueryBuilder
    {

        private string _columnName;

        public SQLCreateColumnQueryBuilder(SQLQueryBuilder query, string columnName) : base(query)
        {
            _columnName = columnName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            var memberInfo = MainEntityInfo.MembersInfos[_columnName];
            result.SQL = "ALTER TABLE " + MainEntityInfo.EntityTableName + " ADD " + memberInfo.MemberName + " " + memberInfo.MemberType.GetSQLName() + (memberInfo.IsPrimaryKey ? " PRIMARY KEY" : "") + " NULL";

            if (MainEntityInfo.MembersInfos.ContainsKey(_columnName))
            {
                var columnToAddMemberInfo = MainEntityInfo.MembersInfos[_columnName];
                if (columnToAddMemberInfo.ForeignEntityName != null && _entitiesInfos.ContainsKey(columnToAddMemberInfo.ForeignEntityName))
                {
                    var foreignEntityInfo = _entitiesInfos[columnToAddMemberInfo.ForeignEntityName];
                    result.SQL += " REFERENCES " + foreignEntityInfo.EntityTableName + "(" + foreignEntityInfo.GetPrimaryKeyName() + ")";
                }
            }

            return result;
        }

        public string GetMemberDefaultValue(EntityMemberInfo memberInfo)
        {
            switch (memberInfo.GetType().GetSQLName())
            {
                case "BOOLEAN":
                case "DOUBLE":
                case "INT":
                    return "0";
                case "DATETIME":
                    return "'1970-01-01'";
                default:
                    return "''";
            }
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }
    }
}
