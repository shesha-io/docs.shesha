---
sidebar_label: Security Classes and Interfaces
position: 5
title: Security Classes and Interfaces
---

# Security Classes and Interfaces
Shesha's security framework includes several key classes and interfaces that work together to provide a robust security model. These components are designed to manage user roles, permissions, and access control effectively.

## `RoleManager`
The `RoleManager` is a key component in Shesha's security framework, responsible for managing roles and permissions. It provides methods to create, update, delete, and assign roles to users, as well as to check if a user has a specific role or permission.
The `RoleManager` is typically used in conjunction with the `ICurrentUser` interface to enforce security policies and ensure that users can only perform actions they are authorized for.

### Assigning Roles Programmatically
To assign roles programmatically, you can use the following example code. This code demonstrates how to assign a scoped role to a user and link it with specific permissions.

```csharp
public async Task AssignScopedRoleAsync(Guid userId, string roleName, string scope)
{
    var user = await _userRepository.GetAsync(userId);
    if (user == null)
        throw new Exception("User not found");

    var scopedRole = new ScopedRole
    {
        RoleName = roleName,
        Scope = scope
    };

    await _scopedRoleRepository.InsertAsync(scopedRole);
}
```

:::info To Be Completed
TODO: Expand with additional examples of RoleManager methods and usage
:::

## `UserManager`
The `UserManager` is responsible for managing user accounts, including creating, updating, and deleting users. It also handles user authentication and authorization, ensuring that users can only access resources they are permitted to.
The `UserManager` works closely with the `RoleManager` to assign roles to users and check their permissions. It provides methods to retrieve user information, such as roles and permissions, and to validate user credentials during login.

:::info To Be Completed
TODO: Expand with examples of UserManager methods and usage
:::

## `ICurrentUser`
The `ICurrentUser` interface is designed to provide access to the current user's information, including their roles and permissions. It allows you to check if the user is in a specific role or has a specific permission, and it can also provide scoped roles and permissions based on the context of the user's actions.

### Checking User Roles

```csharp
public async Task<bool> IsInRoleAsync(Guid userId, string roleName, string scope)
{
    var userRoles = await _scopedRoleRepository.GetUserRolesAsync(userId);
    return userRoles.Any(r => r.RoleName == roleName && r.Scope == scope);
}
```

### Checking User Permissions
```csharp
public async Task<bool> HasPermissionAsync(Guid userId, string permissionName)
{
    var userPermissions = await _scopedRoleRepository.GetUserPermissionsAsync(userId);
    return userPermissions.Any(p => p.Name == permissionName);
}
```