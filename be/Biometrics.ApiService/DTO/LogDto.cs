namespace Biometrics.ApiService.DTO
{
    public class LogDto
    {
        public string? system_id { get; set; }
        public string? request_id { get; set; }
        public string? reference_id { get; set; }
        public string? username { get; set; }
        public string? request_encrypt { get; set; }
        public string? request_decypt { get; set; }
        public string? response_enctypt { get; set; }
        public string? response_decypt { get; set; }
        public DateTime? execution_time { get; set; }
        public long? execution_duration { get; set; }
        public string? http_method { get; set; }
        public string? url { get; set; }
        public string? http_status_code { get; set; }
        public string? exception { get; set; }
        public string? ip { get; set; }
        public string? browser { get; set; }
    }
}
