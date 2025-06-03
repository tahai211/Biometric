using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Models.User
{
    public class UserManagementRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string Birthday { get; set; }
        public string Address { get; set; }
        public string Branch { get; set; }
        public int Policy { get; set; }
        public dynamic RolesBO { get; set; }
        public dynamic RolesRPT { get; set; }
        public dynamic RoleThirdparty { get; set; }
        public string CompanyId { get; set; }
        public string Id { get; set; }
        public string UserType { get; set; }
        public bool AutoGenPass { get; set; }
        public string Typesend { get; set; }
        public string UserNameCbs { get; set; }
        public string EmployeeId { get; set; }
        public string ServiceId { get; set; }
        public string SourceId { get; set; }
        public string Tokencbs { get; set; }
    }

}
