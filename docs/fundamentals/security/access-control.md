---
sidebar_label: Access Control
position: 2
title: Authorization and Access Control
---

# Authorization and Access Control

Access control is a fundamental aspect of system security, ensuring that users can only access resources and perform actions they are authorized for. In the context of Shesha, access control is implemented through a combination of Role-Based Access Control (RBAC) and Scoped RBAC. These mechanisms allow administrators to define roles, assign permissions, and enforce security policies based on user roles and their associated scopes.

## Core Concepts
Shesha's access control framework is built around a few key concepts that form the foundation of how users, roles, and permissions interact. Understanding these concepts is essential for effective access control management:
- **Users** → Individual accounts representing system actors (people or integrations). For example, an employee logging into the HR system or a backend integration account for an external service.
- **Persons** → `Person` is one of the standard entities provided out-of-box with Shesha to store and manage the most common data found in enterprise applications. It represents individuals in the system, whether or not they are linked to a `User`. Each `User` is associated with a `Person` entity which provides additional information about the user, such as their name, contact details, and other personal attributes. This association is useful for scenarios where a user needs to log in and interact with the system. However, a `Person` can exist independently of a `User`, such as in cases where the individual does not need to log into the system. This separation between security-related concerns and user-related information provides flexibility in representing entities like clients who do not require login access.
- **Roles** → Named sets of permissions that define what a user can do. For example, a "Manager" role might have approval rights, while a "Viewer" role has read-only access.
- **Permissions** → Granular controls over specific features or actions. For example, `Account-View` or `Account-Update` permissions assigned to roles.
- **Role Type** - Defines the scope and context in which roles are applicable, allowing for more granular control over permissions and access levels within the system. 


## Roles
Shesha implements a **Role-Based Access Control (RBAC)** security model to manage user access and permissions within the system. This model allows Configurators to define roles with specific permissions, which can then be assigned to users. By doing so, users can only perform actions that are permitted by their assigned roles.

### Standard Roles
A new Shesha application starts with a set of standard roles for managing basic user access.  The standard roles are designed to cover common use cases and provide a foundation for access control.

| Role          | Description                                                                 | Permissions Assigned                     |
|---------------|-----------------------------------------------------------------------------|------------------------------------------|
| **User**      | Role assigned to most users, providing access to standard application features such as viewing and updating business data as well as viewing and updating their own profile information. | ViewProfile, UpdateProfile, ViewData     |
| **Administrator** | Provides access to administrative functions, including user management, role assignment, viewing of audit trails, and managing basic system settings. | ManageUsers, AssignRoles, ViewAuditTrail |
| **Configurator**  | Provides access to the Configuration Studio allowing the user to configure the system, including creating and managing forms, lists, and other configuration settings. | ConfigureSystem, ManageForms, ManageLists |

The [user management interface](/docs/for-administrators/user-management) allows administrators to assign roles to users. A user may be assigned one or more roles, which collectively determine their permissions within the system.

### Creating Roles
New roles can be created to meet specific organizational needs entirely through the Configuration Studio where new roles can be created, existing ones can be modified, or deleted as necessary.

:::info Missing GuideFlow
TODO: Include GuideFlow that shows how to create and manage roles in the Configuration Studio
:::

### Entity Scoped Roles
Entity Scoped Roles extend traditional roles by introducing a scope tied to a specific entity, enabling more granular control over user permissions. When assigning a scoped role to a user, the scope is defined by a particular entity, limiting the permissions granted to the user within that context. For example:
- A Departmental System Administrator can manage user accounts only within their assigned department, while a Global Administrator can manage user accounts across the entire system.
- A Project Manager can create and update tasks, but only within projects they are assigned to as Project Manager, while a Global Project Manager can manage tasks across all projects.

Whether a Role is scoped or not depends on entirely on its Role Type. Roles which are not scoped (including all the default roles) use the 'Standard Role' type.

