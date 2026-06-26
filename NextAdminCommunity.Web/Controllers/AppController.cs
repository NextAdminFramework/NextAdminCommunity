using Microsoft.AspNetCore.Mvc;
using NextAdmin.Core.API;
using NextAdminCommunity.Web.ViewModels;

namespace NextAdminCommunity.Web.Controllers
{
    public class AppController : Controller
    {

        public AppController()
          : base()
        {

        }

        [Route("")]
        [Route("Index")]
        [Route("/[controller]")]
        public virtual IActionResult Index(string? url = null)
        {
            return View("~/Views/Admin/Index.cshtml", new AdminAppOptions
            {
                RequestUrl = url,
                AppName = NextAdminServices.AppName,
                AdminAuthTokenName = NextAdminServices.AdminAuthTokenName,
                AdminUserControllerUrl = NextAdminServices.AppConfiguration?["AdminUserControllerUrl"],
                AdminServiceControllerUrl = NextAdminServices.AppConfiguration?["AdminServiceControllerUrl"],
                AdminEntityControllerUrl = NextAdminServices.AppConfiguration?["AdminEntityControllerUrl"]
            });
        }

    }

}
