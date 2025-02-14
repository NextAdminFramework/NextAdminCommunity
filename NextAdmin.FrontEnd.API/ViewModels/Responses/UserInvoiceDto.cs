namespace NextAdmin.FrontEnd.API.ViewModels.Responses
{
    public class UserInvoiceDto
    {

        public DateTime? Date { get; set; }

        public string? Code { get; set; }

        public long Amount { get; set; }

        public string? StripeInvoiceLink { get; set; }

    }
}
