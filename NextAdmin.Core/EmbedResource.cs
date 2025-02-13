using System.IO;
using System.Reflection;
using System.Text;

namespace NextAdmin.Core
{
    public static class EmbedResource
    {


        public static Stream GetResourceStream(string path, Assembly assembly)
        {
            var extension = Path.GetExtension(path);
            path = path.Replace("/", ".");
            if (!path.StartsWith("."))
                path = "." + path;
            string assemblyName = assembly.GetName().Name;
            var resourceName = assemblyName + path;
            return assembly.GetManifestResourceStream(resourceName);
        }


        public static byte[] GetResourceBytes(string path, Assembly assembly)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                var stream = GetResourceStream(path, assembly);
                if (stream == null)
                    return null;
                stream.CopyTo(ms);
                return ms.ToArray();
            }
        }


        public static string GetResourceString(string path, Assembly assembly)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                var stream = GetResourceStream(path, assembly);
                if (stream == null)
                    return null;
                stream.CopyTo(ms);
                return Encoding.UTF8.GetString(ms.GetBuffer(), 0, (int)ms.Length);
            }
        }

    }
}
