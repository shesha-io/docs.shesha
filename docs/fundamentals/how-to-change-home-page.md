---
sidebar_label: Changing the Home Page
---

# Home Page

After a user logs in, Shesha redirects them to the home page at the `/` route by default. This page explains how to change that destination, either to a fixed URL for everyone or to a different page per user based on their role or other criteria.

---

## Changing the home page URL

To send users to a different URL after login, add the `HomeUrl` setting under `SheshaApp` in the back-end project's `appsettings.json` file and set it to the URL you want:

```json title="appsettings.json"
{
    ...
    "SheshaApp": {
// highlight-start
        "HomeUrl": "/mynewhomeurl"
// highlight-end
    ...
}
```

---

## Updating the home page itself

To change the content of the home page, update `\src\pages\index.tsx` in the front-end project.

---

## Custom routing per user

Sometimes you need to send different users to different pages after login, based on their roles or other parameters. To do this, implement the [`IHomePageRouter`](https://github.com/shesha-io/shesha-framework/blob/main/shesha-core/src/Shesha.Application/IHomePageRouter.cs) interface provided by Shesha and register it with the Inversion of Control (IoC) Manager in the `Initialize()` method of a top-level module in the back-end project. Shesha calls the interface's `GetHomePageUrlAsync` method to work out the correct home page URL for each user.

### Create an implementation of `IHomePageRouter`

The interface defines a single method, `Task<string> GetHomePageUrlAsync(User user)`, which returns the URL to redirect the given user to. For a starting point, see the default implementation, [`NullHomePageRouter`](https://github.com/shesha-io/shesha-framework/blob/main/shesha-core/src/Shesha.Application/NullHomePageRouter.cs).

### Register the implementation

To register your implementation, update the `Initialize()` method of a top-level module in the back-end project as follows:

```csharp
public class MyAppModule : AbpModule
{
    ...
    public override void Initialize()
    {
        ...
        // highlight-start
        IocManager.Register<IHomePageRouter, MyHomePageRouter>(DependencyLifeStyle.Singleton);
        // highlight-end
        ...
    }
    ...
}
```

:::tip
A custom `IHomePageRouter` takes precedence over the `HomeUrl` setting, so use the setting for a single shared landing page and the router when the destination depends on the user.
:::
