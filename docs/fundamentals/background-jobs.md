---
sidebar_label: Background Jobs
---

# Background Jobs

Sometimes it is useful for certain actions to be performed in the background without holding up the end-user. 

>Background jobs are used to queue some tasks to be executed in the background. You may need background jobs for several reasons. Here are some examples:
>
>* To perform long-running tasks without having the users wait. For example, a user presses a 'report' button to start a long-running reporting job. You add this job to the queue and send the report's result to your user via email when it's completed.
>* To create re-trying and persistent tasks to guarantee that a code will be successfully executed. For example, you can send emails in a background job to overcome temporary failures and guarantee that it eventually will be sent. That way users do not wait while sending emails.
>
>Background jobs are persistent that means they will be re-tried and executed later even if your application crashes.

## Implementing Background Jobs

For Background Jobs, Shesha leverages <a href="https://abp.io/" target="_blank">Abp.io's </a> capabilities 'as-is' and its <a href="https://docs.abp.io/en/abp/latest/Background-Jobs" target="_blank">documentation should therefore be consulted</a>.

## Monitoring Background Jobs through the Dashboard

Shesha uses the <a href="https://www.hangfire.io/" target="_blank">Hangfire library</a> to support background jobs. Hangfire also provides a dashboard that allows you to monitor the execution of background jobs. By default Shesha applications are configured so that the dashboard is accessible from `{your application url}/hangfire`. You will first however have to log-in as `admin`.

The availability and path of the HangFire dashboard is configured in the solution's `Startup` class. The default configuration is as follows:
```
    public class Startup
    {

        ...

        public void Configure(IApplicationBuilder app, IBackgroundJobClient backgroundJobs)
        {

            ....  
            /*  ADD THE FOLLOWING SECTION TO STARTUP CLASS TO HAVE ACCESS TO THE HANGFIRE DASHBOARD */
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

The Shesha framework includes an authorization filter, which can be imported from `Shesha.Scheduler.Hangfire`. This authorization filter checks for the `Pages.Hangfire` permission, from the roles assigned to the logged in user. Therefore, to access the hangfire dashboard, simply assign the `Pages.Hangfire` permission from the admin portal. 

To do this: 

1. Click on Configuration on the menu, and then Roles
2. Select the role you want to add the permission to
3. Click Edit, and then scroll down to permissions
4. Select the `Hangfire Dashboard` permission
5. Click `Save`


You can also implement a custom Authorisation filter to determine who can access the dashboard if you don't want to use the in-built authorisation filter:
```
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

