namespace NextAdmin.Core.Model.Resources
{
    public class ResourcesEn : ResourcesManager
    {
        public virtual string Culture => "en-US";


        //Errors

        public virtual string Error_RequiredField => "Field is required";

        public virtual string Error_InvalidPassword => "Invalid password";

        public virtual string Error_InvalidLogin => "Invalid login";

        public virtual string Error_LoginAlreadyUsed => "Login already exist";

        public virtual string Denied => "Denied";

        public virtual string ReadOnly => "Read only";

        public virtual string ReadWrite => "Read/Write";

        public virtual string UserEntity => "User";

        //API

        public virtual string RecoverPasswordMailTitle => "Password recovering";

        public virtual string RecoverPasswordMailMessage => "Your password has been reinitialized.<br/><br/> Your new password : <b>{PASSWORD}</b><br /><br />Best regards,";

        public virtual string CreateAccountEmailConfirmationTitle => "Email confirmation";

        public virtual string CreateAccountEmailConfirmationContent => "Here is your confirmation code : <h1 style='letter-spacing:1rem'>{CONFIRMATION_CODE}</h1>";

    }
}
