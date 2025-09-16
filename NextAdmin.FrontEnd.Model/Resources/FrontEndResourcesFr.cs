using NextAdmin.Core;

namespace NextAdmin.FrontEnd.Model.Resources
{
    public class FrontEndResourcesFr : ResourcesManager
    {
        public virtual string ContactMessage => "Demande de contact";

        public virtual string ContactMessage_Date => "Date";

        public virtual string ContactMessage_Email => "Email";

        public virtual string ContactMessage_Message => "Message";

        public virtual string ContactMessage_IsSuccessfullySent => "E-mail envoyé";

        public virtual string ContactMessage_ResponseDate => "Date de réponse";

    }
}
