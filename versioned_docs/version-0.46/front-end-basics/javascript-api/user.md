---
sidebar_label: User
sidebar_position: 5
title: User API
---

# User API

The `user` object describes whoever is signed in right now. Use it to show a personal greeting, pre-fill a field with the current user's details, or decide whether to show something based on a permission or a role. It is available in every Shesha script.

---

## Reading the Current User

| Property | Type | What it is |
|---|---|---|
| `isLoggedIn` | `boolean` | `true` when a user is signed in |
| `id` | `string` | The id of the signed-in user's User record |
| `userName` | `string` | The user name they signed in with |
| `firstName` | `string` | Their first name |
| `lastName` | `string` | Their last name |
| `personId` | `string` | The id of the Person record linked to the user |

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Pre-fill a field with the current user:**

```javascript
const onInitialized = () => {
  if (user.isLoggedIn) {
    form.setFieldsValue({ capturedBy: user.personId });
  }
};
```

:::warning Always check isLoggedIn first
On a public or unauthenticated page there is no signed-in user, and every other property is empty. Guard on `user.isLoggedIn` before reading anything else.
:::

___

## Checking Permissions and Roles

#### **user.hasPermissionAsync(permissionName, permissionedEntity?)** `function`

Returns a promise resolving to `true` when the current user has been granted the named permission. The optional second argument is a reference to a permissioned entity, as `{ id, _className }`, for permissions that are scoped to a specific record.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Show an approve button only to users who may approve:**

```javascript
const getHidden = async () => {
  // Returning true hides the component, so invert the permission check.
  return !(await user.hasPermissionAsync('Applications.Approve'));
};
```

#### **user.hasRoleAsync(roleName)** `function`

Returns a promise resolving to `true` when the current user holds the named role.

```javascript
const getHidden = async () => {
  return !(await user.hasRoleAsync('Administrator'));
};
```

:::note Hiding is not securing
Hiding a button stops a user seeing it, but it does not stop anyone calling the endpoint behind it. Permission checks in a script are about presenting a sensible interface. The authoritative check belongs on the API. See [Endpoint Permissions](../../fundamentals/security/endpoint-permissions.md).
:::

___

## User Settings

#### **user.getUserSettingValueAsync(name, module, defaultValue?, dataType?)** `function`

Reads a user-specific application setting, returning a promise that resolves with the value.

#### **user.updateUserSettingValueAsync(name, module, value, dataType?)** `function`

Writes a user-specific application setting, returning a promise that resolves once the value is saved.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Remember a user's preferred page size:**

```javascript
const onChangeAsync = async () => {
  await user.updateUserSettingValueAsync('PreferredPageSize', 'Shesha', form.data.pageSize);
};
```

:::info user and application.user are the same object
`user` and `application.user` give you the same API. `user` is shorter and is what the editor suggests. See [Application API](./application/application.md).
:::
