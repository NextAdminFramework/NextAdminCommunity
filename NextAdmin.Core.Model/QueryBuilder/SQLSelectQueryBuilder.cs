using NextAdmin.Core;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{

    public class SQLSelectQueryBuilder : SQLQueryBuilder
    {
        private List<string> _selectedColumns = new List<string>();

        private List<string> _orderByColumns = new List<string>();

        private List<string> _wheres = new List<string>();

        private List<object> _whereParameters = new List<object>();

        private int? _skip;

        private int? _take;

        private bool _distinct = false;


        public SQLSelectQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public SQLSelectQueryBuilder(SQLSelectQueryBuilder query) : base(query)
        {
            _selectedColumns = query._selectedColumns.ToList();
            _orderByColumns = query._orderByColumns.ToList();
            _wheres = query._wheres.ToList();
            _whereParameters = query._whereParameters.ToList();
            _take = query._take;
            _skip = query._skip;
        }

        public override SQLSelectQueryBuilder Select(params string[] columns)
        {
            var clone = new SQLSelectQueryBuilder(this);
            if (columns.Length > 0)
            {
                foreach (var column in columns)
                {
                    var selectParts = column.Replace(" AS ", " as ").Split(" as ");
                    if (selectParts.Length == 1)
                    {
                        clone._selectedColumns.Add(clone.PerseQueryPart(column));
                    }
                    else
                    {
                        clone._selectedColumns.Add(clone.PerseQueryPart(selectParts[0]) + " as " + selectParts[1]);
                    }
                }
            }
            else
            {
                clone._selectedColumns.Add(MainEntityInfo.EntityTableName + ".*");
            }
            return clone;
        }

        public virtual SQLSelectQueryBuilder Distinct()
        {
            var clone = new SQLSelectQueryBuilder(this);
            clone._distinct = true;
            return clone;
        }

        public virtual SQLSelectQueryBuilder OrderBy(params string[] columns)
        {
            var clone = new SQLSelectQueryBuilder(this);
            foreach (var column in columns)
            {
                clone._orderByColumns.Add(clone.PerseQueryPart(column));
            }
            return clone;
        }

        public virtual SQLSelectQueryBuilder Where(string where, params object[] parameters)
        {
            var clone = new SQLSelectQueryBuilder(this);

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

        public virtual SQLSelectQueryBuilder Skip(int value)
        {
            var clone = new SQLSelectQueryBuilder(this);
            clone._skip = value;
            return clone;
        }

        public virtual SQLSelectQueryBuilder Take(int value)
        {
            var clone = new SQLSelectQueryBuilder(this);
            clone._take = value;
            return clone;
        }

        public virtual FormatedQuery Build()
        {
            var result = new FormatedQuery();
            if (_selectedColumns.Count == 0)
            {
                _selectedColumns.Add("*");
            }
            result.SQL = "SELECT " + (_distinct ? "DISTINCT " : "") + string.Join(",", _selectedColumns) + " FROM " + MainEntityInfo.EntityTableName;

            if (_jointures.Count > 0)
            {
                foreach (var jointure in _jointures.Select(e => e.Value))
                {
                    result.SQL += " " + jointure;
                }
            }

            if (_wheres.Count > 0)
            {
                result.SQL += " WHERE (" + string.Join(") AND (", _wheres) + ")";
                result.Parameters.AddRange(_whereParameters);
            }
            if (_orderByColumns.Count > 0)
            {
                result.SQL += " ORDER BY " + string.Join(",", _orderByColumns);
            }
            if (_take.HasValue)
            {
                result.SQL += " LIMIT " + _take;
            }
            if (_skip.HasValue)
            {
                if (!_take.HasValue)
                {
                    result.SQL += " LIMIT -1";
                }
                result.SQL += " OFFSET " + _skip;
            }

            return result;
        }

        public List<Dictionary<string, object>> Execute()
        {
            var formatedQuery = Build();
            return DbContext.ExecuteRawSQL(formatedQuery.SQL, formatedQuery.Parameters.ToArray());
        }


        public List<TObject> ToList<TObject>()
        {
            var resultSet = Execute();
            return resultSet.Select(e => e.ToJSON().FromJSON<TObject>()).ToList();
        }

    }
}
