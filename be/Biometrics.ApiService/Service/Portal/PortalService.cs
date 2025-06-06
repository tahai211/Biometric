using Microsoft.EntityFrameworkCore;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.DTO.Entity;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Biometrics.ApiService.Service.Cache;
using Microsoft.Extensions.Caching.Distributed;
using ZiggyCreatures.Caching.Fusion;
using Biometrics.ApiService.Infra.Extensions;

namespace Biometrics.ApiService.Service.Portal
{
    public class PortalService : IPortalService
    {
        private readonly AppDbContext _context;
        private readonly ICacheSerrvice _cacheSerrvice;
        protected readonly IDistributedCache _cache;
        private readonly IFusionCache _fusionCache;

        public PortalService(AppDbContext context, ICacheSerrvice cacheSerrvice,IDistributedCache cache, IFusionCache fusionCache)
        {
            _context = context;
            _cacheSerrvice = cacheSerrvice;
            _cache = cache;
            _fusionCache = fusionCache; 
        }
        public async ValueTask<object> GetListPortalManagement(string? portalName, string? portaiId, string? status, int pageSize = 0, int pageIndex = 1)
        {

            //dùng với redis => k get string đc nếu bật _fusionCache vì nó sẽ lưu dạng hash
            //await _cache.SetStringAsync("PERMISSION", "Hello Redis", new DistributedCacheEntryOptions
            //{
            //    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            //});
            //try
            //{
            //    var pong = await _cache.GetStringAsync("CIMS_API_PERMISSION");
            //    Console.WriteLine("Redis connected successfully.");
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine("Redis connection failed: " + ex.Message);
            //}
            //var dataPermission = await _cacheSerrvice.GetPermission();


           // var cachedValue1 = await _fusionCache.GetOrSetAsync(
           //    "hello123",
           //    async entry =>
           //    {
           //        // Mục đích thông thường: gọi DB, hoặc API, rồi return kết quả.
           //        // Ở đây chỉ đơn giản trả "world".
           //        await Task.CompletedTask;
           //        return "world";
           //    },
           //    options: new FusionCacheEntryOptions
           //    {
           //        Duration = TimeSpan.FromMinutes(10) // TTL riêng cho key này
           //    }
           //);
            // var tryGet = await _fusionCache.TryGetAsync<string>("hello123");
            // if (tryGet.HasValue)
            // {
            //     Console.WriteLine($"[TryGetAsync] Lấy được từ cache: \"{tryGet.Value}\"");
            // }
            // else
            // {
            //     Console.WriteLine($"[TryGetAsync] Key \"hello\" chưa tồn tại trong cache.");
            // }
            //var directGet = await _fusionCache.GetOrDefaultAsync<string>("hello123");


            bool? _status = String.IsNullOrEmpty(status) ? null : (status.Equals("1") ? true : false);

            int skip = ((pageIndex - 1) * pageSize);

            var lst = _context.SysServices
                   .Where(x => (portaiId == null || x.ServiceId.Contains(portaiId))
                               && (portalName == null || x.ServiceName.Contains(portalName))
                               && (_status == null || x.Status == _status)
                           );

            var total = lst.Count();
            if (pageSize != 0)
            {
                var data = lst.Skip(skip).Take(pageSize);
                int pages = lst.Count() % pageSize >= 1 ? lst.Count() / pageSize + 1 : lst.Count() / pageSize;
                return new { data = data, pages = pages, total = total, pageIndex = pageIndex };
            }
            else
            {
                return new { data = lst, pages = 0, total = total, pageIndex = 1 };
            }
        }
        public async ValueTask<object> GetDetailPortalManagement( string serviceId)
        {
            var obj = await _context.SysServices.Where(x => x.ServiceId.Equals(serviceId)).FirstOrDefaultAsync();
            if (obj == null) return new SysException("serviceIdisnotexist", "Service ID is not exist");
            return obj;
        }
        public async ValueTask<object> UpdatePortalManagement(string? serviceId, string? serviceName, string? status, string? customerChannel, int checkUserAction, int timeRevokeToken, int timeShowCountDown, string actionType)
        {
            if (!actionType.Equals("ADD") && !actionType.Equals("EDIT"))
            {
                throw new SysException("page_action_invalid", "Invalid action");
            }

            var serviceInfo = await _context.SysServices.Where(x => x.ServiceId.Equals(serviceId)).FirstOrDefaultAsync();
            if (actionType.Equals("ADD"))
            {
                if (serviceInfo != null)
                {
                    throw new SysException("serviceidisexisted", "ServiceId is existed");
                }
                serviceInfo = new SysService { ServiceId = serviceId };
            }
            else
            {
                if (serviceInfo == null)
                {
                    throw new SysException("serviceidisnotexisted", "ServiceId is not existed");
                }
            }

            serviceInfo.ServiceName = serviceName;
            serviceInfo.Status = status.Equals("1") ? true : false;
            serviceInfo.CustomerChannel = customerChannel.Equals("1") ? true : false;
            serviceInfo.CheckUserAction = checkUserAction;
            serviceInfo.TimeRevokeToken = timeRevokeToken;
            serviceInfo.TimeShowCountDown = timeShowCountDown;
            serviceInfo.CompanyId = "";

            if (actionType.Equals("ADD"))
            {
                _context.SysServices.Add(serviceInfo);
            }
            await _context.SaveChangesAsync();
            return true;
        }
        public async ValueTask<object> DeletePortalManagement( dynamic serviceId)
        {
            JArray idArr = new JArray();
            
            if (serviceId is long)
            {
                idArr.Add(serviceId);
            }
            else
            {
                idArr = serviceId;
            }

            foreach (var item in idArr)
            {
                var record = _context.SysServices.AsQueryable().SingleOrDefault(x => x.ServiceId.Equals(item.ToString()));

                if (record != null)
                {
                    _context.SysServices.Remove(record);
                }
            }
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
