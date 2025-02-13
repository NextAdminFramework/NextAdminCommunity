using NextAdmin.Core;
using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLSelectMinQueryBuilder : SQLSelectQueryBuilder
    {
        public SQLSelectMinQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public SQLSelectMinQueryBuilder(SQLSelectQueryBuilder query) : base(query)
        {

        }

        public override SQLSelectMinQueryBuilder Select(params string[] columns)
        {
            return new SQLSelectMinQueryBuilder(base.Select(columns));
        }

        public override SQLSelectMinQueryBuilder OrderBy(params string[] columns)
        {
            return new SQLSelectMinQueryBuilder(base.OrderBy(columns));
        }


        public override SQLSelectMinQueryBuilder Where(string where, params object[] parameters)
        {
            return new SQLSelectMinQueryBuilder(base.Where(where, parameters));
        }


        public override SQLSelectMinQueryBuilder Skip(int value)
        {
            return new SQLSelectMinQueryBuilder(base.Skip(value));
        }

        public override SQLSelectMinQueryBuilder Take(int value)
        {
            return new SQLSelectMinQueryBuilder(base.Take(value));
        }

        public override FormatedQuery Build()
        {
            var query = base.Build();
            string selectStatement = query.SQL.ExtractTags("SELECT", "FROM").FirstOrDefault();
            query.SQL = query.SQL.Replace("SELECT" + selectStatement + "FROM", "SELECT MIN(" + selectStatement + ") FROM");
            return query;
        }
    }
}
