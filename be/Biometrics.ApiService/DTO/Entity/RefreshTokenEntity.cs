﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.DTO.Entity
{
    public class RefreshTokenEntity
    {
        public string RefreshToken { get; set; }
        public string UserId { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
