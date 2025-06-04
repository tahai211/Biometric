using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace Biometrics.ApiService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    //nó ghi đè cấu hình port từ launchSettings.json hoặc biến môi trường.
                    //webBuilder.UseUrls("http://192.168.188.138:5000");
                    webBuilder.UseStartup<Startup>(); // Sử dụng lớp Startup
                });
    }
}
