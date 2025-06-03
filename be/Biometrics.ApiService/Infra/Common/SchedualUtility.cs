using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Reflection.Metadata;
using Quartz;
using Quartz.Impl;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.RegularExpressions;
using System.Net.Http.Json;
using Biometrics.ApiService.Data;
using Biometrics.ApiService.Infra.Schedule;

namespace Biometrics.ApiService.Infra.Common
{
    public class SchedualUtility
    {
        public static object Execute()
        {
            return "123";
        }
        private readonly AppDbContext _context;
        //dependency _schedulerFactory
        private readonly ISchedulerFactory _schedulerFactory;
        // constructor gan lai _schedulerFactory
        public SchedualUtility(ISchedulerFactory schedulerFactory, AppDbContext context)
        {
            _schedulerFactory = schedulerFactory;
            _context = context;
        }
        public async Task CreateSchedules(dynamic schedules)
        {
            try
            {
                foreach (var schedule in schedules)
                {
                    ValidateSchedule(schedule.ScheduleId, schedule.ScheduleGroup, schedule.ScheduleAPIEndpoint, schedule.ScheduleAPIBody,
                        schedule.ScheduleName, schedule.Cron, schedule.StartDate, schedule.EndDate);
                }
                foreach (var schedule in schedules)
                {
                    await CreateSchedule(schedule.ScheduleId, schedule.ScheduleGroup, schedule.ScheduleAPIEndpoint, schedule.ScheduleAPIBody,
                        schedule.ScheduleName, schedule.Cron, schedule.StartDate, schedule.EndDate);
                }
            }
            catch (Exception ex)
            {
                throw new Exception( "Invalid schedule detected during validation");
            }
        }
        public async Task CreateSchedule(string ScheduleId, string ScheduleGroup, string ScheduleAPIEndpoint, string ScheduleAPIBody,
            string ScheduleName, string Cron, DateTimeOffset? StartDate, DateTimeOffset? EndDate)
        {
            try
            {
                IScheduler scheduler = await _schedulerFactory.GetScheduler();
                IJobDetail job = JobBuilder.Create<ExecuteWorkflowViaAPIJob>()
                   .WithIdentity(ScheduleId, ScheduleGroup)
                   .Build();
                job.JobDataMap.Add("ScheduleAPIEndpoint", ScheduleAPIEndpoint);
                job.JobDataMap.Add("ScheduleAPIBody", ScheduleAPIBody);
                job.JobDataMap.Add("ScheduleName", ScheduleName);

                Quartz.ITrigger trigger = Quartz.TriggerBuilder.Create()
                        .WithIdentity(ScheduleId, ScheduleGroup)
                        .StartAt(StartDate.Value.LocalDateTime)
                        .EndAt(EndDate.Value.LocalDateTime)
                        .WithSchedule(CronScheduleBuilder.CronSchedule(Cron))
                        .Build();

                await scheduler.ScheduleJob(job, trigger);
                if (!scheduler.IsStarted)
                    await scheduler.Start();
            }
            catch (Exception ex)
            {
                throw new Exception( "Invalid schedule", ex);
            }
        }
        //public async Task CancelSchedule( string ScheduleId, string ScheduleGroup)
        //{
        //    var qrtzjobInfo = await _context.QrtzJobDetails.Where(x => x.JobName == ScheduleId && x.JobGroup == ScheduleGroup).FirstOrDefaultAsync();
        //    if (qrtzjobInfo != null)
        //    {
        //        var qrtzInfo = await _context.QrtzTriggers.Where(x => x.TriggerName == ScheduleId && x.TriggerGroup == ScheduleGroup).FirstOrDefaultAsync();
        //        _context.QrtzTriggers.Remove(qrtzInfo);
        //        _context.QrtzJobDetails.Remove(qrtzjobInfo);
        //        await _context.SaveChangesAsync();
        //    }
        //}
        public async Task CancelSchedule(string ScheduleId, string ScheduleGroup)
        {
            try
            {
                IScheduler scheduler = await _schedulerFactory.GetScheduler();
                JobKey jobKey = new JobKey(ScheduleId, ScheduleGroup);

                // Xóa job và tất cả các trigger liên quan
                bool deleted = await scheduler.DeleteJob(jobKey);
                if (!deleted)
                {
                    throw new Exception("Job không tồn tại hoặc không thể xóa.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi hủy lịch trình.", ex);
            }
        }

        //Validate 
        public void ValidateSchedule(string ScheduleId, string ScheduleGroup, string ScheduleAPIEndpoint, string ScheduleAPIBody,
             string ScheduleName, string Cron, DateTimeOffset? StartDate, DateTimeOffset? EndDate)
        {
            if (string.IsNullOrEmpty(Cron))
            {
                throw new Exception("Cron cannot be empty");
            }
            if (string.IsNullOrEmpty(ScheduleId))
            {
                throw new Exception( "ScheduleId cannot be empty");
            }
            if (string.IsNullOrEmpty(ScheduleName))
            {
                throw new Exception( "ScheduleName cannot be empty");
            }
            if (string.IsNullOrEmpty(ScheduleGroup))
            {
                throw new Exception("ScheduleGroup cannot be empty");
            }
            if (string.IsNullOrEmpty(ScheduleAPIEndpoint))
            {
                throw new Exception("Schedule API Endpoint cannot be empty");
            }
            var isValid = CronExpression.IsValidExpression(Cron);
            if (isValid)
            {
                var cronSchedule = new CronExpression(Cron);
                DateTimeOffset? nextValidTime = cronSchedule.GetNextValidTimeAfter(StartDate.Value);
                if (nextValidTime.HasValue && nextValidTime.Value.DateTime.ToLocalTime() <= EndDate)
                {
                    if (nextValidTime.Value.DateTime.ToLocalTime() < DateTime.Now)
                    {
                        throw new Exception( $"The first execution time of this schedule transfer is {nextValidTime.Value.DateTime.ToLocalTime():dd-MM-yyyy HH:mm:ss}, it has been over time, so that you cannot approve it. Please try with another schedule transfer.");
                    }
                }
            }
            else
            {
                throw new Exception("Invalid Cron");
            }
        }

        // ktra lich chay cua cron
        public static List<DateTimeOffset> GetOccurrences(string cronExpression, DateTimeOffset startDate, DateTimeOffset endDate)
        {
            var occurrences = new List<DateTimeOffset>();
            var cron = new CronExpression(cronExpression);
            DateTimeOffset? nextOccurrence = cron.GetNextValidTimeAfter(startDate);
            while (nextOccurrence.HasValue && nextOccurrence.Value <= endDate)
            {
                occurrences.Add(nextOccurrence.Value.ToLocalTime());
                nextOccurrence = cron.GetNextValidTimeAfter(nextOccurrence.Value.AddSeconds(1));
            }
            return occurrences;
        }
    }
}
