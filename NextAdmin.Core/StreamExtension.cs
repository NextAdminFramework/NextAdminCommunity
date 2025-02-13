using System.IO;

namespace NextAdmin.Core
{
    public static class StreamExtension
    {

        public static void WriteToFile(this Stream stream, string filePath, bool overwrite = true)
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(Path.GetDirectoryName(filePath));
            if (!directoryInfo.Exists)
            {
                directoryInfo.Create();
            }
            if (overwrite)
            {
                var fileInfo = new FileInfo(filePath);
                if (fileInfo.Exists)
                {
                    fileInfo.Delete();
                }
            }
            using (FileStream outputFileStream = new FileStream(filePath, FileMode.Create))
            {
                stream.CopyTo(outputFileStream);
            }
        }


        public static byte[] ToArray(this Stream stream)
        {
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

    }
}
