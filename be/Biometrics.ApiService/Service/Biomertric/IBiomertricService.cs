using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Service.Biomertric
{
    public interface IBiomertricService 
    {
        ValueTask<string> RegisterBiomertric(string? faceData, string? userName, string? firstName, string? middleName, string? lastName, string? gender, string? email, string? phoneNo,string? password);
        ValueTask<object> RegenerateQR(string name, string phone,string password, string faceData);
        ValueTask<object> PositivelyBiomertric(string faceData, string dataQR);
        ValueTask<object> ListRegenerateQR(string? userId, int pageIndex = 1, int pageSize = 0);
        ValueTask<string> ApproveRegenerateQR(int? Id);
        ValueTask<bool> RejectRegenerateQR(int? Id);
    }
}
