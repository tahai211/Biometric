namespace Biometrics.Web.ApiClient
{
    public class RoleApiClient
    {
        private readonly HttpClient _httpClient;

        public RoleApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Phương thức lấy danh sách Role Management
        public async Task<ApiResponse<dynamic>> GetListRoleManagementAsync(string? roleName, string? usertype, string? serviceId, int pageIndex = 0, int pageSize = 15, CancellationToken cancellationToken = default)
        {
            var queryParams = new Dictionary<string, string?>
            {
                { "roleName", roleName },
                { "usertype", usertype },
                { "serviceId", serviceId },
                { "pageIndex", pageIndex.ToString() },
                { "pageSize", pageSize.ToString() }
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/role/list", queryParams, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while fetching role list", ex);
            }
            return apiResponse;
        }

        // Phương thức lấy chi tiết Role Management
        public async Task<ApiResponse<dynamic>> GetDetailRoleManagementAsync(int roleId, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/role/view", new { roleId }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while fetching role detail", ex);
            }
            return apiResponse;
        }

        // Phương thức thêm Role Management
        public async Task<ApiResponse<dynamic>> AddRoleManagementAsync(int? roleId, string? roleName, string? serviceId, string? desc, string? usertype, string? userId, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                roleId,
                roleName,
                serviceId,
                desc,
                usertype,
                userId,
                action = "ADD"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/role/add", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while adding role", ex);
            }
            return apiResponse;
        }

        // Phương thức chỉnh sửa Role Management
        public async Task<ApiResponse<dynamic>> EditRoleManagementAsync(int? roleId, string? roleName, string? serviceId, string? desc, string? usertype, string? userId, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                roleId,
                roleName,
                serviceId,
                desc,
                usertype,
                userId,
                action = "EDIT"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/role/edit", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while editing role", ex);
            }
            return apiResponse;
        }

        // Phương thức xóa Role Management
        public async Task<ApiResponse<dynamic>> DeleteRoleManagementAsync(dynamic role, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/role/delete", new { role }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while deleting role", ex);
            }
            return apiResponse;
        }
    }
}
