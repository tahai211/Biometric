using Biometrics.ApiService.Data;
using Biometrics.ApiService.DTO;
using MassTransit;
using Serilog;

namespace Biometrics.ApiService.Infra
{
    public class LogConsumer : IConsumer<LogDto>
    {
        private readonly AppDbContext _dbContext;

        public LogConsumer(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<LogDto> context)
        {
            var logEntry = context.Message;

            try
            {
                // TODO: Map LogDto to entity and save to DB
                // _dbContext.Add(...);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error saving log");
            }
        }
    }
}
