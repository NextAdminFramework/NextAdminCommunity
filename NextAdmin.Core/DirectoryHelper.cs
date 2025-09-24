namespace NextAdmin.Core
{
    public static class DirectoryHelper
    {

        public static void CopyContent(string sourceDirectoryPath, string targetDirectoryPath)
        {
            //Now Create all of the directories
            foreach (string dirPath in System.IO.Directory.GetDirectories(sourceDirectoryPath, "*", System.IO.SearchOption.AllDirectories))
            {
                System.IO.Directory.CreateDirectory(dirPath.Replace(sourceDirectoryPath, targetDirectoryPath));
            }

            //Copy all the files & Replaces any files with the same name
            foreach (string newPath in System.IO.Directory.GetFiles(sourceDirectoryPath, "*.*", System.IO.SearchOption.AllDirectories))
            {
                System.IO.File.Copy(newPath, newPath.Replace(sourceDirectoryPath, targetDirectoryPath), true);
            }
        }

    }
}
