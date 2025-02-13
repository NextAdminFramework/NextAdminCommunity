using System.Collections.Generic;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLDeleteQueryBuilder : SQLQueryBuilder
    {
        protected object _pkValue;

        public SQLDeleteQueryBuilder(SQLQueryBuilder query, object pkValue) : base(query)
        {
            _pkValue = pkValue;
        }

        public SQLDeleteQueryBuilder(SQLDeleteQueryBuilder query) : base(query)
        {
            _pkValue = query._pkValue;
        }

        public virtual FormatedQuery Build()
        {
            var result = new FormatedQuery();
            result.SQL = "DELETE FROM " + MainEntityInfo.EntityTableName + " WHERE " + MainEntityInfo.GetPrimaryKeyName() + " = @0";
            result.Parameters.Add(_pkValue);
            return result;
        }

        public virtual List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }

    }
}
