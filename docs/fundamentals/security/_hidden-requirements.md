---
sidebar_label: Hidden Documentation
draft: true
---

# Hidden Documentation

This page is hidden from the site navigation as it contains internal notes.


# NEW REQUIREMENTS

- Need to decide whether User vs Person
- We should remove the dependency on ABP for management of security including users and permissions.
- We should of course take the elements that make sense including:
  - `IAbpSession` to get the current user ID
  - `IPermissionChecker` to check for permissions

Based on the examples above we need the following:
### ICurrentUser
# NOTE:!!!!! Previous code indicates how you would implement this currently. However, it would be preferrable to simplify this in future by exposing the `ICurrentUser` interface similar to ABP.io. However, in our implementation we have extended it to support: Person, Permission checking (in ABP.io this is done via the PermissionChecker), Scoped roles and permissions:

## TODO: Need to decide if make moduleName mandatory when checking permissions:
- Option 1: Make optional - Would simplify logic especially for beginners who would most likely have single module solutions; In cases where same permission name is defined in multiple modules, return true if user has permission from any of the modules
- Option 2: Make mandatory
- Option 3: Allow specifying moduleName as part of the permission name, e.g. `PermissionName@ModuleName`

```
bool ICurrentUser.IsInRole(string moduleName, string roleName); // Returns true if the current user is in the specified role for the given module.
bool ICurrentUser.IsInRole("RoleName"), Guid id); // Returns true if the current user is in the specified role for the entity with the given ID.
bool ICurrentUser.HasPermission("PermissionName")
bool ICurrentUser.HasPermission("PermissionName", Guid id); // Returns true if the current user has the specified permission for the entity with the given ID.
Guid[] ICurrentUser.GetPermissionScope(string permissionName); // Returns a list of IDs for entities that the current user has access to based on the specified scoped permission.
Guid[] ICurrentUser.GetRoleScope(string roleName); // Returns a list of IDs for entities that the current user has access to based on the specified scoped role.
```

### Standard Roles
- `User` - Basic role for most users, providing access to standard application features such as viewing and updating business data as well as viewing and updating their own profile information.
- `Administrator` - Provides access to administrative functions, including user management, role assignment, viewing of audit trails, and managing basic system settings.
- `Configurator` - Provides access to the Configuration Studio allowing the user to configure the system, including creating and managing forms, lists, and other configuration settings.

### Standard Permissions
- User
  - `User-View` - Allows viewing user profiles.
  - `User-Create` - Allows creating new users.
  - `User-Update` - Allows updating user profiles.
  - `User-Delete` - Allows deleting users.
  - `User-ResetPassword` - Allows resetting user passwords.
  - `User-Suspend` - Allows suspending user accounts.
  - `User-AssignRoles` - Allows assigning roles to users.
- Account
 - `Account-View` - Allows viewing account details.
 - `Account-Create` - Allows creating new accounts.
 - `Account-Update` - Allows updating account information.
 - `Account-Delete` - Allows deleting accounts.
- Person
 - `Person-View` - Allows viewing person details.
 - `Person-Create` - Allows creating new persons.
 - `Person-Update` - Allows updating person information.
 - `Person-Delete` - Allows deleting persons.

### Required RoleTypeConfig coonfigurations
The following RoleTypeConfig configurations should be defined in the system along with associated form configurations:
- `Organization-scoped`
- `Account-scoped`

### API Authorization
- Support for `[ShaAuthorize(string[] permissions)]` attribute to enforce role-based access control on methods and classes. (As a substitute to existing `[AbpAuthorize(string[] permissions)]` attribute)
  - Needs to be able to support specifying module name as well

### Restricting Who Can Assign Roles
- By default, only users with the `User-AssignRoles` role can assign any role to other users.
- It should be able to restrict this further by specifying this on the RoleTypeConfig:
  - RequiredPermissionForAssignment - If specified, only users with this permission can assign the role to other users

---
---
Clean-up:
- docs\manage-apps-and-users\permission-based-model.md
- docs\manage-apps-and-users\user-management.md
- docs\how-to-guides\permission-based-security-model.md
- docs\fundamentals\user-registration.md
- docs\fundamentals\roles-and-permissions.md
---
---