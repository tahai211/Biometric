namespace Biometrics.Web
{
    using System.Security.Claims;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components.Authorization;
    using System.IdentityModel.Tokens.Jwt;

    public class CustomAuthStateProvider : AuthenticationStateProvider
    {
        private readonly HttpClient _httpClient;

        public CustomAuthStateProvider(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            // Replace with your actual token retrieval logic
            var token = await GetTokenFromLocalStorageAsync();

            if (string.IsNullOrEmpty(token))
            {
                // No token found, return anonymous user
                return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity()));
            }

            // Validate token and extract claims
            var claims = GetClaimsFromToken(token);
            var identity = new ClaimsIdentity(claims, "jwt");
            var user = new ClaimsPrincipal(identity);

            return new AuthenticationState(user);
        }

        private async Task<string> GetTokenFromLocalStorageAsync()
        {
            // Retrieve the token from local storage or another secure location
            // This is just an example; adjust it based on your actual token storage implementation
            return await Task.FromResult("");
        }

        private IEnumerable<Claim> GetClaimsFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            return jwtToken.Claims;
        }

        public async Task MarkUserAsAuthenticated(string token)
        {
            // Optionally, store the token in local storage or a similar location
            // Notify the Blazor app of the authentication change
            var claims = GetClaimsFromToken(token);
            var identity = new ClaimsIdentity(claims, "jwt");
            var user = new ClaimsPrincipal(identity);

            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(user)));
        }

        public void MarkUserAsLoggedOut()
        {
            // Optionally, clear the token from local storage or similar
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity()))));
        }
    }

}
