using Newtonsoft.Json;
using NextAdmin.Core;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.Model.Resources;

namespace NextAdmin.FrontEnd.Model
{
    [Label(nameof(FrontEndResourcesFr.ContactMessage))]
    public class ContactMessage : StrGuidIdEntity, IBlobEntity
    {

        [Label]
        public string? UserId { get; set; }

        [Label(nameof(FrontEndResourcesFr.ContactMessage_Date))]
        public DateTime? Date { get; set; }

        [Label(nameof(FrontEndResourcesFr.ContactMessage_ResponseDate))]
        public DateTime? ResponseDate { get; set; }

        [Label(nameof(FrontEndResourcesFr.ContactMessage_Message))]
        public string? Message { get; set; }

        [Label(nameof(FrontEndResourcesFr.ContactMessage_Email)), Previewable]
        public string? UserEmail { get; set; }

        public string? AdminEmail { get; set; }

        [Label(nameof(FrontEndResourcesFr.ContactMessage_IsSuccessfullySent))]
        public bool IsSuccessfullySent { get; set; }

        [JsonIgnore]
        public string? Blob { get; set; }

        [Blob]
        public List<ContactMessageResponse>? Responses { get; set; }

        public ContactMessage() : base()
        {
            this.ExtendBlobEntity();
        }

        public ContactMessageResponse AddResponse(string message, DateTime? date = null)
        {
            if (date == null)
            {
                date = DateTime.Now;
            }
            if (Responses == null)
            {
                Responses = new List<ContactMessageResponse>();
            }
            var response = new ContactMessageResponse { Message = message, Date = date };
            Responses.Add(response);
            return response;
        }


        protected override void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnInsert(dbContext, args);
            if (!Date.HasValue)
            {
                Date = DateTime.Now;
            }
        }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnSave(dbContext, args);
            if (Responses != null && Responses.Count > 0 && !ResponseDate.HasValue)
            {
                ResponseDate = Responses.FirstOrDefault()?.Date ?? DateTime.Now;
            }
        }

        public virtual EmailMessage GetAdminNotificationEmail(NextAdminDbContext dbContext)
        {
            var message = new EmailMessage
            {
                Subject = (dbContext.Options.AppConfig["AppName"] ?? "Next'Admin") + " - New contact request",
                Content = $"<b>From: {UserEmail}</b><br /><br />{Message}",
                ToAddresses = new List<string> { UserEmail }
            };
            if (!string.IsNullOrEmpty(AdminEmail))
            {
                message.ToAddresses = new List<string> { AdminEmail };
            }
            return message;
        }

    }

    public class ContactMessageResponse
    {

        public string? Message { get; set; }

        public DateTime? Date { get; set; }

    }



}
