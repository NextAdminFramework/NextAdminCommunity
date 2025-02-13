namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class UpdateEntitiesResponse : ApiResponse, ISaveResponse
    {

        public List<EntityError> Errors { get; set; }

        public List<EntityError> Warnings { get; set; }

        public List<UpdateEntityInfo> UpdateInfos { get; set; }

        public UpdateEntitiesResponse() : base()
        {
            Errors = new List<EntityError>();
            Warnings = new List<EntityError>();
            UpdateInfos = new List<UpdateEntityInfo>();
        }

    }
}
