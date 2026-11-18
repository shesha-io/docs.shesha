---
sidebar_label: Standard Roles and Permissions
sidebar_position: 3
title: Standard Roles and Permissions
---

# Standard Roles and Permissions

Shesha Core ships with a set of **built-in permissions** that protect its own screens and APIs, and four **standard roles** that bundle those permissions for the most common jobs. Together they give a new application a working, secure starting point: you assign people to roles, and they immediately get the access they need, without anyone having to hand-pick permissions.

This page lists the standard roles, the framework's permissions, and what each one controls. Read it when you are:

- Setting up users on a new Shesha application.
- Deciding which role to give someone.
- Securing your own screens or APIs and want to reuse a framework permission.
- Upgrading from an earlier 0.43 release and need to know which permission names changed.

If you are new to roles and permissions, read [Authorization and Access Control](/docs/fundamentals/security/access-control) first.

---

## The Standard Roles

Shesha Core defines four standard roles. They are **configuration items** in the `Shesha` module, packaged with Shesha Core and imported automatically when the application starts. You don't need to create them yourself.

| Role | What it's for | Give it to |
|---|---|---|
| **User** | Regular user. Can view and maintain the core business data: accounts, persons and organisations. | Most people who use the application day to day. |
| **User Administrator** | Administers other users: creating and updating users, resetting passwords and assigning roles, but no other system administration. | Help-desk or HR staff who look after user accounts. |
| **Configurator** | Performs system configuration: forms, entities, reference lists, menus and other configuration items. Can switch the application into Edit Mode. | People who build and change the application through configuration. |
| **System Administrator** | General system administration, including access to logs (logons, data changes, scheduled jobs), settings, maintenance tools and the Hangfire dashboard. Also holds all the permissions of the other three roles. | A small number of trusted administrators. |

:::info Developers use the Configurator role
The standard roles don't include a separate **Developer** role. Shesha treats developers and configurators the same way, so give developers the **Configurator** role. It grants the `Application-Configure` permission, which covers everything a developer needs to do through the application.
:::

### Permissions granted to each role

| Permission | User | User Administrator | Configurator | System Administrator |
|---|:---:|:---:|:---:|:---:|
| `Application-Configure` | | | ✔ | ✔ |
| `Application-Administer` | | | | ✔ |
| `Application-Settings` | | | | ✔ |
| `Application-Maintenance` | | | | ✔ |
| `Hangfire-Dashboard` | | | | ✔ |
| `User-View` | | ✔ | | ✔ |
| `User-Manage` | | ✔ | | ✔ |
| `User-ResetPassword` | | ✔ | | ✔ |
| `Role-Manage` | | | | ✔ |
| `Account-View`, `Account-Create`, `Account-Update`, `Account-Delete` | ✔ | | | ✔ |
| `Person-View`, `Person-Create`, `Person-Update`, `Person-Delete` | ✔ | | | ✔ |
| `Organisation-View`, `Organisation-Create`, `Organisation-Update`, `Organisation-Delete` | ✔ | | | ✔ |

:::tip Combine roles
A user can hold more than one role, and gets the permissions of all of them. For example, someone who builds forms and also looks after user accounts can be given both **Configurator** and **User Administrator**.
:::

### Assigning a standard role to a user

Assign standard roles in the same way as any other role, through the [user management interface](/docs/for-administrators/user-management) in the admin portal.

You can also assign roles from code with `IShaRoleManager`. Every assignment it makes is recorded in the audit trail.

```csharp
using Shesha.Roles;

public class OnboardingAppService : SheshaAppServiceBase
{
    private readonly IShaRoleManager _roleManager;
    private readonly IRepository<ShaRole, Guid> _roleRepository;

    public OnboardingAppService(IShaRoleManager roleManager, IRepository<ShaRole, Guid> roleRepository)
    {
        _roleManager = roleManager;
        _roleRepository = roleRepository;
    }

    public async Task MakeUserAdministratorAsync(Person person)
    {
        var role = await _roleRepository.FirstOrDefaultAsync(r => r.Name == "User Administrator");
        await _roleManager.AddToRoleAsync(person, role);
    }
}
```

### Changing the standard roles

The standard roles are normal configuration items, so you can change them like any other role. For example, you can add your own application's permissions to the **User** role. You can also create your own roles alongside them on the **Roles** page.

:::warning Roles are protected by `Role-Manage`
The role entity's CRUD APIs are locked in code (`IsConfigurable = false`). Creating, updating and deleting roles always requires the `Role-Manage` permission. Reading roles requires `Role-Manage` or `User-Manage`, so User Administrators can see the roles they assign. This cannot be opened up through configuration.
:::

### Existing applications

When an existing application is upgraded, the standard roles are imported into the `Shesha` module the same way as on a new installation. Your own roles (in your own modules) are left as they are. After upgrading, review who should hold each standard role. If you previously gave developers a role of your own for configuration work, you can replace it with the **Configurator** role.

---

## Framework Permissions

Shesha Core defines the permissions below. They are registered in the `Shesha` module and are available on the **Permissions** page and when you edit a role.

