using Microsoft.EntityFrameworkCore;
using Biometrics.ApiService.DTO.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biometrics.ApiService.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<SysLoginInfo> SysLoginInfos { get; set; }
        public DbSet<SysPassword> SysPasswords { get; set; }
        public DbSet<SysPasswordHis> SysPasswordHis { get; set; }
        public DbSet<SysRole> SysRoles { get; set; }
        public DbSet<SysUser> SysUsers { get; set; }
        public DbSet<SysUserInRole> SysUserInRoles { get; set; }
        public DbSet<SysUserLogin> SysUserLogins { get; set; }
        public DbSet<SysPolicy> SysPolicies { get; set; }
        public DbSet<SysService> SysServices { get; set; }
        public DbSet<SysLoginHistory> SysLoginHistories { get; set; }
        public DbSet<SysUserAccessToken> SysUserAccessTokens { get; set; }
        public DbSet<ApiEncryptionType> ApiEncryptionTypes { get; set; }
        public DbSet<SysRequestRegenerateQR> SysRequestRegenerateQRs { get; set; }
        public DbSet<QrtzJobDetail> QrtzJobDetails { get; set; }
        public DbSet<QrtzTrigger> QrtzTriggers { get; set; }
        public DbSet<QrtzCronTrigger> QrtzCronTriggers { get; set; }
        public DbSet<QrtzSchedulerState> QrtzSchedulerStates { get; set; }
        public DbSet<QrtzFiredTrigger> QrtzFiredTriggers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApiEncryptionType>()
                .HasKey(s => s.EncryptId);

            modelBuilder.Entity<SysPolicy>()
                .HasKey(p => new { p.PolicyId, p.ServiceId });

            modelBuilder.Entity<SysService>()
                .HasKey(s => s.ServiceId);

            modelBuilder.Entity<SysLoginInfo>()
                .HasKey(l => new { l.LoginId, l.ServiceId });

            modelBuilder.Entity<SysPassword>()
                .HasKey(p => new { p.LoginId, p.Type, p.ServiceId });

            modelBuilder.Entity<SysPasswordHis>()
                .HasKey(ph => new { ph.LoginId, ph.ChangeTimeNumber, ph.ServiceId });

            modelBuilder.Entity<SysRole>()
                .HasKey(r => r.RoleId);

            modelBuilder.Entity<SysUser>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<SysUserInRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<SysUserLogin>()
                .HasKey(ul => ul.UserId);

            modelBuilder.Entity<SysLoginHistory>()
                .HasKey(lh => lh.Id);

            modelBuilder.Entity<SysUserAccessToken>()
                .HasKey(lh => lh.Id);

            modelBuilder.Entity<SysRequestRegenerateQR>()
                .HasKey(lh => lh.Id);
            modelBuilder.Entity<QrtzJobDetail>().HasKey(j => new { j.SchedName, j.JobName, j.JobGroup });
            modelBuilder.Entity<QrtzTrigger>().HasKey(t => new { t.SchedName, t.TriggerName, t.TriggerGroup });
            modelBuilder.Entity<QrtzCronTrigger>().HasKey(c => new { c.SchedName, c.TriggerName, c.TriggerGroup });
            modelBuilder.Entity<QrtzSchedulerState>().HasKey(s => new { s.SchedName, s.InstanceName });
            modelBuilder.Entity<QrtzFiredTrigger>().HasKey(f => new { f.SchedName, f.EntryId });

            //// Thiết lập các thuộc tính khác nếu cần
            //modelBuilder.Entity<Password>()
            //    .Property(p => p.Type)
            //    .HasDefaultValue("PASSWORD");

            //modelBuilder.Entity<Role>()
            //    .Property(r => r.DateCreated)
            //    .HasDefaultValueSql("GETDATE()");

            //modelBuilder.Entity<User>()
            //    .Property(u => u.SourceId)
            //    .HasDefaultValue("INTERNAL");
        }
    }

}
