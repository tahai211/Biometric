using Microsoft.AspNetCore.Builder.Extensions;
using Newtonsoft.Json;
using System.Xml.Linq;

namespace Biometrics.ApiService.Infra.Common
{
    public class PushCommon
    {
        //public static async ValueTask<object> Execute(ActivityExecutionContext context)
        //{
        //    if (FirebaseMessaging.DefaultInstance == null)
        //    {
        //        try
        //        {
        //            Log.Information("Initializing Firebase Admin while sending push");

        //            var objFirebaseAdminCert = await IdpCaching.GetObjectAsync("Sys_Variables", "FIREBASE_ADMIN_JSON");
        //            if (objFirebaseAdminCert != null)
        //            {
        //                var strFirebaseAdminCert = objFirebaseAdminCert.Value;

        //                var credential = GoogleCredential.FromJson(strFirebaseAdminCert);
        //                FirebaseApp.Create(new AppOptions()
        //                {
        //                    Credential = credential
        //                });
        //            }
        //            Log.Information("Initialize Firebase Admin successfully when sending push");
        //        }
        //        catch (Exception ex)
        //        {
        //            Log.Information("Unable to initialize Firebase Admin when sending push with error: " + ex.ToString());
        //        }
        //        if (FirebaseMessaging.DefaultInstance == null)
        //            throw new IdpException("firebase_admin_not_initialize", "Unable to initialize Firebase Admin when sending push ");
        //    }
        //    DigitalContext digitalContext = context.ServiceProvider.GetRequiredService<DigitalContext>();
        //    int retry = 1;
        //    try
        //    {
        //        retry = bool.Parse((await IdpCaching.GetObjectAsync("Sys_Variables", "FIREBASE_PUSH_RETRY")).Value.ToString());
        //    }
        //    catch { }

        //    int batchSize = 50;
        //    try
        //    {
        //        batchSize = bool.Parse((await IdpCaching.GetObjectAsync("Sys_Variables", "FIREBASE_PUSH_BATH_SIZE")).Value.ToString());
        //    }
        //    catch { }

        //    var lsPush = digitalContext.EspPushMessages.Where(x => x.Status == "N" || (x.Status == "F" && x.Retry < retry));
        //    foreach (var push in lsPush)
        //    {
        //        var rs = await SendMessage(push);
        //        if (rs.Item1)
        //        {
        //            push.Status = "S";
        //            push.DateSent = DateTime.Now;
        //        }
        //        else
        //        {
        //            push.Status = "F";
        //            push.Retry = push.Retry + 1;
        //            push.GatewayError = rs.Item2;
        //        }
        //    }
        //    SaveOptions so = new SaveOptions
        //    {
        //        UserId = "SYSTEM",
        //        InstanceId = context.WorkflowInstance.Id,
        //        CorrelationId = context.WorkflowInstance.CorrelationId,
        //        TransactionCode = context.WorkflowInstance.Name,
        //        ClientInfo = "SYSTEM",
        //        AllowRecover = false,
        //        RecoveryId = "0"
        //    };
        //    digitalContext.SaveOptions = so;

        //    await digitalContext.SaveChangesAsync();
        //    return true;
        //}
        //private static async ValueTask<(bool, string)> SendMessage(EspPushMessage pushMsg)
        //{
        //    try
        //    {
        //        Message message;
        //        Dictionary<string, string> dicMsg = new Dictionary<string, string>();
        //        dicMsg.Add("title", pushMsg.Title);
        //        dicMsg.Add("message", pushMsg.Title);
        //        dicMsg.Add("body", pushMsg.Body);
        //        dicMsg.Add("subtitle", "");
        //        dicMsg.Add("imgurl", pushMsg.ImgUrl);
        //        dicMsg.Add("link", pushMsg.Link);
        //        dicMsg.Add("trancode", pushMsg.TranCode);
        //        dicMsg.Add("group", pushMsg.Group);
        //        dicMsg.Add("object", pushMsg.Object);
        //        dicMsg.Add("objecttype", pushMsg.ObjectType);
        //        dicMsg.Add("datetime", pushMsg.DateInsert.ToString("dd/MM/yyyy HH:mm:ss"));
        //        dicMsg.Add("id", pushMsg.Id.ToString());
        //        dicMsg.Add("data", pushMsg.Data);
        //        dicMsg.Add("detail", pushMsg.Detail);
        //        var action = !string.IsNullOrEmpty((string)pushMsg.Action) ? JsonConvert.DeserializeObject<dynamic>(pushMsg.Action) : null;
        //        dicMsg.Add("action", action);

        //        if (pushMsg.ObjectType.Equals("TOPIC"))
        //        {
        //            message = new Message()
        //            {
        //                Data = dicMsg,
        //                Topic = pushMsg.Object,
        //                Apns = new ApnsConfig
        //                {
        //                    Aps = new Aps
        //                    {
        //                        ContentAvailable = true,
        //                        Alert = new ApsAlert
        //                        {
        //                            Title = dicMsg["title"],
        //                            Body = dicMsg["body"]
        //                        }
        //                    }
        //                },
        //                Android = new AndroidConfig
        //                {
        //                    Priority = Priority.High,
        //                }
        //            };
        //        }
        //        else
        //        {
        //            message = new Message()
        //            {
        //                Data = dicMsg,
        //                Token = pushMsg.PushId,
        //                Apns = new ApnsConfig
        //                {
        //                    Aps = new Aps
        //                    {
        //                        ContentAvailable = true,
        //                        Alert = new ApsAlert
        //                        {
        //                            Title = dicMsg["title"],
        //                            Body = dicMsg["body"]
        //                        },
        //                    }
        //                },
        //                Android = new AndroidConfig
        //                {
        //                    Priority = Priority.High
        //                }
        //            };
        //        }
        //        string response = string.Empty;
        //        try
        //        {
        //            response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        //            return (true, "");
        //        }
        //        catch (FirebaseMessagingException fme)
        //        {
        //            string errorDesc = $"{fme.MessagingErrorCode} - {fme.Message}";
        //            return (false, errorDesc);
        //        }
        //        catch (FirebaseException fe)
        //        {
        //            string errorDesc = fe.Message;
        //            return (false, errorDesc);
        //        }
        //        catch (Exception ex)
        //        {
        //            string errorDesc = ex.ToString();
        //            if (errorDesc.Length > 900)
        //                errorDesc = errorDesc.Substring(0, 900);
        //            return (false, errorDesc);
        //        }

        //    }
        //    catch (Exception pex)
        //    {
        //        string errorDesc = pex.ToString();
        //        if (errorDesc.Length > 900)
        //            errorDesc = errorDesc.Substring(0, 900);
        //        return (false, errorDesc);
        //    }
        //}
    }
}
