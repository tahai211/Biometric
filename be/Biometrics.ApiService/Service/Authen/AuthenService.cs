using Biometrics.ApiService.Data;
using Biometrics.ApiService.DTO.Entity;
using Biometrics.ApiService.DTO.ResponseDTO;
using Biometrics.ApiService.Infra.Common;
using Biometrics.ApiService.Infra.Common.HttpCustom;
using Biometrics.ApiService.Infra.Constans;
using MassTransit.Mediator;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using OpenCvSharp;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Biometrics.ApiService.Service.Authen
{
    public class AuthenService : IAuthenService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthenService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async ValueTask<LoginResponseDTO> Authentication(string userName, string passWord, string serviceId)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(passWord))
            {

            }
            var service = await _context.SysServices.Where(x => x.ServiceId == serviceId).FirstOrDefaultAsync();
            if (service == null)
            {
                throw new SysException("serviceisnull", "Service is null");
            }
            var timeCheckUserAtion = service.CheckUserAction;
            var timeRevokeToken = service.TimeRevokeToken;
            var timeShowCountDown = service.TimeShowCountDown;
            var timeNow = DateTime.Now;
            bool changePwAge = false;
            var loginInfo = await _context.SysLoginInfos.AsQueryable()
             .Where(x => x.LoginName == userName && x.ServiceId == serviceId && x.Status != UserStatus.Delete)
             .Join(_context.SysUserLogins.AsQueryable(), login => login.LoginId, user => user.LoginId, (login, user) => new { login, user })
             .FirstOrDefaultAsync();
            if (loginInfo == null)
            {
                throw new SysException("accountnotsupported", "Your account is not supported by this service, please contact the nearest bank for more support.");
            }
            if (((string)loginInfo.login.Status) != UserStatus.Active)
            {
                throw new SysException("userloginfailnotactive", "Login failed, user is not active");
            }

            #region Check Policy
            var policy = await _context.SysPolicies.Where(m => m.PolicyId == loginInfo.login.PolicyId).SingleOrDefaultAsync();
            if (DateTime.Compare(timeNow, policy.EfFrom ?? timeNow) == -1 || DateTime.Compare(policy.EfTo ?? timeNow, timeNow) == -1)
            {
                throw new SysException("expiredpolicy", "Please contact to Bank");
            }
            if (TimeSpan.Compare(policy.AccessTimeFrom, timeNow.TimeOfDay) == 1 || TimeSpan.Compare(timeNow.TimeOfDay, policy.AccessTimeTo) == 1)
            {
                throw new SysException("time_invalid_from_to", "You can only login from {timeFrom} to {timeTo}.Please try later", new { timeFrom = policy.AccessTimeFrom, timeTo = policy.AccessTimeTo });
            }
            // ngăn việc login thất bại quá nhiều lần...
            if (loginInfo.login.FailNumber != 0 && loginInfo.login.FailNumber >= policy.FailAccessNumber)
            {
                if (policy.ResetPwTime == 0 || loginInfo.login.LastLoginFail == null)
                {
                    throw new SysException("accounthavelocked", "Your account has been disabled because of failed login times is over regulations of Bank");
                }
                else
                {
                    TimeSpan peroidTime = (timeNow - (DateTime)loginInfo.login.LastLoginFail);
                    var remainingTime = policy.ResetPwTime * 60 - peroidTime.TotalSeconds;
                    if (remainingTime > 0)
                    {
                        throw new SysException("fail_number_excess_at_time", "Plese try again after {duration} seconds", new { duration = (int)remainingTime });

                    }
                }
            }
            #endregion

            #region Check login password Biometric
            var login = await _context.SysLoginInfos
                   .Where(m => m.LoginId == loginInfo.login.LoginId && m.ServiceId == serviceId)
                   .SingleOrDefaultAsync();
            // check token (nếu token truyền vào k giống trong DB => fail)    
            //if (!string.IsNullOrEmpty(BiometricToken))
            //{
            //    AuthenticationUtility.AuthenticationResult authenticationResult = await new AuthenticationUtility.BioMetricToken().Authenticate(loginInfo.user.UserId, serviceId, deviceId, BiometricToken, context);
            //    if (!authenticationResult.AuthenResult)
            //    {
            //        login.FailNumber += 1;
            //        login.LastLoginFail = DateTime.Now;
            //        login.BiometricToken = string.Empty; //Fiona - clear biometric when biotoken is fail
            //        await _context.SaveChangesAsync();
            //        throw new SysException("unauthorizationbiometric", "Biometric method is invalid on your device. Please login by your password.");
            //    }
            //}
            if (!string.IsNullOrEmpty(passWord))
            {
                var passString = Encryption.EncryptPassword(loginInfo.login.LoginId, passWord);
                var pass = await _context.SysPasswords.AsQueryable()
                    .Where(x => x.LoginId == loginInfo.login.LoginId && x.ServiceId == serviceId
                        && x.Type == loginInfo.login.AuthenType && x.Password == passString)
                    .SingleOrDefaultAsync();

                if (pass == null)
                {
                    login.FailNumber += 1;
                    login.LastLoginFail = DateTime.Now;
                    await _context.SaveChangesAsync();
                    throw new SysException("unauthorization", "Login information is not correct");
                }
            }
            else
            {
               // throw new SysException("unauthorization", "Login information is not correct");
            }
            #endregion

            #region check password age

            //var PwLastChange = _context.SysPasswordHis
            //    .Where(x => x.LoginId == loginInfo.user.LoginId && x.Type.ToUpper() == loginInfo.login.AuthenType && x.ServiceId == serviceId)
            //    .OrderByDescending(x => x.ChangeTimeNumber)
            //    .FirstOrDefault();
            //if (policy.PwAge > 0 && PwLastChange != null)
            //{
            //    if (PwLastChange.DateModified == null) changePwAge = true;
            //    else
            //    {
            //        TimeSpan peroidTimes = (timeNow - (DateTime)PwLastChange.DateModified);
            //        changePwAge = (policy.PwAge - Math.Floor(peroidTimes.TotalDays)) <= 0;
            //    }
            //}
            #endregion

            #region Get Info User
            var user = await _context.SysUsers.AsQueryable()
                    .Where(x => x.UserId == loginInfo.user.UserId && x.Status == UserStatus.Active)
                    .SingleOrDefaultAsync();
            //var branchInfo = (await IdpCaching.GetObjectAsync("Idp_Branch", user.BranchCode, bankCode));
            //if (branchInfo != null) branchName = branchInfo.BranchName;
            // log thông tin đăng nhập vào historyLogin & loginInfor
            login.FailNumber = 0;
            login.LastLoginTime = DateTime.Now;
            bool checksendMail = false; //checkNewDevice ? true : false;
            //bool checkOTP = isMBIBBO(serviceId) && isNewDevice(deviceId, login.DeviceId);
            //bool checkNewDevice = isNewDevice(deviceId, login.DeviceId);
            //var checkOldDevice = login.DeviceId;
            //ImgAvatar = user.Avatar == null ? (await IdpCaching.GetObjectAsync("Sys_Variables", "IMG_AVATAR_DEFAIL")).Value : user.Avatar;
            //var loginhisInfo = new SysLoginHistory();
            //loginhisInfo.UserId = loginInfo.user.UserId;
            //loginhisInfo.LoginTime = DateTime.Now;
            //loginhisInfo.ServiceId = serviceId;
            //loginhisInfo.DeviceInfo = "deviceInfo";
            //loginhisInfo.IpAddress = "address";
            //loginhisInfo.Location = "Not Found";
            //_context.SysLoginHistories.Add(loginhisInfo);
            
            var tokenExp = StaticVariable.ExpiresToken * 3600;
            var refTokenExp = StaticVariable.ExpiresToken * 24 * 3600;
            var Token = await GenToken(userName, tokenExp);
            var RefreshToken = await GenRefreshToken();

            // Lưu refresh token vào DB
            var tokennew = new SysUserAccessToken();
            tokennew.Data = "";
            tokennew.UserId = loginInfo.user.UserId;
            tokennew.Service = serviceId;
            tokennew.Token = RefreshToken;
            tokennew.ExpiredDate = DateTime.Now.AddSeconds(refTokenExp); ;
            tokennew.Status = UserStatus.Active;
            //await _context.SysUserAccessTokens.AddAsync(tokennew);
            _context.SysUserAccessTokens.Add(tokennew);
            _context.SaveChanges();
            return new LoginResponseDTO
            {
                Result = true,
                UserId = loginInfo.user.UserId,
                TempToken = false,
                Token = Token,
                RefreshToken = RefreshToken,
                refresh_token_expires_in = refTokenExp,
                expires_in = tokenExp,
                UserInfo = new UserInfoDTO
                {
                    CheckSendMail = checksendMail,
                    PhoneNo = user.PhoneNo,
                    FullName = user.FullName,
                    Email = user.Email,
                    Image = "ImgAvatar",
                    NeedOTP = false,
                    LastLogin = loginInfo.login.LastLoginTime,
                    HavePin = false,
                    Biometric = false,
                    FirstLogin = (bool)loginInfo.login.NewLogin || changePwAge,
                    IsNewDevice = false,
                    TimeCheckUserAction = timeCheckUserAtion, // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                    TimeRevokeToken = timeRevokeToken, // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                    TimeShowCountDown = timeShowCountDown // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                }
            };

            #endregion

            #region Todo Check Device
            //var userInfo = await IdpCaching.GetObjectAsync("Ctm_Users", loginInfo.user.UserId);
            //if (!((string)userInfo.Status).Equals("A"))
            //    throw new SysException("userloginfailnotactive", "Login failed, user is not active");
            //var custInfo = await IdpCaching.GetObjectAsync("Ctm_CustInfo", (string)userInfo.CustId);
            //if (!((string)custInfo.Status).Equals("A"))
            //    throw new SysException("customerstatusisvalid", "Customer status is invalid");

            ////GiapTT 20240410 Trả thêm BranchName
            //var branchInfo = (await IdpCaching.GetObjectAsync("Idp_Branch", custInfo.BranchId, bankCode));
            //if (branchInfo != null) branchName = branchInfo.BranchName;
            //if (Authentication != null)
            //{
            //    string AuthenType = Authentication.AuthenType;
            //    string AuthenCode = Authentication.AuthenCode;
            //    string DeviceIdAuthen = userInfo.PhoneNo;
            //    login.DeviceId = deviceId;
            //    await AuthenticationUtility.AuthenTranForUserNotLogin(AuthenType, AuthenCode, loginInfo.user.UserId, DeviceIdAuthen, context);
            //    addLoginHis(_context, loginInfo.user.UserId, serviceId, clientInfo["UserAgent"].ToString(), clientInfo["IpAddress"].ToString(), string.Empty);
            //    await _context.SaveChangesAsync();
            //}
            //ImgAvatar = userInfo.Image == null ? (await IdpCaching.GetObjectAsync("Sys_Variables", "IMG_AVATAR_DEFAIL")).Value : userInfo.Image;
            //// first login or new device
            //bool checkOTP = isMBIBBO(serviceId) && isNewDevice(deviceId, login.DeviceId);
            ////BaoNT 21112023 Sửa checkChagepass check thêm changePwAge
            //bool checkChagepass = (bool)loginInfo.login.NewLogin || changePwAge;
            //bool checkNewDevice = isNewDevice(deviceId, login.DeviceId);
            //var checkOldDevice = login.DeviceId;
            //checksendMail = Authentication != null ? true : false;

            ////check role hunglt
            //var userInRole = await _context.SysUserInRoles.Where(x => x.UserId == loginInfo.user.UserId)
            //        .Join(_context.SysRoles.Where(c => c.ServiceId == serviceId), user => user.RoleId, role => role.RoleId, (user, role) => new { role }).FirstOrDefaultAsync();
            //if (userInRole == null) throw new SysException("usernothaveservicerole", "Your user is not supported by this banking service. Please contact the nearest bank for further support.");

            ////
            //if (loginInfo.login.NewLogin == true || isNewDevice(deviceId, login.DeviceId))
            //{
            //    bool otp = isMulti == true ? false : checkOTP;
            //    if (serviceId == "MB" && otp)
            //    {
            //        login.BiometricToken = "";
            //    }
            //    // log thông tin đăng nhập vào historyLogin & loginInfor
            //    login.FailNumber = 0;
            //    login.LastLoginTime = DateTime.Now;

            //    // addLoginHis(_context, loginInfo.user.UserId, serviceId, clientInfo["UserAgent"].ToString(), clientInfo["IpAddress"].ToString(), string.Empty);
            //    await _context.SaveChangesAsync();
            //    return new
            //    {
            //        result = true,
            //        userId = loginInfo.user.UserId,
            //        companyId = string.Empty,
            //        tempToken = true,
            //        flagNewDevice = true,
            //        userInfo = new
            //        {
            //            infoLogin = new
            //            {
            //                ip = clientInfo["IpAddress"].ToString(),
            //                logintime = (DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss"),
            //                channel = service.ServiceName,
            //                device = clientInfo["UserAgent"].ToString(),

            //            },
            //            custType = custInfo.CtmTypeId,
            //            //GiapTT 04032024 - Thêm BranchCode và BranchName
            //            branchCode = custInfo.BranchId,
            //            branchName = branchName,
            //            allowPincode = AllowPincode,
            //            checksendmail = checksendMail,
            //            tempToken = true,
            //            phoneNo = userInfo.PhoneNo,
            //            fullName = userInfo.FullName,
            //            image = ImgAvatar,
            //            imageUrl = imgUrl + "|" + ImgAvatar,
            //            needOTP = isMulti == true ? false : checkOTP,
            //            firstLogin = checkChagepass,
            //            lastLogin = loginInfo.login.LastLoginTime,
            //            isNewDevice = checkNewDevice,
            //            old_device = checkOldDevice,
            //            //multiProfile = isMulti,
            //            email = userInfo.Email,
            //            //HaiTX trả thêm default account và company 
            //            DefaultAcct = new
            //            {
            //                AccountNo = userInfo.DefaultAccount,
            //                companyId = (await IdpCaching.GetObjectAsync("Ctm_CustAccount", (string)userInfo.CustId, (string)userInfo.DefaultAccount)) != null ? (string)(await IdpCaching.GetObjectAsync("Ctm_CustAccount", (string)userInfo.CustId, (string)userInfo.DefaultAccount)).CompanyId : string.Empty,
            //            },
            //            //GiapTT - 04-08-2023 trả ra list Profile
            //            lstProfile = genlistUserInfo(_context, usermulti.Select(x => x.UserId).ToArray()),

            //            //GiapTT them biến time check
            //            timeCheckUserAtion = timeCheckUserAtion,
            //            timeRevokeToken = timeRevokeToken,
            //            timeShowCountDown = timeShowCountDown,
            //            //serviceName = serviceId,
            //        },
            //    };
            //}
            //else//HaiTX gộp trường hợp k newLogin and newDevice
            //{

            //    addLoginHis(_context, loginInfo.user.UserId, serviceId, clientInfo["UserAgent"].ToString(), clientInfo["IpAddress"].ToString(), string.Empty);
            //    login.FailNumber = 0;
            //    login.LastLoginTime = DateTime.Now;
            //    await _context.SaveChangesAsync();
            //    return new
            //    {
            //        result = true,
            //        userId = loginInfo.user.UserId,
            //        companyId = string.Empty,
            //        tempToken = loginInfo.login.NewLogin,
            //        userInfo = new
            //        {
            //            infoLogin = new
            //            {
            //                ip = clientInfo["IpAddress"].ToString(),
            //                logintime = (DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss"),
            //                channel = service.ServiceName,
            //                device = clientInfo["UserAgent"].ToString(),

            //            },
            //            custType = custInfo.CtmTypeId,
            //            //GiapTT 04032024 - Thêm BranchCode và BranchName
            //            branchCode = custInfo.BranchId,
            //            branchName = branchName,
            //            allowPincode = AllowPincode,
            //            checksendmail = checksendMail,
            //            tempToken = loginInfo.login.NewLogin,
            //            phoneNo = userInfo.PhoneNo,
            //            fullName = userInfo.FullName,
            //            email = userInfo.Email,
            //            image = ImgAvatar,
            //            imageUrl = imgUrl + "|" + ImgAvatar,
            //            needOTP = isMulti == true ? false : checkOTP,
            //            firstLogin = checkChagepass,
            //            lastLogin = loginInfo.login.LastLoginTime,
            //            isNewDevice = checkNewDevice,
            //            //serviceName = serviceId,
            //            //current_device = deviceId,
            //            old_device = checkOldDevice,
            //            //isMBIBBO = isMBIBBO(serviceId),
            //            authentypeUser = AuthentypeUser,
            //            havePin = HavePin,
            //            changePwAge = changePwAge,
            //            //HaiTX trả thêm default account và company 
            //            DefaultAcct = new
            //            {
            //                AccountNo = userInfo.DefaultAccount,
            //                companyId = (await IdpCaching.GetObjectAsync("Ctm_CustAccount", (string)userInfo.CustId, (string)userInfo.DefaultAccount)) != null ? (string)(await IdpCaching.GetObjectAsync("Ctm_CustAccount", (string)userInfo.CustId, (string)userInfo.DefaultAccount)).CompanyId : string.Empty,
            //            },
            //            //multiProfile = isMulti,
            //            flagNewDevice = true,
            //            lstProfile = genlistUserInfo(_context, usermulti.Select(x => x.UserId).ToArray()),
            //            //GiapTT them biến time check
            //            timeCheckUserAtion = timeCheckUserAtion,
            //            timeRevokeToken = timeRevokeToken,
            //            timeShowCountDown = timeShowCountDown,

            //        },
            //    };
            //}
            #endregion
        }
        //private async Task SaveRefreshToken(string serviceId, string UserId, string refreshToken, int refTokenExp)
        //{
        //    var tokennew = new SysUserAccessToken();
        //    tokennew.Id = 1;
        //    tokennew.Data = "";
        //    tokennew.UserId = UserId;
        //    tokennew.Service = serviceId;
        //    tokennew.Token = refreshToken;
        //    tokennew.ExpiredDate = DateTime.Now.AddSeconds(refTokenExp); ;
        //    tokennew.Status = UserStatus.Active;
        //    await _context.SysUserAccessTokens.AddAsync(tokennew);
        //    await _context.SaveChangesAsync();

        //}
        public static async Task<string> GenToken(string userName, int token_exp)
        {
            var claims = new List<Claim>
                {
                    new Claim("username", userName),
                    new Claim("fullname", ""),
                    new Claim("branhcode",""),
                    new Claim("branhname", ""),
                    new Claim("officetype", ""),
                };
            //if (_userRole != null && _userRole.Count() > 0)
            //{
            //    foreach (var item in _userRole)
            //    {
            //        claims.Add(new Claim("userroles", item.role_code));
            //    }
            //}
            //else claims.Add(new Claim("userroles", ""));

            var tokenHandler = new JwtSecurityTokenHandler();
            var secret_key = Utils.Decrypt("+arHJCPbufxUMph1EWaLZywInX3IEJX0KTC6itmActbJds7ZkdI9kg==", true);
            //var secret_keyqq = Utils.Encrypt("cimp_techplus_coopbank_202520255", true);
            var key = Encoding.ASCII.GetBytes(secret_key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddSeconds(token_exp),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var Token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
            return Token;
        }

        public async ValueTask<LoginResponseDTO> RefreshToken(string refreshToken,string serviceId)
        {
            var existingToken = await _context.SysUserAccessTokens.Where(x => x.Token == refreshToken 
            && x.Service == serviceId && x.Status == "A").FirstOrDefaultAsync();

            if (existingToken == null || existingToken.ExpiredDate <= DateTime.Now)
            {
                throw new SysException("Unauthorized","");
            }
            var _user = await _context.SysUserLogins
            .Where(x => x.UserId == existingToken.UserId && x.Status == "A")
            .Join(
                _context.SysLoginInfos.Where(x => x.ServiceId == serviceId),             // inner
                login => login.LoginId,                                                  // outerKeySelector
                info => info.LoginId,                                                    // innerKeySelector
                (login, info) => new { Login = login, Info = info }                      // result selector
            )
            .FirstOrDefaultAsync();

            if (_user == null ) throw new SysException("Unauthorized", "");

            var _tokenExp = StaticVariable.ExpiresToken * 3600;
            var _refTokenExp = StaticVariable.ExpiresToken * 24 * 3600;
            
            //if (_tokenExp == null) throw new Exception("203|Chưa thiết lập tham số hệ thống: TOKEN_EXP");
            //if (_refTokenExp == null) throw new Exception("203|Chưa thiết lập tham số hệ thống: REFRESH_TOKEN_EXP");
            //hieu.nguyen hạn chế sử dụng try catch
            //try { int.Parse(_tokenExp.param_value); } catch { throw new Exception("203|Tham số hệ thống: TOKEN_EXP không hợp lệ!"); }
            //if (_tokenExp == null || !int.TryParse(_tokenExp.param_value, out _))
            //{
            //    Log.Error("203|Tham số hệ thống: TOKEN_EXP không hợp lệ!P");
            //    throw new Exception("203|Tham số hệ thống: TOKEN_EXP không hợp lệ!");
            //}
            //try { int.Parse(_refTokenExp.param_value); } catch { throw new Exception("203|Tham số hệ thống: REFRESH_TOKEN_EXP không hợp lệ!"); }
            //if (_refTokenExp == null || !int.TryParse(_refTokenExp.param_value, out _))
            //{
            //    Log.Error("203|Tham số hệ thống: REFRESH_TOKEN_EXP không hợp lệ!P");
            //    throw new Exception("203|Tham số hệ thống: REFRESH_TOKEN_EXP không hợp lệ!");
            //}

            #region tạo refresh token
            var RefreshToken = await GenRefreshToken();
            
            SysUserAccessToken tokennew = new SysUserAccessToken();
            tokennew.Data = "";
            tokennew.UserId = _user.Login.UserId;
            tokennew.Service = serviceId;
            tokennew.Token = RefreshToken;
            tokennew.ExpiredDate = DateTime.Now.AddSeconds(_refTokenExp); ;
            tokennew.Status = UserStatus.Active;
            
            await _context.SysUserAccessTokens.AddAsync(tokennew);

            //existingToken.redemption_id = _token.id;
            //existingToken.redemption_date = DateTime.Now;
            //existingToken.last_modified_by = _user.user_name;
            //existingToken.last_modified_date = DateTime.Now;
            //existingToken.record_stat = "C";
            //existingToken.mod_no = existingToken.mod_no + 1;
            existingToken.Status = "C";
            _context.SysUserAccessTokens.Update(existingToken);
            #endregion
            #region Tạo token
            var Token = await GenToken(_user.Info.LoginName, _tokenExp);
            #endregion
            await _context.SaveChangesAsync();
            return new LoginResponseDTO
            {
                Result = true,
                UserId = _user.Login.UserId,
                TempToken = false,
                Token = Token,
                RefreshToken = RefreshToken,
                refresh_token_expires_in = _refTokenExp,
                expires_in = _tokenExp,
                UserInfo = new UserInfoDTO
                {
                    //CheckSendMail = checksendMail,
                    //PhoneNo = user.PhoneNo,
                    //FullName = user.FullName,
                    //Email = user.Email,
                    //Image = "ImgAvatar",
                    //NeedOTP = false,
                    //LastLogin = loginInfo.login.LastLoginTime,
                    //HavePin = false,
                    //Biometric = false,
                    //FirstLogin = (bool)loginInfo.login.NewLogin || changePwAge,
                    //IsNewDevice = false,
                    //TimeCheckUserAction = timeCheckUserAtion, // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                    //TimeRevokeToken = timeRevokeToken, // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                    //TimeShowCountDown = timeShowCountDown // Đảm bảo rằng biến này đã được khai báo và gán giá trị
                }
            };
        }
        public static async Task<string> GenRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            int userId = RandomNumberGenerator.GetInt32(0, 99999);
            var userid = BitConverter.GetBytes(userId);
            var timestamp = BitConverter.GetBytes(DateTime.Now.Ticks);
            var combinedBytes = randomBytes.Concat(userid).Concat(timestamp).ToArray();
            return Convert.ToBase64String(combinedBytes);
        }
    }
}
