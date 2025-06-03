using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Models.User;
using Biometrics.ApiService.Service.Portal;
using Biometrics.ApiService.Service.User;
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
    [Route("portal")]
    public class PortalController : ControllerBase
    {
        private readonly IPortalService _portalService;
        public PortalController(IPortalService portalService)
        {
            this._portalService = portalService;
        }

        [HttpPost("list")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetListPortalManagement(string? portalName, string? portaiId, string? status, int pageSize = 0, int pageIndex = 1)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var lsiPortal = await _portalService.GetListPortalManagement(portalName, portaiId, status, pageSize, pageIndex);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, lsiPortal, ResposeType.ApplicationJson);
                return Ok(httpResponseExtensions);
            }
            catch (Exception ex) {
                var responeResult = new HttpBase(HttpStatusCode.BadRequest, ex.Message);
                return BadRequest(responeResult);
            }
        }
        [HttpPost("view")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetDetailPortalManagement(string serviceId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var portalInfo = await _portalService.GetDetailPortalManagement(serviceId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, portalInfo, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> AddPortalManagement(string? serviceId, string? serviceName, string? status, string? customerChannel, int checkUserAction, int timeRevokeToken, int timeShowCountDown)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var portalAdd = await _portalService.UpdatePortalManagement(serviceId, serviceName, status, customerChannel, checkUserAction, timeRevokeToken, timeShowCountDown, "ADD");
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, portalAdd, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> EditPortalManagement(string? serviceId, string? serviceName, string? status, string? customerChannel, int checkUserAction, int timeRevokeToken, int timeShowCountDown)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var portalEdit = await _portalService.UpdatePortalManagement(serviceId, serviceName, status, customerChannel, checkUserAction, timeRevokeToken, timeShowCountDown, "EDIT");
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, portalEdit, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> DeletePortalManagement(dynamic serviceId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var portalDelete = await _portalService.DeletePortalManagement(serviceId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK,  portalDelete, ResposeType.ApplicationJson);
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
