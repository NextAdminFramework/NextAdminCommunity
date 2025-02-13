namespace NextAdminCommunity.Web.Resources
{
    public class ResourcesEn : NextAdmin.Core.Model.Resources.ResourcesEn
    {

        public virtual string AdminUser => "Administrator";

        public virtual string AdminUser_UserName => "User name";

        public virtual string AdminUser_Password => "Password";

        public virtual string AdminUser_Culture => "Culture";

        public virtual string AdminUser_Disabled => "Account disabled";

        public virtual string AdminUser_CreationDate => "Creation date";

        public virtual string AdminUser_IsSuperAdmin => "Super admin";

        public virtual string AdminUser_Error_DeleteSuperAdminNotAllowed => "You are note allowed to delete SuperAdmin user.";


    }
}
