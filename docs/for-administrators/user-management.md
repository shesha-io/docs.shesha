---
sidebar_label: User Management
draft: true
---

# User Administration

**User Administration** refers to the tools and processes used to manage:
- Who can log in (users), and 
- What they can do (roles & permissions)

This is a critical part of application security and usability, ensuring that only authorized users can access sensitive data and perform actions appropriate to their roles.

---

## User Administration Tasks

### Creating a User
To create a new user in Shesha, follow these steps:
<!-- TODO: Add a GuideFlow for creating a user -->

### Editing a User
To edit an existing user in Shesha, follow these steps:
<!-- TODO: Add a GuideFlow for creating a user -->

### Assigning Roles to Users
To assign roles to users in Shesha, follow these steps:
<!-- TODO: Add a GuideFlow for creating a user -->

### Disabling/Locking a User
To disable a user account in Shesha, follow these steps:
<!-- TODO: Add a GuideFlow for creating a user -->

---


## Core Concepts
Shesha's user management framework is built around a few key concepts that form the foundation of how users, roles, and permissions interact. Understanding these concepts is essential for effective user administration.
- **Users** → Individual accounts representing system actors (people or integrations). For example, an employee logging into the HR system or a backend integration account for an external service.
- **Persons** → Represents individuals in the system, which may or may not be linked to a users. A `Person` can exist without a `User` (e.g., a client who does not log in).
- **Roles** → Named sets of permissions that define what a user can do. For example, a "Manager" role might have approval rights, while a "Viewer" role has read-only access.
- **Permissions** → Granular controls over specific features or actions. For example, `Account-View` or `Account-Update` permissions assigned to roles.

## Role and Permission Management


### Configuring Roles

* Navigate to: **Admin UI → Roles**
* Create new roles or edit existing ones
* Add or remove permissions inside each role

### Configuring Permissions

* Create new permissions under: **Admin UI → Permissions**
* Use clear, consistent names for permissions
* Map permissions to roles (not directly to users, where possible)

---

## See Also

* Adding custom user fields (profile extensions)
* Integrating with external identity providers (Azure AD, OAuth)
* Configuring audit trails for user actions
* Enforcing security best practices
* Viewing logon audit trails
* Viewing role assignment audit trails


User administration is a crucial aspect of any application, and Shesha provides a robust framework for managing users, roles, and permissions. This document outlines the key concepts and practices for user management in Shesha.
## Key Concepts
- **User**: Represents a system user who can log in and perform actions within the application.
- **Person**: Represents an individual, which can be a system user or not. A `User` is associated with a `Person`.
- **Role**: A collection of permissions that define what actions a user can perform within the system.
- **Permission**: A specific action or operation that can be performed within the system, such as viewing, creating, updating, or deleting an entity.
- **Module**: A logical grouping of related functionalities and permissions within the system.

## User Management Overview
Shesha's user management system is designed to provide a flexible and secure way to manage users, roles, and permissions. The framework allows for easy creation, modification, and deletion of users and roles, as well as the assignment of permissions to roles.
## User Registration
Users can register through the application interface, where they provide necessary information such as username, password, and email address. The registration process may include email verification to ensure the validity of the user's email address.
## User Activation and Deactivation
Users can be activated or deactivated based on their status. An activated user can log in and perform actions, while a deactivated user cannot access the system. This is useful for managing user accounts that are no longer active or for temporarily suspending access.
## User Roles
Roles are used to group permissions and assign them to users. A user can have multiple roles, and each role can have multiple permissions. This allows for a flexible and scalable approach to managing user access within the system.

## Assigning Users to Roles
In Shesha, users are assigned to roles to control their access within the system. This process involves selecting the appropriate roles that align with the user's responsibilities and the permissions required for their tasks.

## Permissions
Permissions define the specific actions that users can perform within the system. They are associated with roles, and users inherit permissions from the roles they are assigned. This allows for fine-grained control over what actions users can take, such as viewing, creating, updating, or deleting entities.
## User Management Best Practices
- **Use Roles for Permission Management**: Instead of assigning permissions directly to users, use roles to group permissions. This simplifies management and allows for easier updates when permissions change.
- **Regularly Review User Access**: Periodically review user roles and permissions to ensure they align with current business needs and security policies.
- **Implement Strong Password Policies**: Enforce strong password requirements to enhance security and protect user accounts.
# User Management in Shesha
Shesha provides a comprehensive user management framework that allows for the creation, modification, and deletion of users, roles, and permissions. The framework is designed to be flexible and extensible, allowing developers to customize user management functionalities to meet specific application requirements.
# User Management in Shesha



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

TODO : Assigning Roles
