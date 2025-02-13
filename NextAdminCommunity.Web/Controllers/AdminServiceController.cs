using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdminCommunity.Web.Models;
using NextAdminCommunity.Web.ViewModels;
using System.Linq;

namespace NextAdminCommunity.Web.Controllers
{
    [ApiController, Route("api/admin/service/{action}/{id?}")]
    public class AdminServiceController : Controller<AdminUser>
    {

        public AdminServiceController(AppDbContext dbContext = null, IConfiguration configuration = null)
          : base(dbContext, configuration)
        {

        }

        public AdminAppConfig GetAppConfig()
        {
            if (User == null)
            {
                return null;
            }
            return new AdminAppConfig
            {
                EntityInfos = DbContext.GetEntityInfos().Values.Select(e => new EntityInfo(e)).ToList(),
                SuperAdminUserId = AdminUser.SuperAdminUserId
            };
        }

    }
}
