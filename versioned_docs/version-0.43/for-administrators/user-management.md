---
sidebar_label: User Management
---

# User Administration

**User Administration** refers to the tools and processes used to manage:
- Who can log in (users), and 
- What they can do (roles & permissions)

This is a critical part of application security and usability, ensuring that only authorized users can access sensitive data and perform actions appropriate to their roles.

---

## User Administration Tasks

### Creating a User
Users can be added to the system through the application interface by entering required details such as username, password, and email address. The registration process may also involve verifying the user's email to confirm its authenticity.

To add a new user in Shesha, follow these steps:
:::info Missing GuideFlow
TODO: Add a GuideFlow for creating a user 
::: 

### Editing a User
To edit an existing user in Shesha, follow these steps:
:::info Missing GuideFlow
TODO: Add a GuideFlow for edititng a user 
::: 

### Assigning Roles to Users
In Shesha, users are assigned to roles to control their access within the system. This process involves selecting the appropriate roles that align with the user's responsibilities and the permissions required for their tasks.

To assign roles to users in Shesha, follow these steps:
:::info Missing GuideFlow
TODO: Add a GuideFlow for assigning roles to a user
::: 

### Disabling/Locking a User
Users can be activated to allow access or deactivated to prevent login. Deactivation is useful for suspending or disabling accounts without deleting them.

To disable a user account in Shesha, follow these steps:
:::info Missing GuideFlow
TODO: Add a GuideFlow for creating a user 
::: 

---

## See Also

* Adding custom user fields (profile extensions)
* Integrating with external identity providers (Azure AD, OAuth)
* Configuring audit trails for user actions
* Enforcing security best practices
* Viewing logon audit trails
* Viewing role assignment audit trails


# Understanding 'Person' and 'User' entities

Shesha comes with both `Person` and `User` entities as part of its core domain model and it is important to understand the difference and relationship between both.
Whereas the `Person` entity is used to store and manage information relating to persons (whether the Person is a system user or not), the `User` entity is specifically used to manage system users.

_In order for a person to be a system user, both a `Person` entity and a matching `User` record need to exist._

Since the information a system needs to store about a person will often differ depending on the requirements, it is expected that in most implementations, the `Person` entity will be extended by creating sub-classes with additional properties.

In contrast, since the `User` entity is used purely for managing the system accounts, it is not expected to be extended as the framework should already provide all the necessary account management features required (e.g. creation, password management, lock-out, activation, etc...) via the `UserManager` class.

## Example

Imagine you are building a system used to manage client information but where only company employees should have access to the system.

Since both Clients and Employee are more specific types of persons, you would create `Client` and `Employee` sub-classes that inherit from the `Person` class and add the relevant properties to each. You would however only create matching `User` records for the `Employee` entities.

Should you in the future want to create a client portal so that your clients can also access some limited functions of your system, you could then create `User` records for them as they register onto the portal. You would limit their access to certain functions only by assigning them different roles than you would for your internal employees.

# UserManager and UserAppService classes

All system account management functions (such as account registrations, activiation/deactivation, password management, etc...) you require should already be supported by the framework via the `UserAppService` and `UserManager` classes.
