using NextAdmin.Core.Model;

namespace NextAdmin.FrontEnd.Model
{
    public interface IItemInfo
    {
        decimal GetUnitSalePrice(NextAdminDbContext dbContext);

        string GetItemName(NextAdminDbContext dbContext);

        string GetItemType(NextAdminDbContext dbContext);

        string GetItemId(NextAdminDbContext dbContext);


    }
}
