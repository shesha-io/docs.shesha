---
sidebar_label: User Management
---

# User Administration

**User Administration** refers to the tools and processes used to manage who can log in (users) and what they can do (roles and permissions). This is a critical part of application security and usability, ensuring that only authorized users can access sensitive data and perform actions appropriate to their roles.

Shesha separates "being a person the system knows about" from "being able to log in" into two distinct entities: `Person` and `User`. Understanding how these two relate is the foundation for everything else in this page.

---

## Person and User Entities

The `Person` entity (`Shesha.Domain.Person`) stores information about a person, whether or not that person can log in to the system. It holds general details such as `FirstName`, `LastName`, `MiddleName`, `EmailAddress1`/`EmailAddress2`, `MobileNumber1`/`MobileNumber2`, `DateOfBirth`, `Gender`, `Title`, and address information, plus a calculated `FullName`.

`Person` is designed to be extended. Most real implementations create sub-classes of `Person` (for example `Client` or `Employee`) that add the properties relevant to that type of person, using Shesha's discriminator-based inheritance.

The `User` entity (`Shesha.Authorization.Users.User`) is what actually grants login access. It builds on top of the underlying ABP identity user and adds fields such as `IsActive`, `RequireChangePassword`, `LastLoginDate`, `SupportedPasswordResetMethods`, and the roles assigned to the account. Unlike `Person`, `User` is not meant to be extended, since the framework already provides everything needed to manage accounts (creation, password management, lock-out, activation) through the `UserManager` class.

A `Person` record has an optional `User` reference. A person only becomes a system user once a matching `User` record is created and linked to them, so it's entirely possible to have a `Person` with no login access at all.

:::info Example
Imagine a system that manages client information, where only company employees should be able to log in. Both clients and employees are people, so you would create `Client` and `Employee` sub-classes of `Person`. You would only create `User` records for the `Employee` records, leaving `Client` records without login access. If you later build a client portal, you could then create `User` records for clients as they register, and give them a different set of roles to those used internally.
:::

---

## User Administration Tasks

Administrators manage users through the built-in **Users** screen, which lists all `User` records and is protected by the `Pages.Users` permission. From there you can create, edit, and disable users, and assign roles to them.

### Creating a User

Creating a user requires a username, first name, surname, email address, and password. Shesha validates these fields (for example, the email address must be a valid email format) before the account is created.

To add a new user in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/xrg45ggf1r" type={1}/>

### Editing a User

Editing a user lets you update their name, email address, and other account details, and change which roles are assigned to them. Saving the change replaces the user's role list with whichever roles are selected at the time, so removing a role from the list revokes it.

To edit an existing user in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/5pvnjmguxk" type={1}/>

### Assigning Roles to Users

Roles determine what a user is allowed to do within the system. Assigning a role gives the user every permission that the role grants; removing a role takes those permissions away.

To assign roles to users in Shesha, follow these steps:
<LayoutBanners url="https://app.guideflow.com/embed/0p0v4o5ivk" type={1}/>

:::note
New users are created with no roles by default, so a newly created user has no role-based access until you assign roles. Assign roles as a deliberate step after creating the user.
:::

### Disabling/Locking a User

Disabling a user account revokes their ability to log in without deleting their record or their history. This is useful for suspending an account, for example when an employee leaves the organisation, without losing the data associated with them. A disabled user can be re-enabled later, restoring their access.

---

## Managing Users Programmatically

If you need to manage users from your own backend code rather than through the Users screen, Shesha exposes this through two classes: `UserManager` and `UserAppService`.

`UserManager` (`Shesha.Authorization.Users.UserManager`) is the lower-level class that most account management logic ultimately runs through. It exposes methods such as `CreateUserAsync(...)` to create an account, and `SetRolesAsync(User user, string[] roleNames)` to bring a user's roles in line with a given list (adding and removing roles as needed).

`UserAppService` (`Shesha.Application.Users.UserAppService`) is the application service behind the Users screen and is the class you would typically call from your own services. It exposes:

| Method | What it does |
|---|---|
| `CreateAsync(CreateUserDto input)` | Creates a new user account |
| `UpdateAsync(UserDto input)` | Updates an existing user's details and roles |
| `DeleteAsync(EntityDto<long> input)` | Deletes a user account |
| `ActivateUserAsync(long userId)` | Re-enables a disabled account |
| `InactivateUserAsync(long userId)` | Disables (locks) an account |
| `ChangePasswordAsync(ChangePasswordDto input)` | Lets a user change their own password |
| `ResetPasswordAsync(ResetPasswordDto input)` | Lets an administrator reset another user's password |

:::note
`ResetPasswordAsync` requires the calling user to hold the `Users_ResetPassword` permission. This is checked separately from the general `Pages.Users` permission that guards the rest of the Users screen.
:::

---

## See Also

* Adding custom user fields (profile extensions)
* Integrating with external identity providers (Azure AD, OAuth)
* Configuring audit trails for user actions
* Enforcing security best practices
* Viewing logon audit trails
* Viewing role assignment audit trails
