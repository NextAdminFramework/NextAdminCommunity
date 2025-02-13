using Newtonsoft.Json.Linq;

namespace NextAdmin.Core.API.ViewModels.Args
{
    public class SaveEntitiesArgs : EntityArgs
    {
        public List<JObject>? EntitiesToAddOrUpdate { get; set; }

        public List<object>? EntitiesToDeleteIds { get; set; }


    }
}
