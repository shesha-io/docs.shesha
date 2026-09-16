---
sidebar_label: Background Jobs
title: Background Jobs
---

# Background Jobs

A background job is a piece of work that runs separately from the user's request, so the user does not have to wait for it to finish. When someone clicks a button that starts a slow task, you queue that task as a background job and let the user carry on while it runs.

Background jobs are useful in two common situations:

- **Long-running tasks.** For example, a user presses a "report" button to start a long reporting job. You queue the job and email the result to the user once it is done, instead of making them wait on the screen.
- **Tasks that must not be lost.** For example, sending email. By running it as a background job, the task is retried automatically until it succeeds, so a temporary failure does not lose the email.

:::info
Background jobs are persistent. They are stored so that they will be retried and run later even if the application crashes or restarts before they finish.
:::

---

## Implementing background jobs

For background jobs, Shesha leverages <a href="https://abp.io/" target="_blank">ABP's</a> capabilities as-is, so the <a href="https://docs.abp.io/en/abp/latest/Background-Jobs" target="_blank">ABP background jobs documentation</a> should be consulted for how to define and queue jobs.

---

## Monitoring background jobs through the dashboard

Under the hood, Shesha uses the <a href="https://www.hangfire.io/" target="_blank">Hangfire library</a> to run background jobs. Hangfire provides a dashboard that lets you monitor how your background jobs are executing. By default, Shesha applications expose this dashboard at `{your application url}/hangfire`. You need to be logged in as `admin` to reach it.

The availability and path of the Hangfire dashboard are configured in the solution's `Startup` class. The default configuration looks like this:

```csharp
public class Startup
{
    ...

    public void Configure(IApplicationBuilder app, IBackgroundJobClient backgroundJobs)
    {
        ....
        /* ADD THE FOLLOWING SECTION TO THE STARTUP CLASS TO ENABLE THE HANGFIRE DASHBOARD */
        var options = new BackgroundJobServerOptions
        {
            //Queues = new[] { "alpha", "beta", "default" }
        };
        app.UseHangfireServer(options);
        app.UseHangfireDashboard("/hangfire",
            new DashboardOptions
            {
                /* THE HangfireAuthorizationFilter SHOULD BE IMPORTED FROM Shesha.Scheduler.Hangfire */
                Authorization = new[] { new HangfireAuthorizationFilter() }
            });
        ....
    }

    ....
}
```

The Shesha framework includes an authorization filter, `HangfireAuthorizationFilter`, which is imported from the `Shesha.Scheduler.Hangfire` namespace. This filter checks for the `Pages.Hangfire` permission on the roles assigned to the logged-in user. To grant access to the dashboard, assign the `Hangfire Dashboard` permission from the admin portal.

To do this:

1. Click **Configuration** on the menu, and then **Roles**.
2. Select the role you want to add the permission to.
3. Click **Edit**, then scroll down to **Permissions**.
4. Select the **Hangfire Dashboard** permission.
5. Click **Save**.

___

### Using a custom authorization filter

If you do not want to use the built-in filter, you can implement your own authorization filter to decide who can access the dashboard. Your filter implements `IDashboardAuthorizationFilter` and returns `true` for the users you want to allow.

**Example - Allow only the admin user:**

```csharp
/// <summary>
/// Hangfire dashboard authorization filter
/// </summary>
public class MyCustomAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        return context.GetHttpContext().GetUsernameFromJwtToken()?.Trim().ToLower() == "admin";
    }
}
```

The `GetUsernameFromJwtToken` extension method reads the username from the request's JWT token and is available from the `Shesha.Authentication.JwtBearer` namespace.

:::tip
For scheduled and recurring work that runs on a timer rather than being queued on demand, see the [Scheduled Jobs](scheduled-jobs) page. Scheduled jobs are also built on Hangfire and appear in the same dashboard.
:::
