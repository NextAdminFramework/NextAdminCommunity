using MailKit.Security;
using MimeKit;
using System.Net;
using System.Net.Mail;

namespace NextAdmin.Core
{
    public static class Email
    {
        private static bool _hasInitAllowUnknowCertificate = false;

        public static void SendMailKitEmail(this SmtpServerAccount mailAccount, MailMessage mailMessage)
        {
            MimeMessage emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(mailAccount.EmailDisplayName, mailAccount.FullEmailAddress));
            foreach (var to in mailMessage.To)
            {
                emailMessage.To.Add(new MailboxAddress(to.DisplayName, to.Address));
            }
            emailMessage.Subject = mailMessage.Subject;
            BodyBuilder emailBodyBuilder = new BodyBuilder();
            if (mailMessage.IsBodyHtml)
            {
                emailBodyBuilder.HtmlBody = mailMessage.Body;
            }
            else
            {
                emailBodyBuilder.TextBody = mailMessage.Body;
            }
            if (mailMessage.Attachments != null)
            {
                foreach (var attachment in mailMessage.Attachments)
                {
                    emailBodyBuilder.Attachments.Add(new MimePart(Core.MimeType.GetMimeType(Path.GetExtension(attachment.Name)))
                    {
                        Content = new MimeContent(attachment.ContentStream),
                        ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                        ContentTransferEncoding = ContentEncoding.Base64,
                        FileName = Path.GetFileName(attachment.Name)
                    });
                }
            }
            emailMessage.Body = emailBodyBuilder.ToMessageBody();

            using (var emailClient = new MailKit.Net.Smtp.SmtpClient())
            {
                SecureSocketOptions securSocketOption = GetSecureSocketOptions(mailAccount.EmailEncryption);
                emailClient.Connect(mailAccount.SmtpServerAddress, mailAccount.SmtpServerPort, securSocketOption);
                emailClient.AuthenticationMechanisms.Remove("NTLM");//Microsoft mechanism that cause slow auth
                emailClient.Authenticate(mailAccount.EmailServerUserName, mailAccount.EmailServerPassword);
                emailClient.Send(emailMessage);
                emailClient.Disconnect(true);
                emailClient.Dispose();
            }
        }

