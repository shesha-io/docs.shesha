---
sidebar_label: Configuration
title: Configuration
---

# Configuration

Shesha is a low-code platform, which means a large part of how an application behaves is defined through configuration rather than written in code. Forms, reference lists, settings, and more are set up by configuring them instead of programming them. Because so much of the application lives in configuration, understanding how configuration is managed, and especially how it is moved between environments, is essential.

The configuration items you will define most often are form configurations and reference lists.

The key thing that makes something a configuration item is how it is stored and moved. Configuration items are stored as data in the application database, but they can be exported and imported between different instances in a JSON based package format.

---

:::note
Menu structures cannot yet be distributed through the export and import mechanism described below. This is expected to be addressed in a future version of Shesha.
:::

## Deploy configurations manually

Configuration can be exported from one instance of Shesha and imported into another by hand. This is the quickest way to move a small set of changes between environments.

### Export configuration

Use the **Export** function in the application's configuration area to produce a configuration package. The export generates a zip file named in the format `package[yyyy][MM][dd]_[HH][mm].shaconfig`, for example `package20260613_0930.shaconfig`. The package contains the selected configuration items in JSON form.

### Import configuration

Use the **Import** function in the same area and select a previously exported `.shaconfig` package. Shesha reads the package and applies the configuration items it contains to the current instance.

:::info
Export and import are handled by the `ConfigurationItemAppService`, through its `ExportPackageAsync` and `ImportPackageAsync` operations. The same package format is used for both manual transfer and the automatic deployment described below.
:::

---

## Deploy configurations automatically

Configuration has become an integral part of applications, much like code. It is therefore important to have a convenient and reliable way to deploy configuration changes across environments, just as you would with code changes. To support this, configuration packages can be embedded as a resource inside a [Shesha module](modules) in the back-end application. When the application starts, the embedded package is imported automatically and the configuration is updated. This works in a similar way to database migrations.

### Embed a configuration package

To include configuration changes in a Shesha module:

1. Configure the items you need using the matching designers (for example the forms designer or the reference list editor).
2. Export the changes using the **Export** function. This generates a zip file named `package[yyyy][MM][dd]_[HH][mm].shaconfig`.
3. Add the `.shaconfig` file to the module's back-end project under a `ConfigMigrations` folder. Create the folder if it does not already exist.
4. Right-click the file, select **Properties**, and change the **Build Action** property from **None** to **Embedded Resource**. This ensures the file is included in the compiled module assembly.

### Import configuration on application startup

To trigger the import of embedded configuration packages on startup, override the `InitializeConfigurationAsync` method in your module class and call `ImportConfigurationAsync` from it. For example:

```csharp
public class SuperAppModule : SheshaModule
{
    public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo("MyCompany.SuperApp")
    {
        FriendlyName = "Super App",
        Publisher = "MyCompany",
    };

    public override async Task<bool> InitializeConfigurationAsync()
    {
        // Imports all embedded configuration packages automatically
        return await ImportConfigurationAsync();
    }

    public override void Initialize()
    {
        ...
    }
}
```

`InitializeConfigurationAsync` runs on every application start and returns a `bool` indicating whether the initialization was performed. `ImportConfigurationAsync` is provided by the base module and imports every embedded configuration package found in the assembly.

:::tip Best practice for exporting configurations
Export and embed configuration changes in fairly small, granular packages rather than infrequently and in bulk. This is especially helpful when configuration changes are meant to go out alongside matching code changes, because it lets both deploy together. It also makes it easier to trace a configuration change back to the specific feature it belongs to.
:::

---

## See also

- [Shesha Modules](modules)