By default, Shesha comes with 'Organization Specific' and 'Account Specific' role types. As the names suggest, these role types allow roles to be assigned and scoped to specific organizations or accounts.

New Role Types can also be configured to scope roles by any other type of entity. Additionally, they allow you to specify and configure the form and validations to apply on assignment of any role of that type. You can create new Role Types through the Configuration Studio, as demonstrated below.

:::info Missing GuideFlow
TODO: Insert Guideflow showing process of creating a new Role Type configuration
:::


## Permissions
Permissions represent the specific actions that can be performed within the system. For example, a permission might allow a user to view, create, update, or delete an entity such as a user profile or a work order.
A Permission can be assigned to one or more Roles, which are in turn assigned to Users. Users will thereby inherit all the Permissions assigned to the assigned Roles allowing for fine-grained control over what users can do.


### Creating Permissions
To create a new permission, follow these steps:

:::info Missing GuideFlow
TODO: Include GuideFlow that shows how to create and manage permissions in the Configuration Studio
:::

Once a permission is created, it must be integrated into the application's behavior. This involves configuring the application to validate the permission before granting access to specific data or actions. By doing so, the application ensures that only users with the appropriate permissions can perform certain operations, thereby maintaining security and compliance.

The sections later in this document detail the steps for integrating permissions into application behavior at the UI, API, and data levels.

### Permission Naming Conventions

Ultimately permission names can be anything as long as they are unique within a module. However, it is recommended to follow a consistent naming convention to ensure clarity and maintainability.
We suggest the following naming convention `{Name of thing to secure}-{Action name}`. For example:
- `User-View`
- `User-Create`
- `User-Update`
- `User-Delete`
- `User-ResetPassword`
- `User-Suspend`

#### Naming of Scoped Permissions

When defining permissions that are scoped to specific entities or conditions, it is important to use clear and descriptive names that indicate the scope of the permission. This helps in understanding the context in which the permission applies and ensures that permissions are easily identifiable.

The following conventions are recommended:
- Use the **`-if-{condition}`** suffix to indicate that the permission is scoped by a condition. For example:   
  - A Ticketing system has a `Support Agent` role defined
  - The `Support Agent` role is assigned `Ticket-View-if-Assigned` permission, whilst the `Ticket` entity has an `AssignedAgent` property indicating the agent assigned to the ticket
  - Sam has been assigned the `Support Agent` role and has been set as the `AssignedAgent` for Tickets 1 and 2
  - Sam can view details of Tickets 1 and 2, but not any other tickets
- Use the **`-where-Scoped`** suffix to indicate that the permission is scoped to the entities specified directly on role assignment. For example:
  - A CRM system has `Account Manager` role defined which requires an `Account` to be specified on assignment
  - The `Account Manager` role is assigned `Account-View-where-Scoped` permission
  - John is assigned `Account Manager` roles for Account A and Account B
  - John can view details of Account A and Account B, but not any other accounts
  - **Note:** The key difference between `-if-{condition}` and `-where-Scoped` is that the former is based on a condition (e.g. assigned to a ticket), while the latter is based on the assignment of a role scoped to the entity itself.
- Use the **`-where-Scoped-to-{entity name}`** suffix to indicate that the permission is scoped to entities through its relationship to another type of entity. For example:
  - A CRM system has `Regional Sales Manager` role defined which requires a `Region` to be specified on assignment
  - The `Regional Sales Manager` role is assigned `Account-View-where-Scoped-to-Region` permission
  - Jane is assigned `Regional Sales Manager` role for Region X
  - Jane can view details of all accounts within Region X, but not any other accounts

#### Permission Granularity

To simplify permission management, it is not always necessary to create separate permissions for every single action on an object. For example, if users who can create other users should also be able to update, delete, reset passwords, and suspend them, these actions can be combined into a single `User-Manage` permission. This approach results in two broader permissions:

- `User-View`
- `User-Manage`

This allows roles to be defined with either read-only access or full user management capabilities. The level of granularity for permissions should be determined by whether specific rights need to be assigned independently.

