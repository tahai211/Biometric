using Biometrics.ApiService.Service.Cache;
using Microsoft.AspNetCore.Authorization;

namespace Biometrics.ApiService.Infra.Permission
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IServiceProvider _serviceProvider;
        public PermissionHandler(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var username = context.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
                var roles = context.User.Claims.Where(o => o.Type == "userroles").Select(c => c.Value).ToList();
                if (roles != null && roles.Count > 0)
                {
                    var _cacheRepository = scope.ServiceProvider.GetRequiredService<ICacheSerrvice>();
                    var dataPermission = await _cacheRepository.GetPermission();
                    var permission = (from a in dataPermission
                                      where roles.Contains(a.role_code)
                                      group a by a.permission_code into g
                                      select g.Key).ToList();
                    if (permission != null && permission.Count() > 0)
                    {
                        if (permission.Contains(requirement.Permission))
                        {
                            context.Succeed(requirement);
                        }
                    }
                }

                //return Task.CompletedTask;
            }
        }
    }
}
