using Microsoft.EntityFrameworkCore;

namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class UpdateEntityInfo
    {

        public string? EntityName { get; set; }

        public object? EntityId { get; set; }

        public UpdateEntityActionType ActionType { get; set; }

    }

    public enum UpdateEntityActionType
    {
        Create = 1,
        Update = 2,
        Delete = 3
    }

    public class UpdateEntityActionTypeHelper
    {

        public static UpdateEntityActionType GetUpdateEntityActionTypeFromEntityState(EntityState entityState)
        {
            switch (entityState)
            {
                case EntityState.Added:
                    return UpdateEntityActionType.Create;
                case EntityState.Deleted:
                    return UpdateEntityActionType.Delete;
                default:
                case EntityState.Modified:
                    return UpdateEntityActionType.Update;
            }
        }


    }
}
