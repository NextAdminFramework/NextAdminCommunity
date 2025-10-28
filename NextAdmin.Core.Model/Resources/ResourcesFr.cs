namespace NextAdmin.Core.Model.Resources
{
    public class ResourcesFr : ResourcesEn
    {
        public override string Culture => "fr-FR";

        public override string Error_RequiredField => "Le champs est requis";

        public override string Error_InvalidPassword => "Mot de passe invalide";

        public override string Error_InvalidLogin => "Identifiant invalide";

        public override string Error_LoginAlreadyUsed => "Cet identifiant est déjà utilisé";

        public override string Denied => "Refusé";

        public override string ReadOnly => "Consultation uniquement";

        public override string ReadWrite => "Consultation et modification";

        public override string UserEntity => "Utilisateur";

        //API
        public override string RecoverPasswordMailTitle => "Récupération de votre mot de passe";

        public override string RecoverPasswordMailMessage => "Votre mot de passe a été réinitialisé.<br/><br/> Votre nouveau mot de passe est le suivant : <b>{PASSWORD}</b><br /><br />À bientôt,";

        public override string CreateAccountEmailConfirmationTitle => "Vérification de votre email";

        public override string CreateAccountEmailConfirmationContent => "Voici votre code de confirmation : <h1 style='letter-spacing:1rem'>{CONFIRMATION_CODE}</h1>";

    }
}
