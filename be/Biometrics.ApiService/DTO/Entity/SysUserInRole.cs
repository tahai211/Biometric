﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.DTO.Entity
{
    [Table("Sys_UserInRole")]
    public class SysUserInRole
    {
        [Key]
        public string? UserId { get; set; }
        public int RoleId { get; set; }
    }
}
