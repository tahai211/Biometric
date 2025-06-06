using Biometrics.ApiService.DTO;
using MassTransit;

namespace Biometrics.ApiService.Service
{
    public class MassTransitLogService
    {
        private readonly IPublishEndpoint _publishEndpoint;

        public MassTransitLogService(IPublishEndpoint publishEndpoint)
        {
            _publishEndpoint = publishEndpoint;
        }

        public async Task EnqueueLogAsync(LogDto log)
        {
            await _publishEndpoint.Publish(log);
        }
    }
}
