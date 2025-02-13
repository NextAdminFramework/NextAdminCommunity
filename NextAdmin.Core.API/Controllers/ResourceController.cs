using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace NextAdmin.Core.API.Controllers
{
    [ApiController, Route("resource")]
    public abstract class ResourceController : Controller
    {

        public ResourceController()
        {

        }

        protected virtual byte[] GetResourceBytes(string path, Assembly assembly)
        {
            return Core.EmbedResource.GetResourceBytes(path, assembly);
        }

        protected virtual Stream GetResourceStream(string path, Assembly assembly)
        {
            return Core.EmbedResource.GetResourceStream(path, assembly);
        }


        [HttpGet]
        [HttpGet("embed/{assemblyName}/{p2?}/{p3?}/{p4?}/{p5?}/{p6?}/{p7?}/{p8?}/{p9?}/{p10?}/{p11?}/{p12?}/{p13?}/{p14?}/{p15?}/")]
        public virtual IActionResult GetResource(string assemblyName)
        {
            string path = Request.Path.Value ?? "";
            path = path.Substring(path.IndexOf(("/embed/" + assemblyName + "/")) + ("/embed/" + assemblyName + "/").Length);
            Assembly? assembly = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(a => a.GetName().Name.Equals(assemblyName, StringComparison.InvariantCultureIgnoreCase));
            if (assembly == null)
            {
                return BadRequest();
            }
            var stream = GetResourceStream(path, assembly);
            if (stream == null)
            {
                return BadRequest();
            }
            return File(stream, Core.MimeType.GetMimeType(Path.GetExtension(path)));
        }





    }




}