        public static void SendStandardEmail(this SmtpServerAccount mailAccount, MailMessage mailMessage)
        {
            if (!_hasInitAllowUnknowCertificate)
            {
                ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sspolicy) => { return true; };
            }
            SmtpClient smtpClient = new SmtpClient(mailAccount.SmtpServerAddress, mailAccount.SmtpServerPort);
            smtpClient.EnableSsl = mailAccount.EmailEncryption != EmailEncryptionType.None;
            smtpClient.UseDefaultCredentials = false;
            if (!string.IsNullOrWhiteSpace(mailAccount.EmailServerPassword))
            {
                smtpClient.Credentials = new NetworkCredential(mailAccount.EmailServerUserName, mailAccount.EmailServerPassword);
            }
            else
            {
                smtpClient.Credentials = new NetworkCredential();
            }
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.Timeout = 5000;
            smtpClient.Send(mailMessage);
        }


        public static void SendEmail(this SmtpServerAccount mailAccount, MailMessage mailMessage, bool useMailKit = true)
        {
            if (useMailKit)
            {
                SendMailKitEmail(mailAccount, mailMessage);
            }
            else
            {
                SendStandardEmail(mailAccount, mailMessage);
            }
        }


        private static SecureSocketOptions GetSecureSocketOptions(EmailEncryptionType encryptionType)
        {
            switch (encryptionType)
            {
                default:
                case EmailEncryptionType.Auto:
                    return SecureSocketOptions.Auto;
                case EmailEncryptionType.None:
                    return SecureSocketOptions.None;
                case EmailEncryptionType.Tls:
                    return SecureSocketOptions.StartTls;
                case EmailEncryptionType.Ssl:
                    return SecureSocketOptions.SslOnConnect;
            }
        }


        public static bool TrySendEmail(this SmtpServerAccount mailAccount, MailMessage mailMessage)
        {
            if (!_hasInitAllowUnknowCertificate)
            {
                ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sspolicy) => { return true; };
            }
            try
            {
                SendEmail(mailAccount, mailMessage);
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                return false;
            }
            return true;
        }


        public static void SendEmail(this SmtpServerAccount mailAccount, string subject, string content, IEnumerable<string> toAddresses, IEnumerable<string> ccAddresses = null, IEnumerable<IDocument> documents = null, bool isHtml = true)
        {
            System.Net.Mail.MailMessage mailMessage = new System.Net.Mail.MailMessage();
            mailMessage.From = new System.Net.Mail.MailAddress(mailAccount.FullEmailAddress, mailAccount.EmailDisplayName);
            foreach (string adress in toAddresses)
            {
                if (string.IsNullOrWhiteSpace(adress))
                    continue;
                mailMessage.To.Add(new System.Net.Mail.MailAddress(adress));
            }
            if (ccAddresses != null)
            {
                foreach (string adress in ccAddresses)
                {
                    if (string.IsNullOrWhiteSpace(adress))
                        continue;
                    mailMessage.CC.Add(new System.Net.Mail.MailAddress(adress));
                }
            }
            List<Stream> filesStreams = new List<Stream>();
            if (documents != null)
            {
                foreach (var document in documents)
                {
                    var docData = document.Data;
                    Stream stream = new MemoryStream(docData);
                    var attachment = new Attachment(stream, document.Name.RemoveDiacritics().Replace(" ", "-") + "." + document.Extension);
                    filesStreams.Add(stream);
                    mailMessage.Attachments.Add(attachment);
                }
            }
            if (isHtml && !content.Contains("<html>"))
            {
                content = "<html>" + content + "</html>";//increase email score
            }
            mailMessage.Subject = subject;
            mailMessage.Body = content;
            mailMessage.IsBodyHtml = isHtml;
            SendEmail(mailAccount, mailMessage);
            foreach (var stream in filesStreams)
            {
                stream.Dispose();
            }
        }


        public static void SendEmail(this SmtpServerAccount mailAccount, EmailMessage emailMessage)
        {
            SendEmail(mailAccount, emailMessage.Subject, emailMessage.Content, emailMessage.ToAddresses, emailMessage.CcAddresses, emailMessage.Documents);
        }

        public static bool TrySendEmail(this SmtpServerAccount mailAccount, EmailMessage emailMessage)
        {
            try
            {
                SendEmail(mailAccount, emailMessage);
            }
            catch
            {
                return false;
            }
            return true;
        }


        public static bool TrySendEmail(this SmtpServerAccount mailAccount, string subject, string content, IEnumerable<string> toAddresses, IEnumerable<string> ccAddresses = null, IEnumerable<IDocument> documents = null, bool html = true)
        {
            try
            {
                SendEmail(mailAccount, subject, content, toAddresses, ccAddresses, documents, html);
            }
            catch
            {
                return false;
            }
            return true;
        }


        public interface ISMTPServerAccount : IServerEmailAccount
        {
            string SMTPServerAddress { get; set; }

            int SMTPServerPort { get; set; }

            string MailDisplayName { get; set; }
        }


        public interface IMAPServerAccount : IServerEmailAccount
        {
            string IMAPServerAddress { get; set; }

            int IMAPServerPort { get; set; }

        }



        public interface IServerEmailAccount
        {

            EmailEncryptionType EmailEncryption { get; set; }

            string EmailServerUserName { get; set; }

            string EmailServerPassword { get; set; }

            string FullEmailAddress { get; set; }

        }



        public enum EmailEncryptionType
        {
            Auto = 0,
            None = 1,
            Tls = 2,
            Ssl = 3
        }



        public class ServerEmailAccount : IServerEmailAccount
        {
            public EmailEncryptionType EmailEncryption { get; set; }

            public string EmailServerUserName { get; set; }

            public string EmailServerPassword { get; set; }

            public string FullEmailAddress { get; set; }
        }


        public class SmtpServerAccount : ServerEmailAccount
        {
            public string SmtpServerAddress { get; set; }

            public int SmtpServerPort { get; set; }

            public string EmailDisplayName { get; set; }
        }

    }

    public class EmailMessage
    {

        public string Subject { get; set; }

        public string Content { get; set; }

        public IEnumerable<string> ToAddresses { get; set; }

        public IEnumerable<string> CcAddresses { get; set; }

        public IEnumerable<IDocument> Documents { get; set; }

        public bool IsHtml { get; set; }

        public EmailMessage()
        {
            IsHtml = true;
        }

    }


}
