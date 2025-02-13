using System.Linq;

namespace NextAdmin.Core.Model.QueryBuilder
{
    public class SQLSelectCountQueryBuilder : SQLSelectQueryBuilder
    {
        public SQLSelectCountQueryBuilder(SQLQueryBuilder query) : base(query)
        {

        }

        public override SQLSelectCountQueryBuilder Select(params string[] columns)
        {
            return new SQLSelectCountQueryBuilder(base.Select(columns));
        }

        public override SQLSelectCountQueryBuilder OrderBy(params string[] columns)
        {
            return new SQLSelectCountQueryBuilder(base.OrderBy(columns));
        }


        public override SQLSelectCountQueryBuilder Where(string where, params object[] parameters)
        {
            return new SQLSelectCountQueryBuilder(base.Where(where, parameters));
        }


        public override SQLSelectCountQueryBuilder Skip(int value)
        {
            return new SQLSelectCountQueryBuilder(base.Skip(value));
        }


        public override SQLSelectCountQueryBuilder Take(int value)
        {
            return new SQLSelectCountQueryBuilder(base.Take(value));
        }


        public override FormatedQuery Build()
        {
            var query = base.Build();
            string selectStatement = query.SQL.ExtractTags("SELECT", "FROM").FirstOrDefault();
            query.SQL = query.SQL.Replace("SELECT" + selectStatement + "FROM", "SELECT COUNT(" + selectStatement + ") FROM");
            return query;
        }

    }
}
