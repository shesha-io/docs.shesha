---
sidebar_label: Custom SMS Gateway
title: Adding a Custom SMS Gateway
---

# Adding a Custom SMS Gateway

Shesha's notification framework can send SMS messages, but only through registered **gateways** - the concrete classes that know how to talk to a specific SMS provider (Twilio, Clickatell, your in-house gateway). The framework ships with a couple of built-in gateways, but most projects eventually need to plug in one of their own. This guide walks through implementing and registering a custom SMS gateway end-to-end.

At runtime, Shesha resolves the active SMS gateway by reading the `SmsGateway` UID from application settings and locating the matching registered implementation. To add a new gateway you need to:

1. Create a settings class.
2. Create a settings accessor interface.
3. Create a marker interface for the gateway.
4. Implement the gateway class.
5. Register everything in an ABP module.
6. Add the module to your host application.
7. Select the gateway in admin settings.

---

## Step 1 - Settings Class

Create a plain class to hold the gateway's configuration (API keys, base URL, and so on).

**Example - A settings class for a hypothetical gateway:**

```csharp
public class MyGatewaySettings
{
    public string ApiKey { get; set; }
    public string BaseUrl { get; set; }
}
```

---

## Step 2 - Setting Name Constants

Stash the setting names in a constant class so they are not stringly-typed throughout your code.

```csharp
public static class MyGatewaySettingNames
{
    public const string GatewaySettings = "GatewaySettings";
}
```

---

## Step 3 - Settings Accessor Interface

Extend `ISettingAccessors` and declare a typed accessor for the settings class. The `[Setting]` attribute ties the property to a named setting stored in the database. The optional `EditorFormName` points to a Shesha configuration form used to edit the settings in the admin UI.

```csharp
[Category("SMS")]
public interface IMyGatewaySettings : ISettingAccessors
{
    [Display(Name = "My Gateway")]
    [Setting(MyGatewaySettingNames.GatewaySettings, EditorFormName = "my-gateway-settings")]
    ISettingAccessor<MyGatewaySettings> MyGateway { get; }
}
```

---

## Step 4 - Marker Interface

The marker interface is what the IoC container registers against. Inherit from `IConfigurableSmsGateway<TSettings>` (`shesha-core/src/Shesha.Application/Sms/IConfigurableSmsGateway.cs`) and supply your settings type.

```csharp
public interface IMyGatewaySmsGateway : IConfigurableSmsGateway<MyGatewaySettings>
{
}
```

---

## Step 5 - Gateway Implementation

Extend `ConfigurableSmsGateway<TSettings>` (`shesha-core/src/Shesha.Application/Sms/ConfigurableSmsGateway.cs`) and decorate the class with:

- `[ClassUid]` - a stable GUID that uniquely identifies this gateway. The framework stores this UID in the `SmsGateway` setting to select which gateway is active. Once shipped, do not change this value. Source: `shesha-core/src/Shesha.Framework/Attributes/ClassUidAttribute.cs`.
- `[Display(Name = "...")]` - the human-readable name shown in the admin UI.

**Example - A skeleton gateway implementation:**

```csharp
[ClassUid("your-unique-guid-here")]
[Display(Name = "My Gateway")]
public class MyGatewaySmsGateway : ConfigurableSmsGateway<MyGatewaySettings>, IMyGatewaySmsGateway
{
    private readonly IMyGatewaySettings _settings;

    public MyGatewaySmsGateway(IMyGatewaySettings settings)
    {
        _settings = settings;
    }

    public override async Task<SendStatus> SendSmsAsync(string mobileNumber, string body)
    {
        var settings = await _settings.MyGateway.GetValueAsync();

        // Call your SMS provider's API here
        using var httpClient = new HttpClient();
        // ... build request, send, handle response ...

        return SendStatus.Success();
        // or: return SendStatus.Failed("reason");
    }

    public override async Task<MyGatewaySettings> GetTypedSettingsAsync()
    {
        return await _settings.MyGateway.GetValueAsync();
    }

    public override async Task SetTypedSettingsAsync(MyGatewaySettings settings)
    {
        await _settings.MyGateway.SetValueAsync(settings);
    }
}
```

### SendStatus

`SendSmsAsync` must return a `SendStatus`. The framework uses the result to decide whether to retry and to record the outcome on the audit trail.

| Method | When to use |
|---|---|
| `SendStatus.Success()` | The message was accepted by the provider. |
| `SendStatus.Failed("reason")` | The provider rejected the message, or an error occurred. The reason is surfaced in the audit log. |

:::warning Never throw from SendSmsAsync
The framework expects a `SendStatus` value, not an exception. Wrap external calls in a `try/catch` and translate any exceptions into `SendStatus.Failed(ex.Message)`. Throwing here breaks the retry queue.
:::

---

## Step 6 - ABP Module

Create an ABP module that registers the settings accessor (with defaults) and the gateway implementation.

**Example - A module that registers the gateway and its default settings:**

```csharp
[DependsOn(
    typeof(SheshaFrameworkModule),
    typeof(SheshaApplicationModule),
    typeof(AbpAspNetCoreModule)
)]
public class MyGatewayModule : SheshaModule
{
    public const string ModuleName = "MyCompany.MyGateway";

    public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo(ModuleName)
    {
        FriendlyName = "My SMS Gateway",
        Publisher = "MyCompany",
    };

    public override void PreInitialize()
    {
        Configuration.Modules.AbpAspNetCore().CreateControllersForAppServices(
            this.GetType().Assembly,
            moduleName: "MyGateway",
            useConventionalHttpVerbs: true);
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

        // Register settings with defaults
        IocManager.RegisterSettingAccessor<IMyGatewaySettings>(s =>
        {
            s.MyGateway.WithDefaultValue(new MyGatewaySettings
            {
                BaseUrl = "https://api.myprovider.com"
            });
        });

        // Register the gateway - Forward<> is required so ISmsGateway resolves correctly
        IocManager.IocContainer.Register(
            Component.For<IMyGatewaySmsGateway>()
                     .Forward<MyGatewaySmsGateway>()
                     .ImplementedBy<MyGatewaySmsGateway>()
                     .LifestyleTransient()
        );
    }
}
```

:::info Why use Forward&lt;&gt;()?
Shesha discovers gateways by scanning all `ISmsGateway` registrations. Using `.Forward<>()` on the concrete type ensures the same registration is resolvable as `IMyGatewaySmsGateway`, `MyGatewaySmsGateway`, and (via inheritance) `ISmsGateway` - without the container creating three separate instances.
:::

---

## Step 7 - Add the Module to Your Host Application

In your host application's module class, add a `[DependsOn]` reference to the new gateway module.

```csharp
[DependsOn(
    typeof(SheshaApplicationModule),
    typeof(MyGatewayModule),
    // ... other modules
)]
public class MyApplicationModule : AbpModule
{
    // ...
}
```

Without this dependency, ABP will not load `MyGatewayModule` and your gateway will silently not be registered.

---

## Selecting the Gateway

Once the module is deployed, navigate to **Admin > Settings > SMS** in the admin portal and pick your gateway from the **SMS Gateway** dropdown. The dropdown is populated by scanning every registered `ISmsGateway` implementation and matching them by their `[ClassUid]`.

The `IsSmsEnabled` flag must also be enabled for any messages to be sent.

:::tip
After deploying a new gateway, restart the application before changing the dropdown - new IoC registrations are discovered at startup, not at runtime.
:::
