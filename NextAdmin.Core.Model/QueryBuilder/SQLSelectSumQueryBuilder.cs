using NextAdmin.Core;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLSelectSumQueryBuilder : SQLSelectQueryBuilder
    {
        public SQLSelectSumQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public SQLSelectSumQueryBuilder(SQLSelectQueryBuilder query) : base(query)
        {

        }

        public override SQLSelectSumQueryBuilder Select(params string[] columns)
        {
            return new SQLSelectSumQueryBuilder(base.Select(columns));
        }

        public override SQLSelectSumQueryBuilder OrderBy(params string[] columns)
        {
            return new SQLSelectSumQueryBuilder(base.OrderBy(columns));
        }


        public override SQLSelectSumQueryBuilder Where(string where, params object[] parameters)
        {
            return new SQLSelectSumQueryBuilder(base.Where(where, parameters));
        }


        public override SQLSelectSumQueryBuilder Skip(int value)
        {
            return new SQLSelectSumQueryBuilder(base.Skip(value));
        }


        public override SQLSelectSumQueryBuilder Take(int value)
        {
            return new SQLSelectSumQueryBuilder(base.Take(value));
        }

        public override FormatedQuery Build()
        {
            var query = base.Build();
            string selectStatement = query.SQL.ExtractTags("SELECT", "FROM").FirstOrDefault();
            query.SQL = query.SQL.Replace("SELECT" + selectStatement + "FROM", "SELECT SUM(" + selectStatement + ") FROM");
            return query;
        }
    }
}
