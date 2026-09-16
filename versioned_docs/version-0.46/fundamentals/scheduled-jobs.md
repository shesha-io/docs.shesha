---
sidebar_label: Scheduled Jobs
title: Scheduled Jobs
---

# Scheduled Jobs

Many enterprise applications need certain actions to run in the background on a set schedule - every night, every week, or even every few minutes. Shesha calls these **Scheduled Jobs**, building on its [Background Jobs](./background-jobs.md) support. Typical uses include sending bulk notifications, cleaning up expired or stale data after a timeframe, and monitoring system availability or watching for a file to appear.

---

## Design Principles

To keep a scheduled job robust, follow these principles:

- **Make your job fault-tolerant.** Implement your job logic as an [idempotent operation](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation) - one that can run multiple times without leaving the system in an inconsistent state. If a job fails or is interrupted (hardware or network failure), an administrator should be able to simply rerun it without corrupting data or duplicating work.
- **Commit changes regularly and atomically.** Data changes your job makes should be committed [atomically](<https://en.wikipedia.org/wiki/Atomicity_(database_systems)>) and at logical points, especially for long-running jobs, so an interrupted job does not have to restart from scratch.
- **Log progress regularly, but not too often.** Use the `Log` property to report progress, particularly for long-running jobs. Logging adds overhead, so batch your log calls (for example, every 100 records rather than every record) instead of logging on every iteration.
- **Think about performance.** Scheduled jobs often process large volumes of data, and NHibernate's overhead can become significant at scale. Consider [using ADO.NET directly](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/retrieving-and-modifying-data) instead of going through NHibernate for bulk operations.

---

## Implementing a Scheduled Job

To implement a scheduled job, create a class that inherits from `ScheduledJobBase` and override `DoExecuteAsync`. You do not need to wrap your logic in a try/catch block - the base class already catches and logs any unhandled exception. The schedule is set via the `cronString` argument of the `[ScheduledJob]` attribute; use a [cron string editor](http://www.cronmaker.com) to build a valid expression.

:::note Statistics require the generic base class
Plain `ScheduledJobBase` has no `JobStatistics` property. To track counts like successes and errors, inherit from `ScheduledJobBase<TStat>` instead, using `ScheduledJobStatistic` or your own subclass of it - see [Job Statistics](#job-statistics) below.
:::

**Example - Sending bulk appointment reminder notifications:**

```cs
/// <summary>
/// Sends reminders of appointments the day before the appointments.
/// </summary>
[ScheduledJob("9bc54591-55fb-4e2e-91b6-199cb9c187d0",
    startupMode: StartUpMode.Automatic,
    cronString: "0 2 * * *",  // Executes everyday at 2am
    description: "Sends reminders of appointments the day before the appointments.")]
public class SendAppointmentReminderNotificationJob : ScheduledJobBase<ScheduledJobStatistic>, ITransientDependency
{
    // Sql to retrieve the list of valid Appointments scheduled for tomorrow for which a Reminder notification has not yet been sent according to the audit log in AbpTenantNotifications
    private const string SQL_SELECT_REMINDERS_TO_SEND = @"SELECT Id FROM Health_Appointments WHERE
                                            IsDeleted = 0
                                        AND StatusLkp = 3 /*Booked*/
                                        AND [AppointmentTime] >= @fromDate AND [AppointmentTime] < @toDate
                                        AND Id NOT IN (SELECT EntityId FROM AbpTenantNotifications WHERE NotificationName = @templateId)
                                ";

    public override async Task DoExecuteAsync(CancellationToken cancellationToken)
    {
        var bookingNotificationSender = IocManager.Resolve<IBookingNotificationSender>();
        var appointmentsRepo = IocManager.Resolve<IRepository<CdmAppointment, Guid>>();

        Log.Info("Started...");

        var numProcessed = 0;
        using (var session = IocManager.Resolve<ISessionFactory>().OpenSession())
        {
            // Retrieving list of notifications to be sent as an ADO.NET DataReader for improved performance as volumes may be significant
            var reader = GetReaderForAllAppointmentsStillToNotify(session, DateTime.Now.Date.AddDays(1), DateTime.Now.Date.AddDays(2), NotificationTemplateIds.AppointmentReminder);

            while (reader.Read())
            {
                // Reads through the full result set record by record
                var appointmentId = reader.GetGuid(0);

                try
                {
                    var appointment = appointmentsRepo.Get(appointmentId);
                    await bookingNotificationSender.NotifyAppointmentReminderAsync(appointment);
                    JobStatistics.NumSucceeded++;
                }
                catch (Exception ex)
                {
                    Log.Error($"Failed to send message for appointment Id:{appointmentId}", ex);
                    JobStatistics.NumErrors++;
                }
                finally
                {
                    numProcessed++;
                    if (numProcessed % 100 == 0)    // Only logging every 100 messages to reduce overhead
                        Log.Info($"{numProcessed} appointments have been processed.");
                }
            }
        }

        Log.Info($"All appointments have been processed - Sent: {JobStatistics.NumSucceeded} | Failed: {JobStatistics.NumErrors} | Skipped: {JobStatistics.NumSkipped}");
    }

    private static DbDataReader GetReaderForAllAppointmentsStillToNotify(ISession session, DateTime appointmentsFrom, DateTime appointmentsTo, Guid templateId)
    {
        var command = session.Connection.CreateCommand();
        command.CommandText = SQL_SELECT_REMINDERS_TO_SEND;
        AddParameter(command, "@fromDate", appointmentsFrom);
        AddParameter(command, "@toDate", appointmentsTo);
        AddParameter(command, "@templateId", templateId);

        return command.ExecuteReader();
    }

    private static void AddParameter(DbCommand command, string paramName, object paramValue)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = paramName;
        parameter.Value = paramValue;
        command.Parameters.Add(parameter);
    }
}
```

---

## Reacting to Success and Failure

`ScheduledJobBase` does not expose `OnSuccess`/`OnFail`/`OnLog` events to override - there is no such per-job hook. Instead:

- `MarkExecutionAsSuccessAsync()` is `virtual`. Override it to run logic after a successful execution, calling `base.MarkExecutionAsSuccessAsync()` so the execution record still gets updated.
- `MarkExecutionAsFailureAsync(Exception e)` is **not** virtual - you cannot override it to react to a failure. Handle failure logic inside `DoExecuteAsync` itself instead.
- `OnLog` does exist, but as a static CLR event on an internal log4net appender (`ScheduledJobEventSourceAppender.OnLog`), not a per-job override point - it fires for every log statement across every job, not just yours.

---

## Job Statistics

By default, `ScheduledJobBase<TStat>` gives your job a `JobStatistics` property of type `TStat` (a subclass of `ScheduledJobStatistic`), which exposes `NumSucceeded`, `NumSkipped`, and `NumErrors`.

You can define your own statistics class as long as it inherits from `ScheduledJobStatistic`:

```cs
public class MyJobStats : ScheduledJobStatistic
{
    public int TotalProcessedRecords { get; set; }
}

[ScheduledJob("1FF7882E-0A3B-4F88-A8B3-C3C20AFAFBDE", StartUpMode.Manual)]
public class MyJob : ScheduledJobBase<MyJobStats>, ITransientDependency
{
    public override async Task DoExecuteAsync(CancellationToken cancellationToken)
    {
        for (var i = 0; i < 100; i++)
        {
            // JobStatistics here is typed as MyJobStats, so it has all the properties defined in the class
            JobStatistics.TotalProcessedRecords++;
        }
    }
}
```

Job statistics can be viewed from the admin portal: start the job, navigate to its details page, and open the recent execution from the data table.

![image](https://user-images.githubusercontent.com/85956374/222988093-0c14e798-c7be-4212-913a-f3619c00d82c.png)

![image](https://user-images.githubusercontent.com/85956374/222988810-8836bb7e-937b-4f50-8a36-4feeb4f9cf7b.png)

---

## Logging

Every scheduled job should log its progress and any errors through the `Log` property. There are two ways logs can be persisted, set via the `LogMode` argument of the `[ScheduledJob]` attribute:

| `LogMode` | Where logs are stored |
|---|---|
| `FileSystem` (default) | Under `App_Data` on the server |
| `StoredFile` | Uploaded through Shesha's stored-file service (for example Azure Blob Storage, depending on configuration), under the folder named by `LogFolder` |

```cs
[ScheduledJob("1FF7882E-0A3B-4F88-A8B3-C3C20AFAFBDE", StartUpMode.Manual, LogMode = LogMode.StoredFile, LogFolder = "ThisJob/Awesome")]
public class TestJob : ScheduledJobBase, ITransientDependency
{
}
```

By default, execution logs are written to `~/App_Data/logs/jobs/{jobFolderName}/{executionId}.log` on the server running the job. If you have access to the hosting environment's file system (for example via the Azure App Service Editor), you can browse to that folder directly to read a job's log files:

![image](https://user-images.githubusercontent.com/85956374/222988833-c1b6d4a6-6d62-4d46-9143-3fc5c20940cb.png)

![image](https://user-images.githubusercontent.com/85956374/222988841-a457472f-ea61-41d5-9a60-3cb39b38acf5.png)


