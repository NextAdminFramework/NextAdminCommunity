using NextAdmin.Core;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLSelectMaxQueryBuilder : SQLSelectQueryBuilder
    {



        public SQLSelectMaxQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public SQLSelectMaxQueryBuilder(SQLSelectQueryBuilder query) : base(query)
        {

        }

        public override SQLSelectMaxQueryBuilder Select(params string[] columns)
        {
            return new SQLSelectMaxQueryBuilder(base.Select(columns));
        }

        public override SQLSelectMaxQueryBuilder OrderBy(params string[] columns)
        {
            return new SQLSelectMaxQueryBuilder(base.OrderBy(columns));
        }


        public override SQLSelectMaxQueryBuilder Where(string where, params object[] parameters)
        {
            return new SQLSelectMaxQueryBuilder(base.Where(where, parameters));
        }


        public override SQLSelectMaxQueryBuilder Skip(int value)
        {
            return new SQLSelectMaxQueryBuilder(base.Skip(value));
        }

        public override SQLSelectMaxQueryBuilder Take(int value)
        {
            return new SQLSelectMaxQueryBuilder(base.Take(value));
        }

        public override FormatedQuery Build()
        {
            var query = base.Build();
            string selectStatement = query.SQL.ExtractTags("SELECT", "FROM").FirstOrDefault();
            query.SQL = query.SQL.Replace("SELECT" + selectStatement + "FROM", "SELECT MAX(" + selectStatement + ") FROM");
            return query;
        }
    }
}
