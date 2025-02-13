using NextAdmin.Core;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{

    public class SQLUpdateQueryBuilder : SQLQueryBuilder
    {
        protected Dictionary<string, object> _columnValues = new Dictionary<string, object>();

        private List<string> _wheres = new List<string>();

        private List<object> _whereParameters = new List<object>();

        protected object _pkValue;

        public SQLUpdateQueryBuilder(SQLQueryBuilder query, object pkValue = null) : base(query)
        {
            _pkValue = pkValue;
        }

        public SQLUpdateQueryBuilder(SQLUpdateQueryBuilder query) : base(query)
        {
            _pkValue = query._pkValue;
            _columnValues = new Dictionary<string, object>(query._columnValues);
            _wheres = query._wheres.ToList();
            _whereParameters = query._whereParameters.ToList();
        }

        public SQLUpdateQueryBuilder Where(string where, params object[] parameters)
        {
            var clone = new SQLUpdateQueryBuilder(this);

            int paramsCount = _whereParameters.Count;
            while (where.Contains("?"))
            {
                where = where.ReplaceFirst("?", "@" + paramsCount);
                paramsCount++;
            }
            clone._wheres.Add(clone.PerseQueryPart(where));
            clone._whereParameters.AddRange(parameters);
            return clone;
        }

        public SQLUpdateQueryBuilder SetValue(string column, object value)
        {
            var clone = new SQLUpdateQueryBuilder(this);
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

        public SQLUpdateQueryBuilder SetValues(params ColumnValue[] columnsValues)
        {
            var clone = new SQLUpdateQueryBuilder(this);
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
            result.SQL = "UPDATE '" + MainEntityInfo.EntityTableName + "' SET " + string.Join(",", _columnValues.Select(e => "'" + e.Key + "'" + " = " + (e.Value == null ? "NULL" : "@" + paramCount++)));
            result.Parameters = _columnValues.Where(e => e.Value != null).Select(e => e.Value).ToList();
            if (_pkValue != null)
            {
                result.SQL += " WHERE " + MainEntityInfo.GetPrimaryKeyName() + " = @" + paramCount++;
                result.Parameters.Add(_pkValue);
            }
            else if (_wheres.Count > 0)
            {
                result.SQL += " WHERE (" + string.Join(") AND (", _wheres) + ")";
                result.Parameters.AddRange(_whereParameters);
            }
            return result;
        }

        public virtual List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }

    }
}
