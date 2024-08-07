---
sidebar_label: App Settings
---
# App Settings

# TODO:
- Start with Admin Panel
- Simple App Setting
- Compound App Setting

---
Shesha uses custom implementation of the application settings. Key features:
1. Settings are strongly typed on the back-end, a developer doesn't need to serialize/deserialize values from strings
2. Auto-registration of setting accessors
3. Setting definitions are stored in the DB
4. Settings defined in the code gets saved to the DB at the application start
4. Support of client specific settings
5. Unlimited length of the setting value

# How to define a setting
A setting must be defined before its use, it should be done in two steps:
1. Define a settings accessor.
2. Register accessors and provide default values.

### Define a settings accessor
Settings accessor is an interface that provides an access to settings values, also it's used to define setting details (display name, description etc.).
You just need to create and interface that extends `ISettingAccessors` and add property for each setting as `ISettingAccessor<T>` where T - type of the setting.

```cs
    /// <summary>
    /// Email settings
    /// </summary>
    [Category("Email")]
    public interface IEmailSettings : ISettingAccessors
    {
        /// <summary>
        /// Emails enabled
        /// </summary>
        [Display(Name = "Emails enabled", Description = "If true, all emails are enabled")]
        [Setting(SheshaSettingNames.Email.EmailsEnabled)]
        ISettingAccessor<bool> EmailsEnabled { get; }

        /// <summary>
        /// Redirect all emails to
        /// </summary>
        [Display(Name = "Redirect all emails to", Description = "If not null or empty the all outgoing emails will be sent to this email address, is used for testing only")]
        [Setting(SheshaSettingNames.Email.RedirectAllMessagesTo)]
        ISettingAccessor<string> RedirectAllMessagesTo { get; }

        /// <summary>
        /// SMTP Settings
        /// </summary>
        [Display(Name = "SMTP Settings")]
        [Setting(SheshaSettingNames.Email.SmtpSettings, EditorFormName = "smtp-settings")]
        ISettingAccessor<SmtpSettings> SmtpSettings { get; }
    }
``` 

On the example above you can see the `IEmailSettings` interface, it has 3 strongly types properties:
1. EmailEnabled - bool
2. RedirectAllMessagesTo - string
3. SmtpSettings - complex object of type `SmtpSettings`

Properties and the interface itself are decorated with the following attributes:
1. `DisplayAttribute` - is used to define a `Display Name`, `Description` and `Category` (using `GroupName` property)
2. `Category` - defines `Category` of the setting, can be applied on the interface level. Note: if the `CategoryAttribute` and `DisplayAttribute` are defined at the same time on the property level the value from `CategoryAttribute` will be applied.
3. `Setting` - defines setting-specific properties:
3.1 `Name` - name of the setting. Property name is used when attribute is missing
3.2 `IsClientSpecific` - indicates that the setting is a client-specific
3.3 `EditorFormName` - name of the custom form that is used as a setting editor

### Register a settings accessor
After creating a settings accessor, we must register it in the PreInitialize method of our module:
```cs
IocManager.RegisterSettingAccessor<IEmailSettings>(s => {
        // set default value
	s.SmtpSettings.WithDefaultValue(new SmtpSettings
	{
		Port = 25,
		UseSmtpRelay = false,
		EnableSsl = false,
	});
});
```

# Read and write setting values on back-end
To read and write setting values you just need to resolve your settings interface (`IEmailSettings` from the example above) and use it's properties. Shesha generates an implementation of the interface automatically when you call `RegisterSettingAccessor`.

In the example below we resolve `IEmailSettings` using constructor injection. The `TestSetting` method reads and writes the `SmtpSetting`, the value is strongly typed and we needn't perform any conversions manually.

```cs
private readonly IEmailSettings _emailSettings;
public SheshaEmailSender(IEmailSettings emailSettings)
{
	_emailSettings = emailSettings;
}

public async Task TestSetting() 
{ 
	// get value
	var smtpSettings = await _emailSettings.SmtpSettings.GetValueAsync();

	// update setting
	smtpSettings.Host = "localhost";
	await _emailSettings.SmtpSettings.SetValueAsync(smtpSettings);
}
```

Note: client-specific settings are handled automatically and you can use the same methods `GetValueAsync` and `SetValueAsync` for reading and writing. Shesha recognizes a current application automatically using the `sha-frontend-application`, see details [here](https://dev.azure.com/boxfusion/Shesha%20Web%20v3.0/_wiki/wikis/Shesha-Web-v3.0.wiki/791/Multiple-front-end-applications-support)

# Read setting values on front-end
`SettingsProvider` is responsibel for reading settings on the front-end. You can use one of these react hooks: 
1. `useSettings` - provides an access to the `SettingsProvider` context
2. `useSettingValue` - reads a single setting from the back-end, see example of the usage below

```ts
const autoLogoffTimeoutSettingId: ISettingIdentifier = { name: 'Shesha.Security.AutoLogoffTimeout', module: 'Shesha' };

export const IdleTimerRenderer: FC<PropsWithChildren<IIdleTimerRendererProps>> = ({ children }) => {
  const { 
    value: autoLogoffTimeout, // contains undefined when setting is not loaded and setting value when loaded
    loadingState, // contains loadingstate ('waiting' | 'loading' | 'ready' | 'failed')
    error // contains error returned by the back-end if http request are failed 
  } = useSettingValue<number>(autoLogoffTimeoutSettingId);

  // note: autoLogoffTimeout contains `undefined` when settings is not yet loaded
  const timeoutSeconds = autoLogoffTimeout ?? 0;
```

# Settings storage and SettingsBootstrapper
Setting definitions and values are stored in the DB, see the diagram below. Shesha saves all settings defined in code to the DB at the application startup using `SettingsBootstrapper`.


# Migrations

`Shesha.FluentMigrator` provides a fluent interface that allows to addition, updating and deletion of application settings.
All migrator expressions are available using `this.Shesha()` extension:
1. `SettingCreate` - create setting configuration
2. `SettingUpdate` - update setting configuration and/or set value
3. `SettingDelete` - delete setting configuration

Examples provided below:

```cs
    [Migration(20230313090500)]
    public class M20230313090500 : AutoReversingMigration
    {
        public override void Up()
        {
            // create a `Greeting` setting in the current module
            this.Shesha().SettingCreate("Greeting", "Login greeting template")
                .WithCategory("Logon") // set category, is unsed in the generic settings UI
                .IsClientSpecific() // mark setting as application specific 
                .AsString(); // set datatype of the setting

            // update value of the `Greeting` setting for the `admin-portal` application
            this.Shesha().SettingUpdate("Greeting")
                .SetValueForApplication("admin-portal", "Welcome!");

            // create a `AutoLogoffTimeout` setting on module `TestModule`
            this.Shesha().SettingCreate("AutoLogoffTimeout", "Auto logoff timeout")
                .OnModule("TestModule")
                .WithDescription("Auto logoff timeout (seconds)")
                .AsInt64();

            // update value of the `AutoLogoffTimeout` setting
            this.Shesha().SettingUpdate("AutoLogoffTimeout")
                // define a module explicitly
                .OnModule("TestModule")
                .SetValue("300");

            // delete setting
            this.Shesha().SettingDelete("AutoLogoffTimeout").FromModule("TestModule");
        }
    }
```

**Note**: if the module is not specified explicitly, Shesha automatically populates it based on the assembly the Migrator file is defined in.

# Settings Administration UI

Shesha provides default Settings Administration UI as part of the application template. It's available here: http://localhost:3000/shesha/settings/

![image.png](/img/app-settings-admin-view.png)