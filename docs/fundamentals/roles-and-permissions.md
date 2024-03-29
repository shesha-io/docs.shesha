---
sidebar_label: Permission Based Security Model
draft: true
---

# Permission Based Security Model

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

Managing permissions, including defining new ones can be done from the Permissions Configurator accessible from the Configuration main menu, then selecting 'Permissions'.

### Permission Naming Conventions

Permission names **must be unique within a module** and should follow the following naming convention `{Name of thing to secure}-{Action name}`. For example:

- `User-View`
- `User-Create`
- `User-Update`
- `User-Delete`
- `User-ResetPassword`
- `User-Suspend`

### Permission Granularity

To avoid having to create and manage too many different permissions, it is not always necessary to create separate permissions for every single action/operation that can be performed on an object as illustrated in the example above. For example, if you are confident that users who are able to create other users, should also always be able to Update, Delete, Reset Passwords and Suspend them, then one could simply combine the last 5 permissions into a single `User-Manage` permission and end up with two more 'coarse grained' permissions instead:

- `User-View`
- `User-Manage`

The above would still allow roles to be defined that have read-only access, and full user management capabilities.

Ultimately, how granular you want to make the permissions depends on whether you would ever want to assign certain rights independently of others.

## Managing Roles

Managing roles, including specifying which Permissions are associated to each role can be done from the Roles Configurator accessible from the Configuration main menu, then selecting 'Roles'.

![image](https://user-images.githubusercontent.com/85956374/222926697-41a91832-ee15-4f19-96b7-208b478a6aea.png)

<a href="https://softwareengineering.stackexchange.com/questions/299729/role-vs-permission-based-access-control" target="_blank">https://softwareengineering.stackexchange.com/questions/299729/role-vs-permission-based-access-control</a>

# Securing the Front-end

## Limiting visibility of Main Menu items and Toolbar buttons

To restrict access to certain views from the main menu based on the user's permissions, simply:

1. Open the Menu configurator
2. Select the menu item you would like to restrict
3. Specify the Permission(s) required in order to access the view as illustrated below.

![image](https://user-images.githubusercontent.com/85956374/222926725-b6ac3361-a6ad-40d6-9c31-038ce92f97f0.png)

## Limiting visibility of Form Components

Currently, there is no configuration-based support to restrict the visibility of a form component based on a user's permissions. The only way to support this is by using the 'Custom visibility' action script property of the component with a bit of code to check whether the current user has a specific permission as follows:

```
TODO: NEED JAVASCIPRT SNIPPET THAT CHECKS WHETHER THE USER HAS A PERMISSION
```

standard 'Required permissions' property.
To restrict the visibility of a form component based on a user's permissions, on the form configurator simply:

1. Open the form on the configuration mode
2. Select the required component
3. Update the 'Custom visibility property to check programmatically whether the current user

# Securing APIs

## Limiting Access to APIs

To limit access of an API based on user permissions:

1. From the Configuration main menu item, select 'Permissioned Objects'
2. Select 'API' from the drop-down
   ![image](https://user-images.githubusercontent.com/85956374/222926744-f3503842-e9c8-4a70-bc47-ab1534b8b9cd.png)
3. Find and select the end-point that you wish to secure:

   - Ensure that you select 'Requires permissions' for the 'Access' property
   - Select the permission(s) that users should require when accessing the end-point.

   (note: The user will only require any one of the specified permissions in order to get access to the API)

![image](https://user-images.githubusercontent.com/85956374/222926761-227d13ca-f4a3-4e46-9bc6-1b3d9fcf176f.png)

If user attempts to access an API without the required permissions

![image](https://user-images.githubusercontent.com/85956374/222926774-846158cc-03f2-4ec1-b89b-32e6b289c8b5.png)

## Limiting Access to Data

Permissions are useful to define what types of actions can be performed by a particular user, however, in some cases, it is not only important to be able to restrict what a user can do, but also what data he or she should be able to see. For example, it may be necessary for a Salesperson to only be able to see Customers within a particular region, or for which he has been designated as the Account Manager. Similarly, if User Administration is decentralised, you may want Administrators to only be able to see users belonging to a particular organisational unit.

For this type of scenario, Shesha supports the use of Data Filters.
