---
sidebar_label: Role Based Access Control (RBAC)
draft: true
---

# Role Based Access Control (RBAC)

Shesha implements a **Role Based Access Control (RBAC)** security model to manage user access and permissions within the system. This model allows administrators to define roles with specific permissions, which can then be assigned to users. By doing so, users can only perform actions that are permitted by their assigned roles.

Implementing RBAC to manage access and permissions within a system provides several key benefits:

* **Access Restriction Based on Roles**: Users are granted permissions based on their assigned roles, ensuring they can only perform actions that align with their responsibilities.
* **Improved Security**: By limiting access to specific functionalities, RBAC minimizes the risk of unauthorized actions and data breaches.
* **Simplified Permission Management**: Administrators can manage user permissions more efficiently by assigning roles rather than configuring individual permissions for each user.
* **Scalability**: As the system grows, new roles and permissions can be introduced without modifying the existing access control logic extensively.

This document provides a comprehensive guide to implementing RBAC and security enforcement, using a work order management system to illustrate these concepts.

All but the most basic of applications need to ensure that certain actions in the system can only be performed by certain users. This is usually referred to as 'Authorisation' or 'Access Control'.
Shesha enforces authorisation through a 'Permissions based security model', whereby any restricted action can only be performed by Users who have been assigned the relevant Permission. Assigning Permissions to Users is, however, not done directly, but rather by via `Roles`. `Roles` are linked to one or more `Permissions`, and by assining a `Role` to a `User`, the user automatically inherits all the `Permissions` linked to that `Role`.

Imagine a scenario where we want to restrict access to the 'Reset Password' functionality. In this instance, the 'Reset Password' button on the form configurator would be a `Restricted Action`. The form configurator allows configurators to specify which permission(s) are required in order for the component to be visible through the 'Required permissions' property. In this instance it could be set to the Permissions `User.ResetPassword`. The Permission `User.ResetPassword` would then be linked to the Role `User Administrator`. To allow User `Joe` to Reset Passwords you would then have to assign Joe the role `User Administrator`. This scenario is illustrated by the diagram below:

![image](https://user-images.githubusercontent.com/85956374/222926661-e3dc5e5d-a6e1-416a-9697-00eaa29e9876.png)

In addition to making the button invisible, to properly secure the application you also need to restrict access to the Reset Password functionality at the API level. Shesha also allows configurators to specify which Permissions are required in order to access APIs through the configuration environment.

### Side note: Why not just use Roles on their own without Permissions?

Well, designing an application around role-based security can lead to an ever-expanding number of roles and hard-to-follow logic that attempts to handle all of the possible permutations. This is especially true when users can be members of more than one role.

Role-based security is great when the number of roles is very small and unlikely to change. For anything more complex, a permission-based security system provides a much more flexible solution with far fewer maintenance headaches down the road.

# Managing Roles and Permissions

## Managing Permissions


## Managing Roles

Managing roles, including specifying which Permissions are associated to each role can be done from the Roles Configurator accessible from the Configuration main menu, then selecting 'Roles'.

![image](https://user-images.githubusercontent.com/85956374/222926697-41a91832-ee15-4f19-96b7-208b478a6aea.png)

<a href="https://softwareengineering.stackexchange.com/questions/299729/role-vs-permission-based-access-control" target="_blank">https://softwareengineering.stackexchange.com/questions/299729/role-vs-permission-based-access-control</a>

