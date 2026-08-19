---
sidebar_label: User Management
---

# User Administration

**User Administration** refers to the tools and processes used to manage who can log in to a Shesha application (users) and what they are allowed to do once logged in (roles and permissions). This is a critical part of application security and usability, ensuring that only authorized users can access sensitive data and perform actions appropriate to their role.

---

## Person and User Entities

Shesha comes with both a `Person` entity and a `User` entity as part of its core domain model, and it is important to understand the difference and relationship between the two.

The `Person` entity (`Shesha.Domain.Person`) stores and manages information about a person, whether or not that person is a system user. The `User` entity (`Shesha.Authorization.Users.User`) is used specifically to manage system user accounts, such as login credentials, lockout status, and account activation. A `Person` record links to its matching `User` record through a `User` property. For a person to be able to log in, both a `Person` record and a linked `User` record need to exist.

Since the information a system needs to store about a person will often differ depending on the requirements, it is expected that in most implementations the `Person` entity will be extended by creating sub-classes with additional properties. In contrast, the `User` entity is not expected to be extended, since the framework already provides the account management features it needs (creation, password management, lockout, activation, and so on) through the `UserManager` class.

### Example

Imagine you are building a system used to manage client information, where only company employees should have access to the system.

Since both clients and employees are more specific types of persons, you would create `Client` and `Employee` sub-classes that inherit from `Person` and add the relevant properties to each. You would, however, only create matching `User` records for the `Employee` entities.

Should you later want to build a client portal so your clients can access limited functions of the system, you could create `User` records for them as they register. You would then limit their access to certain functions by assigning them different roles than your internal employees.

---

## Managing Users

### Creating a User

Users can be added to the system by entering the required details, such as username, password, and email address. Depending on the configured security settings, the registration process may also involve verifying the user's email address or mobile number before the account can be used.

To add a new user in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/xrg45ggf1r" type={1}/>

### Editing a User

To edit an existing user in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/5pvnjmguxk" type={1}/>

### Assigning Roles to Users

In Shesha, users are assigned to roles to control their access within the system. This process involves selecting the roles that align with the user's responsibilities and the permissions required for their tasks.

To assign roles to users in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/0p0v4o5ivk" type={1}/>

### Activating and Deactivating a User

A user account can be activated to allow login, or deactivated to prevent it, without deleting the underlying account. This is useful for suspending access temporarily, for example while an employee is on leave, without losing their account history.

Separately from activation, a user account can also become locked out automatically after too many failed login attempts. This lockout is time-based and governed by the application's security settings, rather than something an administrator toggles directly on the user record.

To activate or deactivate a user account in Shesha, do so through the details view of the user.


---

## UserManager and UserAppService Classes

Most system account management functions you need, such as creating accounts, activating or deactivating them, and managing passwords, are already supported by the framework through the `UserManager` and `UserAppService` classes.

`UserManager` (`Shesha.Authorization.Users.UserManager`) handles the lower-level account operations. It exposes methods such as `CreateUserAsync(...)` to create an account, and `SetRolesAsync(User user, string[] roleNames)` to bring a user's roles in line with a given list (adding and removing roles as needed), plus password and lockout policy configured through the application's security settings.

`UserAppService` (`Shesha.Users.UserAppService`) exposes these operations as application service endpoints that the front-end can call:

| Method | What it does |
|---|---|
| `CreateAsync(CreateUserDto input)` | Creates a new user account |
| `UpdateAsync(UserDto input)` | Updates an existing user's details and roles |
| `DeleteAsync(EntityDto<long> input)` | Deletes a user account |
| `ActivateUserAsync(long userId)` | Re-enables a disabled account |
| `InactivateUserAsync(long userId)` | Disables (locks) an account |
| `ChangePasswordAsync(ChangePasswordDto input)` | Lets a user change their own password |
| `ResetPasswordAsync(ResetPasswordDto input)` | Lets an administrator reset another user's password |

Password reset flows support email links, SMS one-time passwords, and security questions.

:::note
`ResetPasswordAsync` requires the calling user to hold the `Users_ResetPassword` permission. This is checked separately from the general `Pages.Users` permission that guards the rest of the Users screen.
:::

:::note
Roles can also be scoped to a specific `Person` rather than assigned globally. This is managed separately through role appointment records, which link a person to a role for a specific context.
:::

---

## See Also

* Adding custom user fields (profile extensions)
* Integrating with external identity providers (Azure AD, OAuth)
* Configuring audit trails for user actions
* Enforcing security best practices
* Viewing logon audit trails
* Viewing role assignment audit trails
