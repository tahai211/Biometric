namespace Biometrics.ApiService.DTO.Entity
{
    public class QrtzTrigger
    {
        public string SchedName { get; set; }
        public string TriggerName { get; set; }
        public string TriggerGroup { get; set; }
        public string JobName { get; set; }
        public string JobGroup { get; set; }
        public string Description { get; set; }
        public string TriggerType { get; set; }
        public long StartTime { get; set; }
        public long? EndTime { get; set; }
        public string CalendarName { get; set; }
        public int? MisfireInstr { get; set; }
        public byte[] JobData { get; set; }
    }
}
