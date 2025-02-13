using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLCreateIndexQueryBuilder : SQLQueryBuilder
    {
        private string[] _columnNames;

        private string _indexName;

        public SQLCreateIndexQueryBuilder(SQLQueryBuilder query, string indexName, params string[] columnNames) : base(query)
        {
            _columnNames = columnNames;
            _indexName = indexName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            result.SQL = "CREATE INDEX " + _indexName + " ON " + MainEntityInfo.EntityTableName + " (" + string.Join(',', _columnNames) + ")";
            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }

    }
}
