using Microsoft.EntityFrameworkCore;

namespace NextAdmin.FrontEnd.Model
{
    public interface IPlanInfo
    {

        decimal? GetMonthPrice(DbContext dbContact);

        decimal? GetAnnualPrice(DbContext dbContact);

        string GetName(DbContext dbContact);

    }
}
