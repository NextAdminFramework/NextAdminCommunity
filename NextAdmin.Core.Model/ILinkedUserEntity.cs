namespace NextAdmin.Core.Model
{
    public interface ILinkedUserEntity<TUser>
        where TUser : IUser
    {
        public string? UserId { get; set; }

        public TUser User { get; set; }


    }


    public static class LinkedUserEntityExtension
    {

        public static TUser? GetUser<TUser>(this ILinkedUserEntity<TUser> entity, NextAdminDbContext dbContext)
            where TUser : class, IUser
        {
            if (entity.User != null)
            {
                return entity.User;
            }
            if (entity.UserId == null)
            {
                return null;
            }
            return dbContext.GetEntity<TUser>(entity.UserId);
        }


    }
}
