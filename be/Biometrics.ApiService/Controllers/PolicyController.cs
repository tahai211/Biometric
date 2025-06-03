using Microsoft.AspNetCore.Mvc;
using Biometrics.ApiService.Infra.Attributes;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Service.Policy;
using Biometrics.ApiService.Service.Portal;
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
    [Route("policy")]
    public class PolicyController : ControllerBase
    {
        private readonly IPolicyService _policyService;
        public PolicyController(IPolicyService policyService)
        {
            this._policyService = policyService;
        }

        [HttpPost("list")]
        [Check(checkRole: false, checkToken: false)]
        public async Task<IActionResult> GetListPolicyManagement(string? accessGroupId, string? desc, string? isCms, int pageIndex = 1, int pageSize = 0)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var lstPolicy = await _policyService.GetListPolicyManagement(accessGroupId, desc, isCms, pageIndex, pageSize);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, lstPolicy, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> GetDetailPolicyManagement(int policyId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var policyInfo = await _policyService.GetDetailPolicyManagement(policyId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, policyInfo, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> EditPolicyManagement(int? policyId, string? description, string? efFrom, string? efTo, string? ctmTypeId, string? accessGroupId, int? pwHis,
    int? pwAge, int? pwMinLength, int? pwMaxLength, bool pwComplex, bool pwLowerCase, bool pwUpperCase, bool pwSymbols, bool pwNumber, int resetPwTime,
    string accessTimeFrom, string accessTimeTo, int failAccessNumber, string userId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var updatePolicy = await _policyService.UpdatePolicyManagement(policyId, description, efFrom, efTo, ctmTypeId, accessGroupId, pwHis,
     pwAge, pwMinLength, pwMaxLength, pwComplex, pwLowerCase, pwUpperCase, pwSymbols, pwNumber, resetPwTime,
     accessTimeFrom, accessTimeTo, failAccessNumber, "EDIT", userId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, updatePolicy, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> AddPolicyManagement(int? policyId, string? description, string? efFrom, string? efTo, string? ctmTypeId, string? accessGroupId, int? pwHis,
    int? pwAge, int? pwMinLength, int? pwMaxLength, bool pwComplex, bool pwLowerCase, bool pwUpperCase, bool pwSymbols, bool pwNumber, int resetPwTime,
    string accessTimeFrom, string accessTimeTo, int failAccessNumber, string userId)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var updatePolicy = await _policyService.UpdatePolicyManagement( policyId,  description,  efFrom, efTo,  ctmTypeId, accessGroupId, pwHis,
     pwAge, pwMinLength, pwMaxLength, pwComplex, pwLowerCase, pwUpperCase, pwSymbols, pwNumber, resetPwTime,
     accessTimeFrom, accessTimeTo, failAccessNumber, "ADD", userId);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK, updatePolicy, ResposeType.ApplicationJson);
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
        public async Task<IActionResult> DeletePolicyManagement(dynamic ids)
        {
            try
            {
                HttpBase httpResponseExtensions = null;
                var deletePolicy = await _policyService.DeletePolicyManagement(ids);
                httpResponseExtensions = new HttpBase(HttpStatusCode.OK,  deletePolicy, ResposeType.ApplicationJson);
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
