using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLAddForeignKeyConstraintQueryBuilder : SQLQueryBuilder
    {

        private string _columnName;

        public SQLAddForeignKeyConstraintQueryBuilder(SQLQueryBuilder query, string columnName) : base(query)
        {
            _columnName = columnName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            var memberInfo = MainEntityInfo.MembersInfos[_columnName];
            //memberInfo.ForeignEntityName
            var foreignEntityInfo = _entitiesInfos[memberInfo.ForeignEntityName];
            result.SQL = "ALTER TABLE " + MainEntityInfo.EntityTableName + " ADD FOREIGN KEY(" + memberInfo.MemberName + ") REFERENCES " + foreignEntityInfo.EntityTableName + "(" + foreignEntityInfo.GetPrimaryKeyName() + ")";
            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }
    }
}
