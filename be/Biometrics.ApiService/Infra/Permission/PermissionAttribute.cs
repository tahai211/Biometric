using Microsoft.AspNetCore.Authorization;

namespace Biometrics.ApiService.Infra.Permission
{
    public class PermissionAttribute : AuthorizeAttribute
    {
        public const string PolicyPrefix = "Permission_";
        public PermissionAttribute(string permission) : base(permission)
        {
        }
    }
}
