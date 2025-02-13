using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLDropColumnQueryBuilder : SQLQueryBuilder
    {

        private string _columnName;

        public SQLDropColumnQueryBuilder(SQLQueryBuilder query, string columnName) : base(query)
        {
            _columnName = columnName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            result.SQL = "ALTER TABLE " + MainEntityInfo.EntityTableName + " DROP COLUMN " + _columnName;
            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }
    }
}
