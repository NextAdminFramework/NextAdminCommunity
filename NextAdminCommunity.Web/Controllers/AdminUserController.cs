using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdminCommunity.Web.Models;

namespace NextAdminCommunity.Web.Controllers
{
    [Route("api/admin/user/{action}/{id?}")]
    public class AdminUserController : UserController<AdminUser>
    {

        public AdminUserController(AppDbContext dbContext = null, IConfiguration configuration = null)
          : base(dbContext, configuration)
        {

        }
    }
}
