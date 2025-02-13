using NextAdmin.Core.API.ViewModels.Responses;
using System.Collections.Generic;

namespace NextAdminCommunity.Web.ViewModels
{
    public class AdminAppConfig
    {

        public List<EntityInfo>? EntityInfos { get; set; }

        public string? SuperAdminUserId { get; set; }

    }
}
