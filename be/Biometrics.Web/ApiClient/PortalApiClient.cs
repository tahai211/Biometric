namespace Biometrics.Web.ApiClient
{
    public class PortalApiClient
    {
        private readonly HttpClient _httpClient;

        public PortalApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Phương thức lấy danh sách Portal Management
        public async Task<ApiResponse<dynamic>> GetListPortalManagementAsync(string? portalName, string? portaiId, string? status, int pageSize = 0, int pageIndex = 1, CancellationToken cancellationToken = default)
        {
            var queryParams = new Dictionary<string, string?>
            {
                { "portalName", portalName },
                { "portaiId", portaiId },
                { "status", status },
                { "pageSize", pageSize.ToString() },
                { "pageIndex", pageIndex.ToString() }
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/portal/list", queryParams, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading portal list response", ex);
            }
            return apiResponse;
        }

        // Phương thức lấy chi tiết Portal Management
        public async Task<ApiResponse<dynamic>> GetDetailPortalManagementAsync(string serviceId, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/portal/view", new { serviceId }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading portal detail response", ex);
            }
            return apiResponse;
        }

        // Phương thức thêm mới Portal Management
        public async Task<ApiResponse<dynamic>> AddPortalManagementAsync(string? serviceId, string? serviceName, string? status, string? customerChannel, int checkUserAction, int timeRevokeToken, int timeShowCountDown, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                serviceId,
                serviceName,
                status,
                customerChannel,
                checkUserAction,
                timeRevokeToken,
                timeShowCountDown
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/portal/add", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while adding portal", ex);
            }
            return apiResponse;
        }

        // Phương thức chỉnh sửa Portal Management
        public async Task<ApiResponse<dynamic>> EditPortalManagementAsync(string? serviceId, string? serviceName, string? status, string? customerChannel, int checkUserAction, int timeRevokeToken, int timeShowCountDown, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                serviceId,
                serviceName,
                status,
                customerChannel,
                checkUserAction,
                timeRevokeToken,
                timeShowCountDown
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/portal/edit", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while editing portal", ex);
            }
            return apiResponse;
        }

        // Phương thức xóa Portal Management
        public async Task<ApiResponse<dynamic>> DeletePortalManagementAsync(dynamic serviceId, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/portal/delete", new { serviceId }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while deleting portal", ex);
            }
            return apiResponse;
        }
    }
}
