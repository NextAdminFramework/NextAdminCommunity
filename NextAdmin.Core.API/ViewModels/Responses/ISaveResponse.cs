namespace NextAdmin.Core.API.ViewModels.Responses
{
    public interface ISaveResponse
    {
        public string Code { get; set; }

        public string Message { get; set; }

        public List<EntityError> Errors { get; set; }

        public List<EntityError> Warnings { get; set; }

        public List<UpdateEntityInfo> UpdateInfos { get; set; }

        public Exception Exception { get; set; }

    }
}
