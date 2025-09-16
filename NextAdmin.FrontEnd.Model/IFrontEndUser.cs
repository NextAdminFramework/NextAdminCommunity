using NextAdmin.Core.Model;

namespace NextAdmin.FrontEnd.Model
{
    public interface IFrontEndUser : IUser
    {
        public string? Id { get; set; }

        public string? EmailVerificationCode { get; set; }

        public string? UpdateEmailCode { get; set; }

        public DateTime? EmailVerificationDate { get; set; }

    }
}
