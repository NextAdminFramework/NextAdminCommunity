using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLDropIndexQueryBuilder : SQLQueryBuilder
    {

        private string _indexName;

        public SQLDropIndexQueryBuilder(SQLQueryBuilder query, string indexName) : base(query)
        {
            _indexName = indexName;
        }

        public FormatedQuery Build()
        {
            var result = new FormatedQuery();
            result.SQL = "DROP INDEX " + _indexName;
            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }
    }
}
