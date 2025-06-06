using ZiggyCreatures.Caching.Fusion;

namespace Biometrics.ApiService.Service
{
    public class FusionCacheService
    {
        private readonly IFusionCache _cache;

        public FusionCacheService(IFusionCache cache)
        {
            _cache = cache;
        }

        public async Task<string> GetDataAsync()
        {
            return await _cache.GetOrSetAsync<string>("key:user:42", async token =>
            {
                await Task.Delay(200); // mô phỏng lấy từ DB
                return "UserName from DB";
            });
        }
    }
}
