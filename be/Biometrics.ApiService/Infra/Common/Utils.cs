using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Serilog;

namespace Biometrics.ApiService.Infra.Common
{
    public static class Utils
    {
        public static string ChangeValueJson(string json, string name, string value)
        {
            try
            {
                if (string.IsNullOrEmpty(json)) return "";
                var jsonData = (JObject)JsonConvert.DeserializeObject(json);
                jsonData[name] = value;
                return JsonConvert.SerializeObject(jsonData);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "ChangeValueJson: ");
                return json;
            }
        }
    }
}
