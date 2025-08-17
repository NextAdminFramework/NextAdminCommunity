using Microsoft.EntityFrameworkCore;

namespace NextAdmin.FrontEnd.Model
{
    public interface IItemInfo
    {
        decimal GetUnitSalePrice(DbContext dbContext);

        string GetItemName(DbContext dbContext);

        string GetItemType(DbContext dbContext);

        string GetItemId(DbContext dbContext);


    }
}
