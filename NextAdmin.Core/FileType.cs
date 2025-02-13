namespace NextAdmin.Core
{
    public static class FileType
    {

        public static bool IsImage(string fileNameOrExtension)
        {
            if (string.IsNullOrEmpty(fileNameOrExtension))
            {
                return false;
            }
            var fileName = (fileNameOrExtension.Contains(".") ? fileNameOrExtension.Split(".")[1] : fileNameOrExtension).ToLower();
            return (fileName == "png" || fileName == "jpg" || fileName == "jpeg");
        }

    }
}
