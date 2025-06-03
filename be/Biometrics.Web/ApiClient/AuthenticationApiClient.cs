using System.Text;
using System.Security.Cryptography;
namespace Biometrics.Web.ApiClient
{
    public class AuthenticationApiClient
    {
        private readonly HttpClient _httpClient;

        public AuthenticationApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<dynamic> LoginAsync(string username, string password, CancellationToken cancellationToken = default)
        {
            var requestBody = new 
            {
                Username = username,
                Password = Sha256(password),
                ServiceId = "SYS"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/api/authen/login", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while logging in", ex);
            }
            return apiResponse;
        }
        public static string Sha256(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
        public async Task<dynamic> RefreshTokenAsync(string accessToken, string refreshToken, CancellationToken cancellationToken = default)
        {
            var requestBody = new 
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ServiceId = "SYS"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/api/authen/refreshtoken", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while refreshing token", ex);
            }
            return apiResponse;
        }
        public async Task<dynamic> RevokeTokenAsync(string token, string accessToken, CancellationToken cancellationToken = default)
        {
            var requestBody = new 
            {
                Token = token,
                AccessToken = accessToken,
                ServiceId = "SYS"
            };

            HttpResponseMessage response;
            ApiResponse<dynamic> apiResponse;
            try
            {
                response = await _httpClient.PostAsJsonAsync("/api/authen/revoketoken", requestBody, cancellationToken);
                apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<dynamic>>(cancellationToken: cancellationToken)
                    ?? throw new ApplicationException("Invalid response format");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error occurred while revoking token", ex);
            }
            return apiResponse;
        }


    }
}
