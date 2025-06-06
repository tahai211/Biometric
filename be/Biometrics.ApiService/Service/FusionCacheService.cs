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
        public async Task SetDataAsync()
        {
            var cachedValue1 = await _cache.GetOrSetAsync(
                "hello123",
                async entry =>
                {
                    // Mục đích thông thường: gọi DB, hoặc API, rồi return kết quả.
                    // Ở đây chỉ đơn giản trả "world".
                    await Task.CompletedTask;
                    return "world";
                },
                options: new FusionCacheEntryOptions
                {
                    Duration = TimeSpan.FromMinutes(1) // TTL riêng cho key này
                }
            );
        }

        public async Task<string> GetDataAsync()
        {
            //return await _cache.GetOrSetAsync<string>("key:user:42", async token =>
            //{
            //    await Task.Delay(200); // mô phỏng lấy từ DB
            //    return "UserName from DB";
            //});


            var tryGet = await _cache.TryGetAsync<string>("hello123");
            if (tryGet.HasValue)
            {
                Console.WriteLine($"[TryGetAsync] Lấy được từ cache: \"{tryGet.Value}\"");
            }
            else
            {
                Console.WriteLine($"[TryGetAsync] Key \"hello\" chưa tồn tại trong cache.");
            }
            var directGet = await _cache.GetOrDefaultAsync<string>("hello123");
            return directGet;

        }
        public async Task RemoveDataAsync()
        {
            await _cache.RemoveAsync("hello");

            //var afterRemove = await _cache.TryGetAsync<string>("hello");
        }
    }
}
