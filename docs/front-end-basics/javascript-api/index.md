# JavaScript API

Shesha allows to interact with application using JavaScript API. This API can be used in any user-defined code on the form or form component level.
Central point of the JS API is the **'application'** exposed variable. It contains all standard Shesha objects (e.g. user, settings, entities etc)

## Top Level Availbale Objects and Functions  

- application
- contexts
- data
- fileSaver
- form
- globalState
- http
- message
- moment
- pageContext
- selectedRow

## Current user API – application.user

Requirements for this API available on [GitHub (issue 819)](https://github.com/shesha-io/shesha-framework/issues/819). It’s an object that contains following properties:

1. isLoggerIn (`bool`) – is true of the user is currently logged in
2. id (`string`) – id of the current logged in user (Id of the User entity)
3. firstName (`string`) – first name of the current user
4. lastName (`string`) – last name of the current user
5. userName (`string`) – user name of the current user
6. hasPermissionAsync (`function(permission: string, permissionedEntity?: IEntityReferenceDto) => Promise<boolean>`) – asynchronous function that check is the current user granted a specified permission. It allows to provide Permissioned Entity reference (`id` and `_className`) to checking for permissions scoped by Permissioned Entity
7. hasRoleAsync (`function(role: string) => Promise<boolean>`) – asynchronous function that check is the current user appointer to a specified role
8. personId (`string`) - personId of the current user

Example of the usage:

```javascript
const onAfterDataLoad = async (): Promise<void> => {
    const { user } = application;
    if (user.isLoggedIn) {
        console.log('User is logged in ');
        console.log("Current user is: ", user);
        console.log(`user id: ${user.id}`);
        console.log(`userName: ${user.userName}`);
        console.log(`firstName: ${user.firstName}`);
        console.log(`lastName: ${user.lastName}`);
        console.log(`person id: ${user.personId}`);

        const adminRole = 'System Administrator';
        console.log(`Check is user granted role '${adminRole}' ... `);

        try {
            const isGranted = await user.hasRoleAsync(adminRole);
            console.log(`Check is user granted role "${adminRole}" - ${isGranted ? "✅" : "❌"}`);
        }
        catch (error) {
            console.log("Failed to check role", error);
        }
    }
    else {
        console.log('User is NOT logged in');
    }
};
```

## Settings API – application.settings

**application.settings** object allows to read and write values of application settings. Shesha uses the following format of the setting signature:

    application.settings.[module].[group].[setting]

Where module, group and setting are accessors (human readable code identifier of object). Logic of the accessors calculation:

1. Module: module alias with fallback to name in camelCase format. On the example below accessor of the module is **functionalTests**, but if you remove the **Alias** property it will be **boxfusionSheshaFunctionalTestsCommon**

```csharp
public class SheshaFunctionalTestsCommonModule : SheshaModule
{
    public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo("Boxfusion.SheshaFunctionalTests.Common")
    {
        FriendlyName = "Shesha Functional Tests Common",
        Publisher = "Boxfusion",
        Alias = "functionalTests"
    };

    /// ...
}
```

2. Group: alias of ISettingAccessors with fallback to interface name without `I` prefix and `Settings` suffix. On the example below accessor is **common**, but if you remove the AliasAttribute it will be **test**

```csharp
[Category("Tests")]
[Alias("common")]
public interface ITestSetting : ISettingAccessors
{
    [Display(Name = "UserLockout")]
    [Setting(TestSettingNames.UserLockout)]
    ISettingAccessor<int> UserLockoutItem { get; }

    [Display(Name = "Test Complex", Description = "Testing the complex setting item")]
    [Setting(TestSettingNames.TestComplex, EditorFormName = "complex-setting-test")]
    ISettingAccessor<TestComplexSetting> TestComplexSetting { get; }

    [Display(Name = "Stars Count")]
    [Setting(TestSettingNames.StarsCount)]
    ISettingAccessor<int> StarsCount { get; }
}
```

3. Setting: alias of the setting property with fallback to the property name in camelCase format.

```csharp
[Category("Tests")]
[Alias("common")]
public interface ITestSetting: ISettingAccessors
{
    [Display(Name = "UserLockout")]
    [Setting(TestSettingNames.UserLockOut)]
    ISettingAccessor<int> UserLockoutItem { get; }

    [Display(Name = "Test Complex", Description = "Testing the complex setting item")]
    [Setting(TestSettingNames.TestComplex, EditorFormName = "complex-setting-test")]
    ISettingAccessor<TestComplexSetting> TestComplexSetting { get; }

    [Display(Name = "Stars Count")]
    [Setting(TestSettingNames.StarsCount)]
    [Alias("stars")]
    ISettingAccessor<int> StarsCount { get; }
}
```

Example of settings usage:

```javascript
const evaluator = async () => {
    const settings = application.settings.functionalTests.common;
    
    console.log("Get stars count...");
    const starsCount = await settings.starsCount.getValueAsync();
    console.log(`We got ${starsCount} stars: ${'★'.padEnd(starsCount, '★')}`);
};
```

**Note**: all settings of simple types are strongly typed, you can see it on the example above, the **starsCount** is declared as `ApplicationSettingAccessor<**number**>`

Read and write setting example:

```javascript
const evaluator = async () => {
    const settings = application.settings.functionalTests.common;
    
    console.log("Get stars count...");
    const starsCount = await settings.starsCount.getValueAsync();
    console.log(`We got ${starsCount} stars`);
    
    const newStars = starsCount + 1;
    console.log(`Set number of stars to ${newStars}...`);
    await settings.starsCount.setValueAsync(newStars);
    console.log(`Set number of stars to ${newStars} - success`);
};
```

## Entities API – application.entities

**application.entities** provides basic operations on entities. Selection of the entity type is done using dot notation (the same approach as for application settings):

    application.entities.[module].[entityType]

Each entity type contains 4 basic CRUD methods:

1. [`createAsync`](/docs/front-end-basics/javascript-api/application/entities#createasync) – create a new entity.
2. [`getAsync`](/docs/front-end-basics/javascript-api/application/entities#getasync) – fetch entity data from the back-end.
3. [`updateAsync`](/docs/front-end-basics/javascript-api/application/entities#updateasync) – update entity.
4. [`deleteAsync`](/docs/front-end-basics/javascript-api/application/entities#deleteasync) – delete entity.

All listed operations use default CRUD API endpoints and don't require manual usage of urls.

## Shesha JavaScript API Plugins

Shesha allows developers to extend the application JS API using `useApplicationPlugin` hook. Example of usage provided below:

```typescript
import { useApplicationPlugin } from '@shesha-io/reactjs';

export const MyApplicationPlugin: FC<PropsWithChildren> = ({ children }) => {
    const [contextData] = useState<IMyPluginApi>(() => new MyPluginApi());

    useApplicationPlugin({
        // name of the plugin
        name: 'myPlugin',
        // plugin metadata
        buildMetadata: (builder) => {
            builder.addObject("myPlugin", "My Plugin API", m => ...);
        },
        // plugin data (api)
        data: contextData
    });

    return (<> {children} </> );
};
```
