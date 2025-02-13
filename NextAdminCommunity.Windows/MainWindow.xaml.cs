using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using NextAdminCommunity.Web;
using System.Threading.Tasks;
using System.Windows;

namespace NextAdmin.Windows
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            new Task(() =>
            {
                var host = new WebHostBuilder()
          .UseKestrel()
          .UseUrls("http://*:5004")
              .UseConfiguration(new ConfigurationBuilder()
              .AddJsonFile("appsettings.json")
              .Build())
          .UseStartup<Startup>()
          .Build();
                host.Run();
            }).Start();

            InitializeComponent();
        }
    }
}
