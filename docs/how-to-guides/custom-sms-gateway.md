---
sidebar_label: Custom SMS Gateway
---

# Adding a Custom SMS Gateway

This guide walks through implementing and registering a custom SMS gateway in Shesha.

## Overview

Shesha resolves the active SMS gateway at runtime by reading the `SmsGateway` UID from application settings and locating the matching registered implementation. To add a new gateway you need to:

1. Create a settings class
2. Create a settings accessor interface
3. Create a marker interface for the gateway
4. Implement the gateway class
5. Register everything in an ABP module

---

## Step 1 — Settings class

Create a plain class to hold the gateway's configuration (API keys, host, etc.).

```csharp
public class MyGatewaySettings
{
    public string ApiKey { get; set; }
    public string BaseUrl { get; set; }
}
```

---

## Step 2 — Setting name constants

```csharp
public static class MyGatewaySettingNames
{
    public const string GatewaySettings = "GatewaySettings";
}
```

---

## Step 3 — Settings accessor interface

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

## Step 4 — Marker interface

```csharp
public interface IMyGatewaySmsGateway : IConfigurableSmsGateway<MyGatewaySettings>
{
}
```

This interface is used when registering with the IoC container (see Step 6).

---

## Step 5 — Gateway implementation

Extend `ConfigurableSmsGateway<TSettings>` and decorate the class with:

- `[ClassUid]` — a stable GUID that uniquely identifies this gateway. This is stored in the `SmsGateway` setting to select which gateway is active.
- `[Display(Name = "...")]` — the human-readable name shown in the admin UI.

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

### `SendStatus`

`SendSmsAsync` must return a `SendStatus`:

| Method | When to use |
|---|---|
| `SendStatus.Success()` | Message accepted by the provider |
| `SendStatus.Failed("reason")` | Provider rejected or an error occurred |

---

## Step 6 — ABP module

Create an ABP module that registers the settings accessor (with defaults) and the gateway.

```csharp
[DependsOn(typeof(SheshaFrameworkModule), typeof(SheshaApplicationModule), typeof(AbpAspNetCoreModule))]
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

        // Register the gateway — Forward<> is required so ISmsGateway resolves correctly
        IocManager.IocContainer.Register(
            Component.For<IMyGatewaySmsGateway>()
                     .Forward<MyGatewaySmsGateway>()
                     .ImplementedBy<MyGatewaySmsGateway>()
                     .LifestyleTransient()
        );
    }
}
```

> **Why `.Forward<>()`?**
> Shesha discovers gateways by scanning all `ISmsGateway` registrations. Using `.Forward<>()` on the concrete type ensures the same instance registration is resolvable as both `IMyGatewaySmsGateway` and `ISmsGateway`.

---

## Step 7 — Add the module to your host application

In your host application's module class, add a `[DependsOn]` reference:

```csharp
[DependsOn(
    typeof(SheshaApplicationModule),
    typeof(MyGatewayModule),  // <-- add this
    // ... other modules
)]
public class MyApplicationModule : AbpModule
{
    // ...
}
```

---

## Selecting the gateway

Once deployed, navigate to **Admin → Settings → SMS** and select your gateway from the **SMS Gateway** dropdown. The dropdown is populated by scanning all registered `ISmsGateway` implementations, matching them by their `[ClassUid]`.

The `IsSmsEnabled` flag must also be enabled for any messages to be sent.
