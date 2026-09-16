---
sidebar_label: Security Classes and Interfaces
sidebar_position: 5
title: Security Classes and Interfaces
---

# Security Classes and Interfaces

Shesha's authorization system is built from a handful of cooperating classes: one that manages roles, one that checks whether a user holds a permission, one that manages the "Protected Objects" a permission applies to, and one that ties the two together to authorize a request. This page covers each of them.

---

## `RoleManager`

`RoleManager` extends ASP.NET Identity's `AbpRoleManager<Role, User>` and adds two Shesha-specific overrides:

| Method | What it does |
|---|---|
| `CheckDuplicateRoleNameAsync(expectedRoleId, name, displayName)` | Throws a friendly exception if another role already uses the given name or display name |
| `GetRoleByName(roleName)` | Looks up a role by name, throwing if none exists |

Everything else you'd expect from a role manager (create, update, delete, assign to users) comes from the inherited `AbpRoleManager` base class, not from Shesha-specific code.

:::note
There is no Shesha-specific `UserManager` with custom role or permission methods, and no `ScopedRole` entity or `AssignScopedRoleAsync` method anywhere in the codebase. If you need user/role assignment, use the inherited ABP Identity APIs directly.
:::

---

## `IShaPermissionChecker`

`IShaPermissionChecker` extends ABP's `IPermissionChecker` and adds the actual permission-checking surface used throughout Shesha:

```csharp
public interface IShaPermissionChecker : IPermissionChecker
{
    Task ClearPermissionsCacheForUserAsync(long userId, int? tenantId);
    Task ClearPermissionsCacheAsync();

    Task<bool> IsGrantedAsync(string permissionName, EntityReferenceDto<string> permissionedEntity);
    Task<bool> IsGrantedAsync(long userId, string permissionName, EntityReferenceDto<string> permissionedEntity);

    bool IsGranted(string permissionName, EntityReferenceDto<string> permissionedEntity);
    bool IsGranted(long userId, string permissionName, EntityReferenceDto<string> permissionedEntity);
}
```

The `permissionedEntity` parameter lets a permission check be scoped to a specific entity reference, rather than only checking a permission globally.

:::note
There is no `ICurrentUser` interface in Shesha. Current-user permission and role checks go through `IShaPermissionChecker` and the standard ABP session/user APIs, not a Shesha-specific current-user abstraction.
:::

---

## `IPermissionedObjectManager`

Shesha calls an API endpoint, form, or component that can be permission-restricted a **Protected Object**. `IPermissionedObjectManager` manages these:

| Method | What it does |
|---|---|
| `GetOrDefaultAsync(objectName, objectType)` | Gets a Protected Object's permission settings by name (format `type@action`), or a default if none is configured |
| `SetPermissionsAsync(objectName, access, permissions)` | Sets the required access level and permissions for a Protected Object |
| `GetAllFlatAsync` / `GetAllTreeAsync` | List all Protected Objects, flat or hierarchical |
| `IsActionDescriptorEnabledAsync(actionDescriptor)` | Checks whether an MVC action is disabled as a Protected Object |

---

## `ObjectPermissionChecker`

`ObjectPermissionChecker` (implementing `IObjectPermissionChecker`) is the class that actually ties `IPermissionedObjectManager` and `IShaPermissionChecker` together to authorize a request. Its `AuthorizeAsync` method is the real internal entry point Shesha's endpoint authorization goes through:

```csharp
[UnitOfWork]
public async Task AuthorizeAsync(
    bool requireAll,
    string permissionedObject,
    string method,
    string objectType,
    bool IsAuthenticated,
    RefListPermissionedAccess? replaceInherited = null)
{
    if (!_authConfiguration.IsEnabled)
        return;

    var methodName = PermissionedObjectManager.GetCrudMethod(method, method);
    var permissionName = $"{permissionedObject}@{methodName}";

    var permission = await _permissionedObjectManager.GetOrDefaultAsync(permissionName, objectType);

    var actualAccess = replaceInherited != null && permission?.ActualAccess == RefListPermissionedAccess.Inherited
        ? replaceInherited
        : permission?.ActualAccess;

    if (permission == null
        || actualAccess == RefListPermissionedAccess.AllowAnonymous
        || actualAccess == RefListPermissionedAccess.AnyAuthenticated && IsAuthenticated)
        return;

    if (!IsAuthenticated)
        throw new AbpAuthorizationException("Current user did not login to the application!");

    if (actualAccess == RefListPermissionedAccess.Disable)
        throw new EntityNotFoundException("Not found");

    if (actualAccess == RefListPermissionedAccess.RequiresPermissions
        && (permission.ActualPermissions == null || !permission.ActualPermissions.Any()))
        throw new AbpAuthorizationException("Access Denied");

    await _permissionChecker.AuthorizeAsync(false, permission.ActualPermissions?.ToArray());
}
```

Reading this top to bottom shows the actual precedence Shesha applies: authorization is skipped entirely if it's globally disabled, `AllowAnonymous`/`AnyAuthenticated` short-circuits the check, an unauthenticated caller is rejected before anything else, `Disable` returns a 404 rather than a 401/403, and only then does it fall through to checking the object's configured permissions via `IShaPermissionChecker`.
