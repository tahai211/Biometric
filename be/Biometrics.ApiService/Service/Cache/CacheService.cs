using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CIMP.Infrastructure.Extensions;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Extensions;

namespace Biometrics.ApiService.Service.Cache
{
    public class CacheService : ICacheSerrvice
    {
        protected readonly AppDbContext _dbContext;
        protected readonly IDistributedCache _cache;
        public CacheService(AppDbContext dbContext, IDistributedCache cache)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }
        public async Task<List<dynamic>> GetPermission()
        {
            try
            {
                var cacheKey = "PERMISSION";
                Log.Information("Fetching data for key: {CacheKey} from cache.", cacheKey);
                //var cacheOptions = new DistributedCacheEntryOptions()
                //.SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
                //.SetSlidingExpiration(TimeSpan.FromMinutes(2));
                var dataCache = await _cache.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        Log.Information("Cache miss. fetching data for key: {CacheKey} from database.", cacheKey);
                        List<dynamic> data = new List<dynamic>
                        {
                            new
                            {
                                role_code = "ADMIN",
                                permission_code = "READ"
                            },
                            new
                            {
                                role_code = "ADMIN",
                                permission_code = "WRITE"
                            },
                            new
                            {
                                role_code = "USER",
                                permission_code = "READ"
                            }
                        };

                        return data;
                    },
                    null);
                if (dataCache == null) dataCache = new List<dynamic>();
                return dataCache!;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "GetPermission: ");
                throw new Exception(ex.Message);
            }
        }
        public async Task ReloadCachePermission()
        {
            try
            {
                _cache.Remove("PERMISSION");
                await GetPermission();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "ReloadCachePermission: ");
                throw new Exception(ex.Message);
            }
        }
    }
}