The names follow the documented [naming convention](/docs/fundamentals/security/access-control#permission-naming-conventions): `{Name of thing to secure}-{Action name}`.

### Application permissions

| Permission | Display name | What it controls |
|---|---|---|
| `Application-Configure` | Application Configure | Configuration of the application: the configuration item, entity/model configuration, permission and API configuration services. Also controls whether the **Edit Mode** switch is shown in the front end. |
| `Application-Administer` | Application Administer | Administration functions: the Permissioned Objects service, scheduled jobs, login-attempt and OTP audit logs, notifications, and changing reference lists and front-end applications. Also gives access to the Swagger UI. |
| `Application-Settings` | Application Settings | Access to the **Application Settings** page, and to listing and updating setting values through the settings API (also allowed with `Application-Configure` or `Application-Maintenance`). Reading a single value doesn't need it; see [Reading settings as a non-admin user](/docs/settings/creating-custom-settings#reading-settings-as-a-non-admin-user). |
| `Application-Maintenance` | Application Maintenance | Maintenance tools, such as the maintenance and email-sender services, scheduled jobs and settings. Also gives access to the Swagger UI. |
| `Hangfire-Dashboard` | Hangfire Dashboard | Access to the Hangfire dashboard at `/hangfire`. See [Background Jobs](/docs/fundamentals/background-jobs). |

### User and role permissions

| Permission | Display name | What it controls |
|---|---|---|
| `User-View` | User: View | Read-only access to users. Use it to secure your own user-listing screens; the framework's user APIs themselves require `User-Manage`. |
| `User-Manage` | User: Manage | Creating, updating and managing users. Also allows reading roles. |
| `User-ResetPassword` | User: ResetPassword | Resetting another user's password. The reset-password API accepts `User-Manage` or `User-ResetPassword`. |
| `Role-Manage` | Role: Manage | Creating, updating and deleting roles, and appointing people to roles. |

### Data permissions

These secure the CRUD APIs of the framework's core entities. Each entity uses one permission per action, through the [`[EntityAuthorize]`](/docs/back-end-basics/crud-apis#step-4-optional-different-rules-per-action-with-entityauthorize) attribute.

| Entity | View (Read) | Create | Update | Delete |
|---|---|---|---|---|
| `Account` | `Account-View` | `Account-Create` | `Account-Update` | `Account-Delete` |
| `Person` | `Person-View` | `Person-Create` | `Person-Update` | `Person-Delete` |
| `Organisation` | `Organisation-View` | `Organisation-Create` | `Organisation-Update` | `Organisation-Delete` |

### Using framework permissions in your code

All framework permission names are constants on one class: `Shesha.Authorization.PermissionNames`. Use these constants instead of typing the names as strings.

```csharp
using Shesha.Authorization;
using Shesha.Domain.Enums;

// Only users who can manage users may call this service.
[SheshaAuthorize(RefListPermissionedAccess.RequiresPermissions, PermissionNames.User_Manage, IsConfigurable = false)]
public class StaffImportAppService : SheshaAppServiceBase
{
    // ...
}
```

In the front end, check a permission by name:

```javascript
const canConfigure = await application.user.hasPermissionAsync("Application-Configure");
```

### Defining your own permissions

Follow the same pattern for your application's permissions: keep the names as constants in **one** class per module, and follow the `{Thing}-{Action}` convention.

```csharp
namespace MyCompany.MyApp.Authorization
{
    public static class MyAppPermissionNames
    {
        public const string Invoice_View = "Invoice-View";
        public const string Invoice_Manage = "Invoice-Manage";
        public const string Invoice_Approve = "Invoice-Approve";
    }
}
```

Then use them in your attributes:

```csharp
[Entity(CrudActions = CrudActions.All, CrudActionsAccess = CrudActionsAccess.RequiresPermissions)]
[EntityAuthorize(CrudAction.Read, [MyAppPermissionNames.Invoice_View, MyAppPermissionNames.Invoice_Manage])]
[EntityAuthorize(CrudAction.Create, [MyAppPermissionNames.Invoice_Manage])]
[EntityAuthorize(CrudAction.Update, [MyAppPermissionNames.Invoice_Manage])]
[EntityAuthorize(CrudAction.Delete, [MyAppPermissionNames.Invoice_Manage])]
public class Invoice : FullAuditedEntity<Guid>
{
    // ...
}
```

To create the permission records themselves, see [Managing Permissions](/docs/manage-apps-and-users/permission-based-model#managing-permissions).

---

## Upgrading: Renamed Permissions

Earlier 0.43 releases used several different naming styles inherited from ABP (`Pages.Users`, `app:Configurator`, `users:resetPassword` and so on). These have been renamed to the new convention.

A database migration renames them automatically when you upgrade, so **existing access rules keep working**. The migration updates:

- Permissions granted to roles.
- Permissions on permissioned objects (configured API and entity access).
- Permissions referenced in form configurations.
- Permissions on main menu items.

| Old name | New name |
|---|---|
| `app:Configurator` | `Application-Configure` |
| `pages:applicationSettings` | `Application-Settings` |
| `pages:maintenance` | `Application-Maintenance` |
| `Pages.Hangfire` | `Hangfire-Dashboard` |
| `Pages.Users` | `User-Manage` |
| `users:resetPassword` | `User-ResetPassword` |
| `Pages.Roles` | `Role-Manage` |
| `pages:shaRoles` | `Role-Manage` |
| `pages:persons` | `Person-View` |

:::warning Update your own code
The migration updates data in the database only. Search your own code (back end and front end) for the old names and replace them. For example:

```csharp
// Before
[SheshaAuthorize(RefListPermissionedAccess.RequiresPermissions, "Pages.Users")]

// After
[SheshaAuthorize(RefListPermissionedAccess.RequiresPermissions, PermissionNames.User_Manage)]
```

```javascript
// Before
await application.user.hasPermissionAsync("app:Configurator");

// After
await application.user.hasPermissionAsync("Application-Configure");
```
:::

---

## See Also

- [Authorization and Access Control](/docs/fundamentals/security/access-control)
- [Endpoint Permissions](/docs/fundamentals/security/endpoint-permissions)
- [Dynamic CRUD APIs](/docs/back-end-basics/crud-apis)
- [Permission Based Security Model](/docs/manage-apps-and-users/permission-based-model)
