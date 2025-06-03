using Microsoft.AspNetCore.Mvc;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Service.Portal;
using Biometrics.ApiService.Service.Role;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Biometrics.ApiService.Infra.Constans;

namespace Biometrics.ApiService.Controllers
{

    [ApiController]
    [Route("role")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService roleService)
        {
            this._roleService = roleService;
        }

        [HttpPost("list")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetListRoleManagement(string? roleName, string? usertype, string? serviceId, int pageIndex = 0, int pageSize = 15)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var lsiRole = await _roleService.GetListRoleManagement(roleName, usertype, serviceId, pageIndex, pageSize);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, lsiRole, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> GetDetailRoleManagement(int roleId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var detailRole = await _roleService.GetDetailRoleManagement(roleId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, detailRole, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> AddRoleManagement(int? roleId, string? roleName, string? serviceId, string? desc, string? usertype, string? userId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var addRole = await _roleService.UpdateRoleManagement(roleId, roleName, serviceId, desc, usertype, userId, "ADD");
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, addRole, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> EditRoleManagement(int? roleId, string? roleName, string? serviceId, string? desc, string? usertype, string? userId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var editRole = await _roleService.UpdateRoleManagement(roleId, roleName, serviceId, desc, usertype, userId, "EDIT");
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, editRole, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> DeleteRoleManagement(dynamic role)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var deleteRole = await _roleService.DeleteRoleManagement(role);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK,  deleteRole, ResposeType.ApplicationJson);
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