## UI-Level Access Control

On the frontend, security is enforced by **controlling the visibility of UI elements** (such as menu items, forms, buttons and other components) based on the user's permissions, ensuring users only see options that they are authorized to use.

:::warning Hidden functions can still be accessed via APIs
Hiding UI elements does not prevent users from accessing the underlying functionality through APIs or direct URL access. Therefore, it is crucial to also secure the APIs and data access as described in the other sections.
:::

### Restricting Access to Forms
To restrict access to specific forms based on user permissions, you can configure the security settings of the form in the Configuration Studio. This allows you to specify which permissions are required for a user to access a particular form.
:::info Missing GuideFlow
TODO: Include GuideFlow that shows how to configure permissions required to access the forms
:::

### Show/Hide Menu Items Based on Permissions
To restrict access to certain views from the main menu based on the user's permissions, you can configure the visibility of menu items in the Configuration Studio. This allows you to specify which permissions are required for a user to access a particular view.
:::info Missing GuideFlow
TODO: Include GuideFlow that shows how to configure menu item visibility based on permissions
:::

### Hide/Disable Form Components Based on Permissions
To restrict the visibility of or access to form components based on a user's permissions you can configure the security settings of the component directly in the Configuration Studio.
:::info Missing GuideFlow
TODO: Include GuideFlow that shows how to configure IsVisible and IsEditable security settings (not currently implemented)
:::

### Complex Scenarios with Business Logic
In some cases, you may need to implement custom visibility logic for UI components based on more complex conditions. For example, you might want to show a button only if the user has a specific permission and is assigned to a work order.
To achieve this, you can use a `Js` configuration on the Hidden property of the component and implement the logic in JavaScript as illustrated below. 

:::note Future Update
TODO: The snippet below is based on the existing 'getHidden' method. Moving forward we want to replace this with IsVisible. Snippet should be updated accordingly when the change has been made
:::
```javascript
const getHidden = () => {
    return (() => {
        // Check if the user has the permission to perform the action
        const canActionIfAssigned = await user.hasPermissionAsync("WorkOrder-Action-if-Assigned");

        if(canActionIfAssigned && data.assignedTo === application.user.personId){
            return false; // Show the button if the user has the permission and is assigned
        } else {
            return true; // Hide the button otherwise
        }
    })();
};
```

## API-Level Access Control

To enforce security at the API level, you can use a combination of configuration and attributes to restrict access to specific API endpoints based on user permissions. This ensures that only authorized users can perform certain actions or access sensitive data.
If a user attempts to access an API endpoint without the required permissions, they will receive a 403 Forbidden error, with a message indicating that they do not have the necessary permissions to perform the action.

### Securing APIs through Configuration
Shesha allows you to limit access to APIs based on user permissions through the Configuration Studio. This is done by specifying which permissions are required to access a particular API endpoint.

:::info Missing GuideFlow
TODO: Include GuideFlow that show how to configure API security in the configuration environment
:::

### Securing APIs with Attributes
To secure APIs programmatically, you can use the `[ShaAuthorize]` attribute in your AppService methods. This attribute allows you to specify which permissions are required for a user to access the method.

```csharp    
[ShaAuthorize("WorkOrder-Action")]
[HttpPost, Route("[action]")]
public async Task<CompleteWorkOrderResponse> CompleteWorkOrder(CompleteWorkOrderRequest input)
{
    // Logic to complete the work order ...
}
```
In this example, the `CompleteWorkOrder` method is secured with the `WorkOrder-Action` permission. Only users with this permission will be able to access this API endpoint.

### Custom Code for more Complex Scenarios
In some cases, you may need to implement more complex logic to determine whether a user has permission to perform an action. For example, you might want to allow users to complete a work order only if they are assigned to it.

