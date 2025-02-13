namespace NextAdmin.Core.API.ViewModels.Responses
{

    public class EntityError
    {
        public string EntityName { get; set; }

        public object EntityId { get; set; }

        public string MemberName { get; set; }

        public string Message { get; set; }

        public string ErrorCode { get; set; }

    }

}
