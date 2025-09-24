using FluentFTP;

namespace NextAdmin.Core
{
    public class Ftp
    {


        public static bool UploadFile(FtpServerAccount ftpInfo, string ftpDirectory, string fileToUploadPath, string? targetFileName = null, Logger? logger = null)
        {
            if (targetFileName == null)
            {
                targetFileName = Path.GetFileName(fileToUploadPath);
            }
            var client = new FtpClient(ftpInfo.ServerAddress, ftpInfo.UserName, ftpInfo.Password);
            var connectionResult = client.AutoConnect();
            if (connectionResult == null)
            {
                logger?.LogError($"{nameof(UploadFile)}.{System.Reflection.MethodBase.GetCurrentMethod()?.Name}:Unable to connect to server");
                return false;
            }
            var result = client.UploadFile(fileToUploadPath, Path.Combine(ftpDirectory, targetFileName), createRemoteDir: true);
            if (result != FtpStatus.Success)
            {
                logger?.LogError($"{nameof(UploadFile)}.{System.Reflection.MethodBase.GetCurrentMethod()?.Name}:Unable to upload file, result:{result}");
            }
            return result == FtpStatus.Success;
        }


        public static bool UploadFile(FtpServerAccount ftpInfo, string ftpDirectory, byte[] fileData, string targetFileName, Logger? logger = null)
        {
            var client = new FtpClient(ftpInfo.ServerAddress, ftpInfo.UserName, ftpInfo.Password);
            var connectionResult = client.AutoConnect();
            if (connectionResult == null)
            {
                logger?.LogError($"{nameof(UploadFile)}.{System.Reflection.MethodBase.GetCurrentMethod()?.Name}:Unable to connect to server");
                return false;
            }
            var result = client.UploadBytes(fileData, Path.Combine(ftpDirectory, targetFileName), createRemoteDir: true);
            return result == FtpStatus.Success;
        }


        public static bool UploadFile(FtpServerAccount ftpInfo, string ftpDirectory, Stream fileStream, string targetFileName, Logger? logger = null)
        {
            var client = new FtpClient(ftpInfo.ServerAddress, ftpInfo.UserName, ftpInfo.Password);
            var connectionResult = client.AutoConnect();
            if (connectionResult == null)
            {
                logger?.LogError($"{nameof(UploadFile)}.{System.Reflection.MethodBase.GetCurrentMethod()?.Name}:Unable to connect to server");
                return false;
            }
            var result = client.UploadStream(fileStream, Path.Combine(ftpDirectory, targetFileName), createRemoteDir: true);
            return result == FtpStatus.Success;
        }


        public static bool CreateDirectory(FtpServerAccount ftpInfo, string ftpDirectory, Logger? logger = null)
        {
            var client = new FtpClient(ftpInfo.ServerAddress, ftpInfo.UserName, ftpInfo.Password);
            var connectionResult = client.AutoConnect();
            if (connectionResult == null)
            {
                logger?.LogError($"{nameof(UploadFile)}.{System.Reflection.MethodBase.GetCurrentMethod()?.Name}:Unable to connect to server");
                return false;
            }
            return client.CreateDirectory(ftpDirectory);
        }

    }

    public class FtpServerAccount
    {
        public string? ServerAddress { get; set; }

        public string? UserName { get; set; }

        public string? Password { get; set; }

    }



}
