namespace Biometrics.Web.ApiClient
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;

        public UserApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Phương thức lấy danh sách User Management
        public async Task<ApiResponse<dynamic>> GetListUserManagementAsync(string? serviceId, string? status, string? userName, string? name, string? branch, string? email, string? phoneNo, string? companyId, int pageIndex = 1, int pageSize = 0, CancellationToken cancellationToken = default)
        {
            var queryParams = new Dictionary<string, string?>
            {
                { "serviceId", serviceId },
                { "status", status },
                { "userName", userName },
                { "name", name },
                { "branch", branch },
                { "email", email },
                { "phoneNo", phoneNo },
                { "companyId", companyId },
                { "pageIndex", pageIndex.ToString() },
                { "pageSize", pageSize.ToString() }
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/user/list", queryParams, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while fetching user list", ex);
            }
            return apiResponse;
        }

        // Phương thức lấy chi tiết User Management
        public async Task<ApiResponse<dynamic>> GetDetailUserManagementAsync(string userId, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/user/view", new { userId }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while fetching user details", ex);
            }
            return apiResponse;
        }

        // Phương thức thêm User Management
        public async Task<ApiResponse<dynamic>> AddUserManagementAsync(UserManagementRequest request, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/user/add", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while adding user", ex);
            }
            return apiResponse;
        }

        // Phương thức chỉnh sửa User Management
        public async Task<ApiResponse<dynamic>> EditUserManagementAsync(UserManagementRequest request, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/user/edit", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while editing user", ex);
            }
            return apiResponse;
        }

        // Phương thức xóa User Management
        public async Task<ApiResponse<dynamic>> DeleteUserManagementAsync(dynamic userIds, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/user/delete", new { userIds }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while deleting user", ex);
            }
            return apiResponse;
        }
    }

    public class UserManagementRequest
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? PhoneNo { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Address { get; set; }
        public string? Branch { get; set; }
        public string? Policy { get; set; }
        public string? RolesBO { get; set; }
        public string? RolesRPT { get; set; }
        public string? RoleThirdparty { get; set; }
        public string? CompanyId { get; set; }
        public string? Id { get; set; }
        public string? UserType { get; set; }
        public bool AutoGenPass { get; set; }
        public string? Typesend { get; set; }
        public string? UserNameCbs { get; set; }
        public string? EmployeeId { get; set; }
        public string? ServiceId { get; set; }
        public string? SourceId { get; set; }
        public string? Tokencbs { get; set; }
    }
}
