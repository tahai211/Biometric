using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biometrics.ApiService.DTO.Entity
{
    [Table("Sys_RequestRegenerateQR")]
    public class SysRequestRegenerateQR
    {
        [Key]
        public int Id { get; set; }                          
        public string UserId { get; set; }                      
        public string FaceData { get; set; }
        public string Status { get; set; }
        public string? UserCreated { get; set; }             
        public DateTime? DateCreated { get; set; }           
        public string? UserApprove { get; set; }           
        public DateTime? DateApprove { get; set; }
    }
}
