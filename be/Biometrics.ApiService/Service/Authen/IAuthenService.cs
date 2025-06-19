using Biometrics.ApiService.DTO.ResponseDTO;

namespace Biometrics.ApiService.Service.Authen
{
    public interface IAuthenService
    {
        ValueTask<LoginResponseDTO> Authentication(string userName, string passWord, string serviceId);
        ValueTask<LoginResponseDTO> RefreshToken(string refreshToken, string serviceId);
    }
}