```csharp
public class WorkOrderAppService : SheshaAppServiceBase<WorkOrder>
{
    private readonly ICurrentUser _currentUser;
    private readonly IRepository<WorkOrder> _workOrderRepo;

    public WorkOrderAppService(ICurrentUser currentUser, IRepository<WorkOrder> workOrderRepo)
    {
        _currentUser = currentUser;
        _workOrderRepo = workOrderRepo;
    }

    [HttpPost, Route("[action]")]
    public async Task<CompleteWorkOrderResponse> CompleteWorkOrder(CompleteWorkOrderRequest input)
    {
        bool hasWorkOrderActionPermission = await _currentUser.HasPermissionAsync("WorkOrder-Action");
        bool hasWorkOrderActionIfAssignedPermission = await _currentUser.HasPermissionAsync("WorkOrder-Action-if-Assigned");

        var workOrder = await _workOrderRepo.GetAsync(input.WorkOrderId);

        if (    !hasWorkOrderActionPermission 
            && !(hasWorkOrderActionIfAssignedPermission && workOrder.AssignedTo == _currentUser.Person))
        {
            throw new AbpAuthorizationException("User does not have permission to complete the work order.");
        }
        
        // Logic to complete the work order
        ...
    }
}
```

## Data-Level Access Control
To enforce security at the data level, you can use **[global specifications](/docs/fundamentals/specifications)** to restrict visibility of data based on user permissions. This ensures that users can only access data that they are authorized to view, based on their roles and permissions.

:::warning Global Specifications may be bypassed
Global specifications are automatically applied when retrieving data using the `GetAll()` method on repositories, making them a convenient way to enforce security from a **centralized point**. However, specifications **do not apply** to data accessed through alternative methods, such as direct SQL queries or custom repository methods. Therefore, it is important to ensure that all data access points are properly secured.
:::

### Restricting Visibility of Data Based on Custom Conditions

In the example scenario below, we have a Customer Support Ticketing system, which has two roles, 'Supervisor', which can view all support tickets, and 'Support Agent', which should see tickets assigned to them.
| Roles | Assigned Permissions |
| --- | --- |
| Supervisor | Ticket-View |
| Support Agent | Ticket-View-if-Assigned |

```csharp
public class SupportTicket : AuditedEntity<Guid>
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Person AssignedAgent { get; set; } // The agent assigned to this ticket
    // Other properties...
}

[Description("Specification to limit visibility of Tickets to based on permissions.")]
[GlobalSpecification]  // This attribute makes this specification global ensuring it is applied wherever the Ticket entity is queried via the repository
public class TicketPermissionsSpecification : ShaSpecification<SupportTicket>
{
    private readonly IAbpSession _abpSession;
    private readonly IPermissionChecker _permissionChecker;
    private readonly IRepository<Person, Guid> _personRepository;
    public TicketPermissionsSpecification(
        IAbpSession abpSession,
        IPermissionChecker permissionChecker,
        IRepository<Person, Guid> personRepository)
    {
        _abpSession = abpSession;
        _personRepository = personRepository;
        _permissionChecker = permissionChecker;
    }

    public override Expression<Func<Ticket, bool>> BuildExpression()
    {
        // Get the current user ID from the session
        var userId = _abpSession.UserId;
        if (!userId.HasValue) return ticket => false; // No user ID means no access, return false to return zero tickets when queried

        // Retrieve the current person's details
        var currentPerson = _personRepository.FirstOrDefault(p => p.User.Id == userId);
        if (currentPerson == null) return ticket => false; // If person is not found, return false to return zero tickets when queried

        // Check for permissions that determine ticket visibility
        var canViewAll = await _permissionChecker.IsGrantedAsync("Ticket-View");
        if (canViewAll) return ticket => true; // If user can view all tickets, return all tickets

        var canViewIfAssigned = await _permissionChecker.IsGrantedAsync("Ticket-View-if-Assigned");
        if (canViewIfAssigned)
        {
            // If user can view tickets they are assigned to, return expression to filter tickets assigned to the current person
            return ticket => ticket.AssignedAgent.Id == currentPerson.Id;
        }
        else
        {
            // If user has no relevant permissions, return no tickets
            return ticket => false;
        }
    }
}
```

