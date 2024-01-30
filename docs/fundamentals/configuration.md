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

## Deploy configurations manually
Configuration can be manually exported and imported between different instances of Shesha.

### Export configuration

#TODO: Add more details on how to import configuration

### Import configuration

#TODO: Add more details and screenshots on how to import configuration


## Deploy configurations automatically

Configuration has become an integral part of applications, akin to code. As such, it's crucial to have a convenient and seamless method to deploy configuration changes across different environments, just as you would with code changes. To aid in this, configuration packages can be embedded as a resource in a [Shesha module](modules) in the back-end application. Upon application startup, the configuration package is automatically imported, and the configuration is updated. This process is similar to how database migrations operate.

### Embed a configuration package

To include configuration changes into a Shesha module:

1. Configure required items using corresponding configurators (e.g. forms designer, reference list editor).
2. Export the configuration changes you need to deploy using the `Export` function. It generates a zip file with the name `package[yyyy][MM][dd]_[HH][mm].shaconfig`.
3. Add the `.spaconfig` file to the module back-end project under the `ConfigMigrations` folder (You may need to create it if it does not exist). 
4. Right-mouse click on the file and select 'Properties', then change the 'Build Action' property from 'None' to 'Embedded Resource'. This will ensure that the file is included in the compiled module assembly.


[TODO: Show screenshots]


### Import configuration on application startup

To trigger the import of embeded configuration packages on application startup, simply call the `InitializeConfigurationAsync` method from the `Initialize` method of your module class. For example:
``` cs
public class SuperAppModule : SheshaModule<SuperAppModule>
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

:::tip Best Practices for Exporting Configurations 
It is advisable to export and embed configuration changes in a fairly granular manner, rather than exporting infrequently and in bulk. This approach is particularly beneficial when configuration changes are meant to coincide with corresponding code modifications, ensuring that both are deployed simultaneously. Additionally, this method enhances traceability to specific features. 
:::

## See also
- [Shesha Modules](modules)