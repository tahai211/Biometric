using Newtonsoft.Json;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Biometrics.Web.ApiClient
{
    public class PolicyApiClient
    {
        private readonly HttpClient _httpClient;

        public PolicyApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Phương thức lấy danh sách Policy Management
        public async Task<ApiResponse<dynamic>> GetListPolicyManagementAsync(string? accessGroupId, string? desc, string? isCms, int pageIndex = 1, int pageSize = 0, CancellationToken cancellationToken = default)
        {
            var requestBody = new { accessGroupId, desc, isCms, pageIndex, pageSize } ;
            var temp = Common.ServerEncrypt(JsonConvert.SerializeObject(requestBody), "application/json");


            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/policy/list", temp, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy list response", ex);
            }
            return apiResponse;
        }

        // Phương thức lấy chi tiết Policy Management
        public async Task<ApiResponse<dynamic>> GetDetailPolicyManagementAsync(int policyId, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/policy/view", new { policyId }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while reading policy detail response", ex);
            }
            return apiResponse;
        }

        // Phương thức chỉnh sửa Policy Management
        public async Task<ApiResponse<dynamic>> EditPolicyManagementAsync(int? policyId, string? description, string? efFrom, string? efTo, string? ctmTypeId, string? accessGroupId, int? pwHis,
            int? pwAge, int? pwMinLength, int? pwMaxLength, bool pwComplex, bool pwLowerCase, bool pwUpperCase, bool pwSymbols, bool pwNumber, int resetPwTime,
            string accessTimeFrom, string accessTimeTo, int failAccessNumber, string userId, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                policyId,
                description,
                efFrom,
                efTo,
                ctmTypeId,
                accessGroupId,
                pwHis,
                pwAge,
                pwMinLength,
                pwMaxLength,
                pwComplex,
                pwLowerCase,
                pwUpperCase,
                pwSymbols,
                pwNumber,
                resetPwTime,
                accessTimeFrom,
                accessTimeTo,
                failAccessNumber,
                userId,
                action = "EDIT"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/policy/edit", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while editing policy", ex);
            }
            return apiResponse;
        }

        // Phương thức thêm mới Policy Management
        public async Task<ApiResponse<dynamic>> AddPolicyManagementAsync(int? policyId, string? description, string? efFrom, string? efTo, string? ctmTypeId, string? accessGroupId, int? pwHis,
            int? pwAge, int? pwMinLength, int? pwMaxLength, bool pwComplex, bool pwLowerCase, bool pwUpperCase, bool pwSymbols, bool pwNumber, int resetPwTime,
            string accessTimeFrom, string accessTimeTo, int failAccessNumber, string userId, CancellationToken cancellationToken = default)
        {
            var requestBody = new
            {
                policyId,
                description,
                efFrom,
                efTo,
                ctmTypeId,
                accessGroupId,
                pwHis,
                pwAge,
                pwMinLength,
                pwMaxLength,
                pwComplex,
                pwLowerCase,
                pwUpperCase,
                pwSymbols,
                pwNumber,
                resetPwTime,
                accessTimeFrom,
                accessTimeTo,
                failAccessNumber,
                userId,
                action = "ADD"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/policy/add", requestBody, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while adding policy", ex);
            }
            return apiResponse;
        }

        // Phương thức xóa Policy Management
        public async Task<ApiResponse<dynamic>> DeletePolicyManagementAsync(dynamic ids, CancellationToken cancellationToken = default)
        {
            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/policy/delete", new { ids }, cancellationToken);
                response.EnsureSuccessStatusCode();
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while deleting policy", ex);
            }
            return apiResponse;
        }
    }
}
