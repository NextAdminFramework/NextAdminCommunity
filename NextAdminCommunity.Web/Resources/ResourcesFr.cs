namespace NextAdminCommunity.Web.Resources
{
    public class ResourcesFr : NextAdmin.Core.Model.Resources.ResourcesFr
    {

        public virtual string AdminUser => "Administrateur";

        public virtual string AdminUser_UserName => "Identifiant";

        public virtual string AdminUser_Password => "Mot de passe";

        public virtual string AdminUser_Culture => "Culture";

        public virtual string AdminUser_Disabled => "Compte désactivé";

        public virtual string AdminUser_CreationDate => "Date de création";

        public virtual string AdminUser_IsSuperAdmin => "Super admin";

        public virtual string AdminUser_Error_DeleteSuperAdminNotAllowed => "Vous n’êtes pas autorisé à supprimer l’utilisateur SuperAdmin.";
    }
}
