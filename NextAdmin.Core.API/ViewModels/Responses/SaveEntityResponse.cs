namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class SaveEntityResponse : UpdateEntitiesResponse, ISaveResponse
    {
        public object Entity { get; set; }


        public SaveEntityResponse() : base()
        {

        }

    }

}
