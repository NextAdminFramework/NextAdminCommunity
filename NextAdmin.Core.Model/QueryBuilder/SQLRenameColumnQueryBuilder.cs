using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLRenameColumnQueryBuilder : SQLQueryBuilder
    {
        private string _previousColumnName;

        private string _newColumnName;

        public SQLRenameColumnQueryBuilder(SQLQueryBuilder query, string previousColumnName, string newColumnName) : base(query)
        {
            _previousColumnName = previousColumnName;
            _newColumnName = newColumnName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            result.SQL = "ALTER TABLE '" + MainEntityInfo.EntityTableName + "' RENAME COLUMN '" + _previousColumnName + "' TO '" + _newColumnName + "'";
            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }
    }
}
