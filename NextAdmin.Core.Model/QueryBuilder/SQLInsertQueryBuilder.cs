using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLInsertQueryBuilder : SQLQueryBuilder
    {

        protected Dictionary<string, object> _columnValues = new Dictionary<string, object>();

        public SQLInsertQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public SQLInsertQueryBuilder(SQLInsertQueryBuilder query) : base(query)
        {
            _columnValues = new Dictionary<string, object>(query._columnValues);
        }

        public SQLInsertQueryBuilder SetValue(string column, object value)
        {
            var clone = new SQLInsertQueryBuilder(this);
            if (clone._columnValues.ContainsKey(column))
            {
                clone._columnValues[column] = value;
            }
            else
            {
                clone._columnValues.Add(column, value);
            }
            return clone;
        }

        public SQLInsertQueryBuilder SetValues(params ColumnValue[] columnsValues)
        {
            var clone = new SQLInsertQueryBuilder(this);
            foreach (var columnValue in columnsValues)
            {
                if (clone._columnValues.ContainsKey(columnValue.Column))
                {
                    clone._columnValues[columnValue.Column] = columnValue.Value;
                }
                else
                {
                    clone._columnValues.Add(columnValue.Column, columnValue.Value);
                }
            }
            return clone;
        }


        public virtual FormatedQuery Build()
        {
            var result = new FormatedQuery();
            int paramCount = 0;
            result.SQL = "INSERT INTO " + MainEntityInfo.EntityTableName + " (" + string.Join(",", _columnValues.Select(e => e.Key)) + ") VALUES (" + string.Join(",", _columnValues.Select(e => e.Value == null ? "NULL" : "@" + paramCount++)) + ")";
            result.Parameters = _columnValues.Where(e => e.Value != null).Select(e => e.Value).ToList();
            return result;
        }

        public virtual List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }

    }

}
