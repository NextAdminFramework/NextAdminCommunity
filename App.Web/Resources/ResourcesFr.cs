namespace NextAdminCommunity.Web.Resources
{
    public class ResourcesFr : ResourcesEn
    {

        public override string AdminUser => "Administrateur";

        public override string AdminUser_UserName => "Identifiant";

        public override string AdminUser_Password => "Mot de passe";

        public override string AdminUser_Culture => "Culture";

        public override string AdminUser_Disabled => "Compte désactivé";

        public override string AdminUser_CreationDate => "Date de création";

        public override string AdminUser_IsSuperAdmin => "Super admin";

        public override string AdminUser_Error_DeleteSuperAdminNotAllowed => "Vous n’êtes pas autorisé à supprimer l’utilisateur SuperAdmin.";
    }
}
