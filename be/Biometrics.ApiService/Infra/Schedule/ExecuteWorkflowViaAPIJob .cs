using Quartz;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Infra.Schedule
{
    public class ExecuteWorkflowViaAPIJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            // Lấy dữ liệu từ JobDataMap
            var dataMap = context.JobDetail.JobDataMap;
            string apiEndpoint = dataMap.GetString("ScheduleAPIEndpoint");
            string apiBody = dataMap.GetString("ScheduleAPIBody");
            string scheduleName = dataMap.GetString("ScheduleName");

            try
            {
                // Thực hiện gọi API
                using (var httpClient = new HttpClient())
                {
                    var content = new StringContent(apiBody, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await httpClient.PostAsync(apiEndpoint, content);

                    if (!response.IsSuccessStatusCode)
                    {
                        // Ghi log hoặc xử lý lỗi nếu cần
                        throw new HttpRequestException(
                            $"Failed to call API. Status code: {response.StatusCode}, Reason: {response.ReasonPhrase}");
                    }
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi hoặc xử lý exception nếu cần
                throw new JobExecutionException($"Error executing job {scheduleName}: {ex.Message}", ex);
            }
        }
    }
}
