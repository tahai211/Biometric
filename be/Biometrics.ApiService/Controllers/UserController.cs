using Microsoft.AspNetCore.Mvc;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Models.User;
using Biometrics.ApiService.Service.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Biometrics.ApiService.Service.Policy;
using Biometrics.ApiService.Infra.Constans;

namespace Biometrics.ApiService.Controllers
{
    [ApiController]
    [Route("user")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("list")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetListUserManagement(string? serviceId, string? status, string? userName, string? name, string? branch, string? email, string? phoneNo, string? companyId, int pageIndex = 1, int pageSize = 0)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var listUser = await _userService.GetListUser(serviceId,status,userName,  name, branch,email,phoneNo, companyId,pageIndex, pageSize);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, listUser, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("view")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetDetailUserManagement(string userId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var userDetail = await _userService.GetDetailUser( userId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, userDetail, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("edit")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> EditUserManagement([FromBody] UserManagementRequest request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var editUser = await _userService.UpdateUser(
                    request.UserName, request.Password, request.FirstName, request.MiddleName, request.LastName,
                    request.Gender, request.Email, request.PhoneNo, request.Birthday, request.Address, request.Branch,
                    request.Policy, request.RolesBO, request.RolesRPT, request.RoleThirdparty, request.CompanyId, request.Id,
                    request.UserType, request.AutoGenPass, request.Typesend, "EDIT", request.UserNameCbs, request.EmployeeId,
                    request.ServiceId, request.SourceId, request.Tokencbs);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, editUser, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }

        [HttpPost("add")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> AddUserManagement([FromBody] UserManagementRequest request)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var addUser = await _userService.UpdateUser(
                    request.UserName, request.Password, request.FirstName, request.MiddleName, request.LastName,
                    request.Gender, request.Email, request.PhoneNo, request.Birthday, request.Address, request.Branch,
                    request.Policy, request.RolesBO, request.RolesRPT, request.RoleThirdparty, request.CompanyId, request.Id,
                    request.UserType, request.AutoGenPass, request.Typesend, "ADD", request.UserNameCbs, request.EmployeeId,
                    request.ServiceId, request.SourceId, request.Tokencbs);

                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, addUser, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }

        [HttpPost("Delete")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> DeleteUserManagement(dynamic userIds)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var deleteUser = await _userService.DeleteUser(userIds);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, deleteUser, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex)
            {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }
    }
}
