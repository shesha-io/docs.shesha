---
sidebar_label: changing the Home Page
---

# Home Page
The default behavior after a successful login is to redirect users to the home page at the / route. However, there are several ways to modify this behavior if needed.

## Changing the Home Page Url
To specify a different Url the user should be redirected to after login simply ensure the `appSettings.json` file from the back-end project contains the following setting and update accordingly:

``` json title="appSettings.json"
{
    ...
    "SheshaApp": {
// highlight-start        
        "HomeUrl": "/mynewhomeurl"
// highlight-end
    ...
}
```
## Updating the Home Page
To update the home page itself, update the `\src\pages\index.tsx` from the front-end project.

## Custom Routing
There may be situations where you need to direct users to different pages after login, based on their roles or other parameters. To achieve this dynamic routing, you can use the [`IHomePageRouter`](https://github.com/shesha-io/shesha-framework/blob/main/shesha-core/src/Shesha.Application/IHomePageRouter.cs) interface provided by Shesha. By implementing this interface and registering it with the Inversion of Control (IOC) Manager in the Initialize() method of a top-level module in the back-end project, you can control the redirection after login. The GetHomePageUrlAsync method of the IHomePageRouter interface is used to determine the appropriate home page URL for each user.

### Create an implementation of `IHomePageRouter`

As an example you may reference the default implementation [`NullHomePageRouter`](https://github.com/shesha-io/shesha-framework/blob/main/shesha-core/src/Shesha.Application/NullHomePageRouter.cs)

### Register the implementation

To register the implementation, update the `Initialize()` method of a top level module in the back-end project as follows:

``` csharp
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
