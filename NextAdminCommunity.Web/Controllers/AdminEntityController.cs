using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdminCommunity.Web.Models;

namespace NextAdminCommunity.Web.Controllers
{
    [Route("api/admin/entity/{action}/{id?}")]
    public class AdminEntityController : EntityController<AdminUser>
    {

        public AdminEntityController(AppDbContext dbContext = null, IConfiguration configuration = null)
          : base(dbContext, configuration)
        {

        }

    }
}
