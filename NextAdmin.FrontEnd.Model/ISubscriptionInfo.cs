using Microsoft.EntityFrameworkCore;

namespace NextAdmin.FrontEnd.Model
{
    public interface ISubscriptionInfo
    {

        decimal? GetMonthPrice(DbContext dbContact);

        decimal? GetAnnualPrice(DbContext dbContact);

        string GetItemName(DbContext dbContact);

        string GetItemType(DbContext dbContact);

    }
}
