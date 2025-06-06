namespace Biometrics.ApiService.Service.Cache
{
    public interface ICacheSerrvice
    {
        Task<List<dynamic>> GetPermission();
        Task ReloadCachePermission();
    }
}
