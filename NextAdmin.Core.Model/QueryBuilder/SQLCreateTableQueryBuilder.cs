using NextAdmin.Core;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLCreateTableQueryBuilder : SQLQueryBuilder
    {

        public SQLCreateTableQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();

            result.SQL = "CREATE TABLE '" + MainEntityInfo.EntityTableName + "'(";
            result.SQL += string.Join(",", MainEntityInfo.MembersInfos.Values.Select(e =>
            {
                return "'" + e.MemberName + "' " + e.MemberType.GetSQLName() + (e.IsPrimaryKey ? " PRIMARY KEY" : "") + " NULL";
            }));
            var realations = string.Join(",", MainEntityInfo.MembersInfos.Values.Where(e => e.ForeignEntityName != null).Select(e =>
            {
                var foreignEntityInfo = _entitiesInfos[e.ForeignEntityName];
                /* Add constraint only if it's primary key custom fields entity linked to real entity*/
                return (e.IsPrimaryKey ? ("CONSTRAINT FK_" + MainEntityInfo.EntityTableName + "_" + foreignEntityInfo.EntityTableName + "_" + e.MemberName) : "") + " FOREIGN KEY ('" + e.MemberName + "') REFERENCES '" + foreignEntityInfo.EntityTableName + "'('" + foreignEntityInfo.GetPrimaryKeyName() + "')" + (e.IsRequired ? " ON DELETE RESTRICT" : "");
            }));
            if (!string.IsNullOrEmpty(realations))
            {
                result.SQL += ", " + realations;
            }

            result.SQL += ")";

            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }

    }
}
