using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Models.User
{
    public class RefreshRequestModel
    {
        public string RefreshToken { get; set; }
        public string AccessToken { get; set; }
        public string ServiceId { get; set; }
    }
}