:::caution To Be Removed
TODO: Remove previous code snippet once security framework has been updated and ICurrentUser is available
:::
>**NOTE:** Previous code snippet shows how you would have to implement. Moving forward we need to simplify this by exposing a `ICurrentUser` interface similar to ABP.io. However, in our implementation we can extend it further to provide access to: Person, Permission checking (in ABP.io this is done via the PermissionChecker) and Scoped roles.
```csharp
[Description("Specification to limit visibility of Tickets based on the current user's permissions.")]
[GlobalSpecification]  // This attribute makes this specification global ensuring it is applied wherever the Ticket entity is queried via the repository
public class TicketPermissionsSpecification : ShaSpecification<SupportTicket>
{
    private readonly ICurrentUser _currentUser;
    public TicketPermissionsSpecification(
        ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public override Expression<Func<Ticket, bool>> BuildExpression()
    {
        // Retrieve the current person's details
        if (_currentUser?.Person == null) return ticket => false; // If no logged in person, return false to return no tickets when queried

        // Check for permissions that determine ticket visibility
        var canViewAll = await _currentUser.HasPermissionAsync("Ticket-View");
        if (canViewAll) return ticket => true; // If user can view all tickets, return all tickets

        var canViewIfAssigned = await _currentUser.HasPermissionAsync("Ticket-View-if-Assigned");
        if (canViewIfAssigned)
        {
            // If user can view tickets they are assigned to, return expression to filter tickets assigned to the current person
            return ticket => ticket.AssignedAgent.Id == currentUser.Person.Id;
        }
        else
        {
            // If user has no relevant permissions, return no tickets
            return ticket => false;
        }
    }
}
```

### Restricting Visibility of Data Based on Scoped Role Assignments
In many systems, roles are not just global but can be scoped to specific entities. This means that the permissions granted to a user depend on the entities they are associated with. For example, in a CRM system, a role might be scoped by region or account.
Shesha provides built-in support for handling such scenarios efficiently.

The screenshot below, for example, illustrates the assignment of a role to a user scoped by a particular region.
:::info Missing Screenshot
TODO: Insert screenshots assigning a role scoped to a Region/Site
:::


Here’s an example of roles in a CRM system:

| Role | Scoped By | Permissions | Description |
| --- | --- | --- | --- |
| Sales Director | N/A | Account-View | Can view all accounts without restrictions. |
| Regional Sales Manager | `Region` | Account-View-where-Scoped-to-Region | Can view all accounts within their assigned region(s). |
| Account Manager | `Account` | Account-View-where-Scoped | Can view only the accounts they are responsible for, as assigned through the Account Manager role. |

```csharp
[Description("Specification to limit visibility of Tickets to based on permissions.")]
[GlobalSpecification]  // This attribute makes this specification global ensuring it is applied wherever the Ticket entity is queried via the repository
public class AccountPermissionsSpecification : ShaSpecification<SupportTicket>
{
    private readonly ICurrentUser _currentUser;
    public AccountPermissionsSpecification(
        ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public override Expression<Func<Account, bool>> BuildExpression()
    {
        // Retrieve the current person's details
        if (_currentUser.Person == null) return account => false; // If no logged in person, return false to return no accounts when queried

        // Check for permissions that determine account visibility
        var canViewAll = await _currentUser.HasPermissionAsync("Account-View");
        if (canViewAll) return account => true; // If user can view all accounts, return all accounts

        var scopedAccounts = _currentUser.GetPermissionScope("Account-View-where-Scoped");
        var scopedRegions = _currentUser.GetPermissionScope("Account-View-where-Scoped-to-Region");

        // Allow viewing accounts if scoped directly or within scoped regions
        return account =>  (scopedRegions.Any() && account.RegionId != null && scopedRegions.Contains(account.RegionId.Value))
        ||  (scopedAccounts.Any() && account.Id != null && scopedAccounts.Contains(account.Id));
    }
}
```
