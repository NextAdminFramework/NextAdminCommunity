using System;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace NextAdmin.Core
{
    public class Ftp
    {


        public static bool UploadFile(Logger logger, FtpInfo ftpInfo, string ftpDirectory, string targetFileName, string fileToUploadPath)
        {
            using (FileStream fileStream = File.OpenRead(fileToUploadPath))
            {
                return UploadFile(logger, ftpInfo, ftpDirectory, targetFileName, fileStream);
            }
        }


        public static bool UploadFile(Logger logger, FtpInfo ftpInfo, string ftpDirectory, string targetFileName, byte[] fileData)
        {
            using (MemoryStream memoryStream = new MemoryStream(fileData))
            {
                return UploadFile(logger, ftpInfo, ftpDirectory, targetFileName, memoryStream);
            }
        }


        public static bool UploadFile(Logger logger, FtpInfo ftpInfo, string ftpDirectory, string targetFileName, Stream fileStream)
        {
            ftpDirectory = PreparFtpPath(ftpDirectory);
            string ftpRequest = (string.IsNullOrEmpty(ftpInfo.Protocol) ? (ftpInfo.EnableSsl ? "sftp" : "ftp") : ftpInfo.Protocol) + "://" + ftpInfo.ServerAddress + ftpDirectory + targetFileName;
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpRequest);
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(ftpInfo.UserName, ftpInfo.Password);
                request.EnableSsl = ftpInfo.EnableSsl;
                ServicePointManager.ServerCertificateValidationCallback = (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) =>
                {
                    return true;
                };
                using (Stream ftpStream = request.GetRequestStream())
                {
                    fileStream.Seek(0, SeekOrigin.Begin);
                    fileStream.CopyTo(ftpStream);
                    //System.Threading.Thread.Sleep(100);
                }
                logger.LogInfo("Ftp.UploadFile:Filte transfered to ftp " + ftpRequest);
            }
            catch (Exception ex)
            {
                logger.LogError("Ftp.UploadFile:Unable to transfer file to ftp " + ftpRequest + "<br />Message : " + ex.Message);
                return false;
            }

            return true;
        }


        public static bool CreateDirectory(Logger logger, FtpInfo ftpInfo, string ftpDirectory)
        {
            ftpDirectory = PreparFtpPath(ftpDirectory);
            string ftpRequest = (string.IsNullOrEmpty(ftpInfo.Protocol) ? (ftpInfo.EnableSsl ? "sftp" : "ftp") : ftpInfo.Protocol) + "://" + ftpInfo.ServerAddress + ftpDirectory;
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpRequest);
                request.Method = WebRequestMethods.Ftp.MakeDirectory;
                request.Credentials = new NetworkCredential(ftpInfo.UserName, ftpInfo.Password);
                request.EnableSsl = ftpInfo.EnableSsl;
                ServicePointManager.ServerCertificateValidationCallback = (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) =>
                {
                    return true;
                };
                using (var resp = (FtpWebResponse)request.GetResponse())
                {
                    logger.LogInfo("Ftp.CreateDirectory:Command executed with status code : " + resp.StatusCode);
                }
            }
            catch (Exception ex)
            {
                logger.LogError("Ftp.CreateDirectory:Unable to create file on directory, exception:" + ex.Message);
                return false;
            }
            return true;
        }


        private static string PreparFtpPath(string ftpDirectory)
        {

            if (!string.IsNullOrWhiteSpace(ftpDirectory))
            {
                if (!ftpDirectory.StartsWith("//"))
                {
                    if (ftpDirectory.StartsWith("/"))
                    {
                        ftpDirectory = "/" + ftpDirectory;
                    }
                    else
                    {
                        ftpDirectory = "//" + ftpDirectory;
                    }
                }
                if (!ftpDirectory.EndsWith("/"))
                {
                    ftpDirectory = ftpDirectory + "/";
                }
            }
            else
            {
                ftpDirectory = "/";
            }
            return ftpDirectory;
        }


    }

    public class FtpInfo
    {
        public string ServerAddress { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Protocol { get; set; } //ftp or sftp

        public bool EnableSsl { get; set; }

    }



}
