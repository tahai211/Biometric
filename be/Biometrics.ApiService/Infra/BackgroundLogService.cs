

using Biometrics.ApiService.Data;
using Biometrics.ApiService.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Infra
{
    public class BackgroundLogService : BackgroundService
    {
        private readonly Channel<LogDto> _logChannel;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public BackgroundLogService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
            #region Sử dụng khi k cần giới hạn số lượng hàng đợi (nhưng tốn bộ nhớ)
            _logChannel = Channel.CreateUnbounded<LogDto>();
            #endregion
            #region Sử dụng khi cần giới hạn số lượng hàng đợi (để limit 300, tăng lên nhưng k được tăng quá nhiều (ảnh hưởng bộ nhớ) nếu số lượng request đồng thời quá số lượng này)
            //_logChannel = Channel.CreateBounded<LogEntry>(new BoundedChannelOptions(3000)
            //{
            //    FullMode = BoundedChannelFullMode.DropOldest, //Xóa hàng đợi cũ nhất khi hàng đợi đầy
            //});
            #endregion
        }
        public async Task EnqueueLogEntryAsync(LogDto logEntry)
        {
            await _logChannel.Writer.WriteAsync(logEntry);
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var _dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                await foreach (var logEntry in _logChannel.Reader.ReadAllAsync(stoppingToken))
                {
                    try
                    {
                        //sttb_api_logs _log = new sttb_api_logs
                        //{
                        //    system_id = logEntry.system_id,
                        //    request_id = logEntry.request_id,
                        //    reference_id = logEntry.reference_id,
                        //    username = logEntry.username,
                        //    request_encrypt = logEntry.request_encrypt,
                        //    request_decypt = logEntry.request_decypt,
                        //    response_enctypt = logEntry.response_enctypt,
                        //    response_decypt = logEntry.response_decypt,
                        //    execution_time = logEntry.execution_time,
                        //    execution_duration = logEntry.execution_duration,
                        //    http_method = logEntry.http_method,
                        //    url = logEntry.url,
                        //    http_status_code = logEntry.http_status_code,
                        //    exception = logEntry.exception,
                        //    ip = logEntry.ip,
                        //    browser = logEntry.browser,
                        //    record_stat = "O",
                        //    auth_stat = "A",
                        //    mod_no = 0,
                        //    created_by = "SYSTEM",
                        //    created_date = DateTime.Now
                        //};

                        //_dbContext.Set<sttb_api_logs>().Add(_log);
                        await _dbContext.SaveChangesAsync(stoppingToken);

                        //await Task.Delay(10000);
                    }
                    catch (OperationCanceledException)
                    {
                        // Mã thông báo hủy bỏ được kích hoạt, thoát khỏi vòng lặp
                        Log.Information("BackgroundLogService is stopping");
                        break;
                    }
                    catch (Exception ex)
                    {
                        Log.Error(ex, "Error processing log entry");
                    }
                }
            }
        }
    }
}
