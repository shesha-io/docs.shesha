---
sidebar_label: Configuration
---

# Configuration

As a low-code platform much of the application behavior is defined configuration rather than code. Understanding how configurations are managed and critically how they can be distributed is therefore essential.

The most commonly defined and used configurations include form configurations and reference lists. 

:::warning Missing Configuration Items
In addition to forms and reference lists, other items such as menu structures, app settings, roles, permissions, and entity configurations can also be configured. However, currently, these items lack the ability for easy distribution explained below. This will be addressed in future versions of Shesha.
:::

The most import distiguisihing feature of a configuration item is that they are stored as data in the application database, but can be exported and imported between different instances in a Json format.

# Distributing Configurations Manually
Configuration can be manually exported and imported between different instances of Shesha.

## Exporting Configuration

#TODO: Add more details on how to import configuration

## Importing Configuration Manually

#TODO: Add more details and screenshots on how to import configuration


# Distributing Configurations Automatically

Configuration has become an integral part of applications, akin to code. As such, it's crucial to have a convenient and seamless method to distribute configuration changes across different environments, just as you would with code changes. To aid in this, configuration packages can be embedded as a resource in the back-end application. Upon application startup, the configuration package is automatically imported, and the configuration is updated. This process is similar to how database migrations operate.

## Embeding a Configuration Package

#TODO: Add more details and screenshots on how to embed configuration changes

How to include package into the back-end solution:

1. Configure required items using corresponding configurators (e.g. forms designer, reference list editor).
2. Export items as a package using the `Export` function. It generates a zip file with the name `package[yyyy][MM][dd]_[HH][mm].shaconfig`.
3. Include the `.spaconfig` file into the module project as an embedded resource.
[Show screenshot]


## Importing Configuration On Application Startup

To trigger the import of embeded configuration packages on application startup, simply call the `InitializeConfigurationAsync` method from the `Initialize` method of your module class. For example:
``` cs
public class SuperAppModule : SheshaSubModule<SuperAppModule>
{

    public override async Task<bool> InitializeConfigurationAsync()
    {
        // Will import all embedded configuration packages automatically
        return await ImportConfigurationAsync();    
    }

    public override void Initialize()
    {
        ...
    }
    ...
    
}
```
