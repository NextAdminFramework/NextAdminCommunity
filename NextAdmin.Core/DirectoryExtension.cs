using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextAdmin.Core
{
  public static class DirectoryExtension
  {

    public static void Copy(string sourcePath, string targetPath)
    {
      //Now Create all of the directories
      foreach (string dirPath in System.IO.Directory.GetDirectories(sourcePath, "*", System.IO.SearchOption.AllDirectories))
      {
        System.IO.Directory.CreateDirectory(dirPath.Replace(sourcePath, targetPath));
      }

      //Copy all the files & Replaces any files with the same name
      foreach (string newPath in System.IO.Directory.GetFiles(sourcePath, "*.*", System.IO.SearchOption.AllDirectories))
      {
        System.IO.File.Copy(newPath, newPath.Replace(sourcePath, targetPath), true);
      }
    }

  }
}
