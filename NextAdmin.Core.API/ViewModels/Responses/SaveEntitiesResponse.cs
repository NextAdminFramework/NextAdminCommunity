namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class SaveEntitiesResponse : UpdateEntitiesResponse, ISaveResponse
    {
        public List<object>? Entities { get; set; }

        public SaveEntitiesResponse() : base()
        {

        }


    }

}
