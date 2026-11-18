---
sidebar_label: Access Control 
sidebar_position: 2
title: Authorization and Access Control
---

# Authorization and Access Control

Access control is a fundamental aspect of system security, ensuring that users can only access resources and perform actions they are authorized for. In the context of Shesha, access control is implemented through a combination of Role-Based Access Control (RBAC) and Scoped RBAC. These mechanisms allow administrators to define roles, assign permissions, and enforce security policies based on user roles and their associated scopes.

---

## Core Concepts

Shesha's access control framework is built around a few key concepts that form the foundation of how users, roles, and permissions interact. Understanding these concepts is essential for effective access control management:

- **Users** - Individual accounts representing system actors (people or integrations). For example, an employee logging into the HR system or a backend integration account for an external service.
- **Persons** - `Person` is one of the standard entities provided out-of-box with Shesha to store and manage the most common data found in enterprise applications. It represents individuals in the system, whether or not they are linked to a `User`. Each `User` is associated with a `Person` entity which provides additional information about the user, such as their name, contact details, and other personal attributes. However, a `Person` can exist independently of a `User`, such as in cases where the individual does not need to log into the system. This separation between security-related concerns and user-related information provides flexibility in representing entities like clients who do not require login access.
- **Roles** - Named sets of permissions that define what a user can do. For example, a "Manager" role might have approval rights, while a "Viewer" role has read-only access.
- **Permissions** - Granular controls over specific features or actions. For example, `Account-View` or `Account-Update` permissions assigned to roles.
- **Role Type** - Defines the scope and context in which roles are applicable, allowing for more granular control over permissions and access levels within the system.

---

## Roles

Shesha implements a **Role-Based Access Control (RBAC)** security model to manage user access and permissions within the system. This model allows Configurators to define roles with specific permissions, which can then be assigned to users. By doing so, users can only perform actions that are permitted by their assigned roles.

### Standard Roles

A new Shesha application starts with four standard roles for managing basic user access. They are defined as configuration items in Shesha Core and imported automatically, so they're available on every installation.

| Role | Description | Key permissions |
|---|---|---|
| **User** | Regular user. Can view and maintain core business data such as accounts, persons and organisations. | `Account-*`, `Person-*`, `Organisation-*` |
| **User Administrator** | Administers other users, including creating and updating users and assigning roles, but no other system administration. | `User-View`, `User-Manage`, `User-ResetPassword` |
| **Configurator** | Configures the system: forms, entities, reference lists and other configuration items. | `Application-Configure` |
| **System Administrator** | General system administration, including access to logs, settings, maintenance tools and scheduled jobs. | All of the above, plus `Application-Administer`, `Application-Settings`, `Application-Maintenance`, `Hangfire-Dashboard`, `Role-Manage` |

The standard roles don't include a separate Developer role. Give developers the **Configurator** role. For the full list of permissions in each role and what each permission controls, see [Standard Roles and Permissions](/docs/fundamentals/security/standard-roles-and-permissions).

The [user management interface](/docs/for-administrators/user-management) allows administrators to assign roles to users. A user may be assigned one or more roles, which collectively determine their permissions within the system.

### Creating Roles

New roles can be created to meet specific organizational needs through the **Roles** page under **Configurations** in the admin portal, where new roles can be created, existing ones can be modified, or deleted as necessary.


### Entity Scoped Roles

Entity Scoped Roles extend traditional roles by introducing a scope tied to a specific entity, enabling more granular control over user permissions. When assigning a scoped role to a user, the scope is defined by a particular entity, limiting the permissions granted to the user within that context. For example:

- A Departmental System Administrator can manage user accounts only within their assigned department, while a Global Administrator can manage user accounts across the entire system.
- A Project Manager can create and update tasks, but only within projects they are assigned to as Project Manager, while a Global Project Manager can manage tasks across all projects.

Whether a Role is scoped or not depends entirely on its Role Type. Roles which are not scoped (including all the default roles) use the 'Standard Role' type.

By default, Shesha comes with 'Organization Specific' and 'Account Specific' role types. As the names suggest, these role types allow roles to be assigned and scoped to specific organizations or accounts.

New Role Types can also be configured to scope roles by any other type of entity. Additionally, they allow you to specify and configure the form and validations to apply on assignment of any role of that type.

---

## Permissions

Permissions represent the specific actions that can be performed within the system. For example, a permission might allow a user to view, create, update, or delete an entity such as a user profile or a work order.
A Permission can be assigned to one or more Roles, which are in turn assigned to Users. Users will thereby inherit all the Permissions assigned to the assigned Roles, allowing for fine-grained control over what users can do.

### Creating Permissions

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

Shesha's own permissions follow this convention (for example `Application-Configure`, `Role-Manage` and `Person-View`). See [Framework Permissions](/docs/fundamentals/security/standard-roles-and-permissions#framework-permissions) for the full list.

#### Naming of Scoped Permissions

When defining permissions that are scoped to specific entities or conditions, it is important to use clear and descriptive names that indicate the scope of the permission. This helps in understanding the context in which the permission applies and ensures that permissions are easily identifiable.

The following conventions are recommended:

- Use the **`-if-{condition}`** suffix to indicate that the permission is scoped by a condition. For example:
  - A Ticketing system has a `Support Agent` role defined
  - The `Support Agent` role is assigned `Ticket-View-if-Assigned` permission, whilst the `Ticket` entity has an `AssignedAgent` property indicating the agent assigned to the ticket
  - Sam has been assigned the `Support Agent` role and has been set as the `AssignedAgent` for Tickets 1 and 2
  - Sam can view details of Tickets 1 and 2, but not any other tickets
- Use the **`-where-Scoped`** suffix to indicate that the permission is scoped to the entities specified directly on role assignment. For example:
  - A CRM system has an `Account Manager` role defined which requires an `Account` to be specified on assignment
  - The `Account Manager` role is assigned `Account-View-where-Scoped` permission
  - John is assigned `Account Manager` roles for Account A and Account B
  - John can view details of Account A and Account B, but not any other accounts
  - **Note:** The key difference between `-if-{condition}` and `-where-Scoped` is that the former is based on a condition (e.g. assigned to a ticket), while the latter is based on the assignment of a role scoped to the entity itself.
- Use the **`-where-Scoped-to-{entity name}`** suffix to indicate that the permission is scoped to entities through its relationship to another type of entity. For example:
  - A CRM system has a `Regional Sales Manager` role defined which requires a `Region` to be specified on assignment
  - The `Regional Sales Manager` role is assigned `Account-View-where-Scoped-to-Region` permission
  - Jane is assigned `Regional Sales Manager` role for Region X
  - Jane can view details of all accounts within Region X, but not any other accounts

#### Permission Granularity

To simplify permission management, it is not always necessary to create separate permissions for every single action on an object. For example, if users who can create other users should also be able to update, delete, reset passwords, and suspend them, these actions can be combined into a single `User-Manage` permission. This approach results in two broader permissions:

- `User-View`
- `User-Manage`

This allows roles to be defined with either read-only access or full user management capabilities. The level of granularity for permissions should be determined by whether specific rights need to be assigned independently.

---

## UI-Level Access Control

On the frontend, security is enforced by **controlling the visibility of UI elements** (such as menu items, forms, buttons and other components) based on the user's permissions, ensuring users only see options that they are authorized to use.

:::warning Hidden functions can still be accessed via APIs
Hiding UI elements does not prevent users from accessing the underlying functionality through APIs or direct URL access. Therefore, it is crucial to also secure the APIs and data access as described in the other sections.
:::

### Restricting Access to Forms

To restrict access to specific forms based on user permissions, you can configure the security settings of the form in the Forms Designer. This allows you to specify which permissions are required for a user to access a particular form.

### Show/Hide Menu Items Based on Permissions

To restrict access to certain views from the main menu based on the user's permissions, you can configure the visibility of menu items through the Sidebar Menu Configuration editor, opened by switching the application into Edit Mode. This allows you to specify which permissions are required for a user to see a particular menu item.

### Hide/Disable Form Components Based on Permissions

:::note Not currently implemented
There is no permission-gated visibility or edit-access setting on individual form components today - only a JavaScript-based `Hidden` property, covered in the section below.
:::

### Complex Scenarios with Business Logic

In some cases, you may need to implement custom visibility logic for UI components based on more complex conditions. For example, you might want to show a button only if the user has a specific permission and is assigned to a work order.
To achieve this, you can use a `Js` configuration on the Hidden property of the component and implement the logic in JavaScript as illustrated below.

**Form type to use:** Any form where a component's visibility depends on both a permission and a data condition.

**Example - Hide a button unless the user has permission and is assigned to the record:**

```javascript
const getHidden = () => {
    return (() => {
        // Check if the user has the permission to perform the action
        const canActionIfAssigned = await user.hasPermissionAsync("WorkOrder-Action-if-Assigned");

        if (canActionIfAssigned && data.assignedTo === application.user.personId) {
            return false; // Show the button if the user has the permission and is assigned
        } else {
            return true; // Hide the button otherwise
        }
    })();
};
```

---

## API-Level Access Control

To enforce security at the API level, you can use a combination of configuration and attributes to restrict access to specific API endpoints based on user permissions. This ensures that only authorized users can perform certain actions or access sensitive data.
If a user attempts to access an API endpoint without the required permissions, they will receive a 403 Forbidden error, with a message indicating that they do not have the necessary permissions to perform the action.

### Securing APIs through Configuration

Shesha allows you to limit access to APIs based on user permissions through the **Permissioned Objects** page in the admin portal. This is done by specifying which permissions are required to access a particular API endpoint.

### Securing APIs with Attributes

To secure APIs programmatically, you can use the `[SheshaAuthorize]` attribute in your AppService methods. This attribute takes a `RefListPermissionedAccess` access level as its first argument, followed by the permission name(s) required:

```csharp
[SheshaAuthorize(RefListPermissionedAccess.RequiresPermissions, "WorkOrder-Action")]
[HttpPost, Route("[action]")]
public async Task<CompleteWorkOrderResponse> CompleteWorkOrder(CompleteWorkOrderRequest input)
{
    // Logic to complete the work order ...
}
```

In this example, the `CompleteWorkOrder` method is secured with the `WorkOrder-Action` permission. Only users with this permission will be able to access this API endpoint.

:::note Other access levels
`RefListPermissionedAccess` also supports `AnyAuthenticated` (any logged-in user, no specific permission required) and `AllowAnonymous` (no login required), among others - use `RequiresPermissions` when you need to check specific permission names.
:::

By default, a configurator can override this access rule later through the **Permissioned Objects** page. To make the rule in code final, add `IsConfigurable = false`:

```csharp
[SheshaAuthorize(RefListPermissionedAccess.RequiresPermissions, "WorkOrder-Action", IsConfigurable = false)]
```

See [Endpoint Permissions](/docs/fundamentals/security/endpoint-permissions#controlling-access-in-code) for when to use each option, and how `[AllowAnonymous]` behaves.

### Securing Entity CRUD APIs with Attributes

The CRUD APIs that Shesha generates for each entity are secured on the entity class, with the `[Entity]` and `[EntityAuthorize]` attributes:

```csharp
[Entity(CrudActions = CrudActions.All, CrudActionsAccess = CrudActionsAccess.RequiresPermissions, CrudActionsPermissions = ["WorkOrder-Manage"])]
[EntityAuthorize(CrudAction.Read, ["WorkOrder-View", "WorkOrder-Manage"])]
public class WorkOrder : FullAuditedEntity<Guid>
{
    // ...
}
```

See [Controlling and Securing CRUD APIs in Code](/docs/back-end-basics/crud-apis#controlling-and-securing-crud-apis-in-code) for details.

### Custom Code for more Complex Scenarios

In some cases, you may need to implement more complex logic to determine whether a user has permission to perform an action. For example, you might want to allow users to complete a work order only if they are assigned to it.

```csharp
public class WorkOrderAppService : SheshaAppServiceBase<WorkOrder>
{
    private readonly IPermissionChecker _permissionChecker;
    private readonly IRepository<WorkOrder> _workOrderRepo;

    public WorkOrderAppService(IPermissionChecker permissionChecker, IRepository<WorkOrder> workOrderRepo)
    {
        _permissionChecker = permissionChecker;
        _workOrderRepo = workOrderRepo;
    }

    [HttpPost, Route("[action]")]
    public async Task<CompleteWorkOrderResponse> CompleteWorkOrder(CompleteWorkOrderRequest input)
    {
        bool hasWorkOrderActionPermission = await _permissionChecker.IsGrantedAsync("WorkOrder-Action");
        bool hasWorkOrderActionIfAssignedPermission = await _permissionChecker.IsGrantedAsync("WorkOrder-Action-if-Assigned");

        var workOrder = await _workOrderRepo.GetAsync(input.WorkOrderId);

        if (!hasWorkOrderActionPermission
            && !(hasWorkOrderActionIfAssignedPermission && workOrder.AssignedTo == CurrentPerson))
        {
            throw new AbpAuthorizationException("User does not have permission to complete the work order.");
        }

        // Logic to complete the work order
        ...
    }
}
```

---

## Data-Level Access Control

To enforce security at the data level, you can use **[global specifications](/docs/fundamentals/specifications)** to restrict visibility of data based on user permissions. This ensures that users can only access data that they are authorized to view, based on their roles and permissions.

:::warning Global Specifications may be bypassed
Global specifications are automatically applied when retrieving data using the `GetAll()` method on repositories, making them a convenient way to enforce security from a **centralized point**. However, specifications **do not apply** to data accessed through alternative methods, such as direct SQL queries or custom repository methods. Therefore, it is important to ensure that all data access points are properly secured.
:::

### Restricting Visibility of Data Based on Custom Conditions

In the example scenario below, we have a Customer Support Ticketing system, which has two roles: 'Supervisor', which can view all support tickets, and 'Support Agent', which should see only tickets assigned to them.

| Roles | Assigned Permissions |
|---|---|
| Supervisor | Ticket-View |
| Support Agent | Ticket-View-if-Assigned |

```csharp
public class SupportTicket : FullAuditedEntity<Guid>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public Person AssignedAgent { get; set; } // The agent assigned to this ticket
    // Other properties...
}

[Description("Specification to limit visibility of Tickets based on permissions.")]
[GlobalSpecification]  // This attribute makes this specification global, ensuring it is applied wherever the Ticket entity is queried via the repository
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

    public override Expression<Func<SupportTicket, bool>> BuildExpression()
    {
        // Get the current user ID from the session
        var userId = _abpSession.UserId;
        if (!userId.HasValue) return ticket => false; // No user ID means no access, return false to return zero tickets when queried

        // Retrieve the current person's details
        var currentPerson = _personRepository.FirstOrDefault(p => p.User.Id == userId);
        if (currentPerson == null) return ticket => false; // If person is not found, return false to return zero tickets when queried

        // Check for permissions that determine ticket visibility.
        // BuildExpression() is synchronous, so the async permission checks are resolved with GetAwaiter().GetResult() before returning.
        var canViewAll = _permissionChecker.IsGrantedAsync("Ticket-View").GetAwaiter().GetResult();
        if (canViewAll) return ticket => true; // If user can view all tickets, return all tickets

        var canViewIfAssigned = _permissionChecker.IsGrantedAsync("Ticket-View-if-Assigned").GetAwaiter().GetResult();
        if (canViewIfAssigned)
        {
            // If user can view tickets they are assigned to, return an expression that filters to tickets assigned to the current person
            return ticket => ticket.AssignedAgent.Id == currentPerson.Id;
        }

        // If user has no relevant permissions, return no tickets
        return ticket => false;
    }
}
```

:::warning BuildExpression is synchronous
`BuildExpression()` returns an `Expression<Func<T, bool>>`, not a `Task`, so it cannot use `await` directly. Resolve any async permission checks with `.GetAwaiter().GetResult()` (as above) before building the returned expression.
:::

### Restricting Visibility of Data Based on Scoped Role Assignments

In many systems, roles are not just global but can be scoped to specific entities. This means that the permissions granted to a user depend on the entities they are associated with. For example, in a CRM system, a role might be scoped by region or account.
Shesha provides built-in support for handling such scenarios efficiently.

Here's an example of roles in a CRM system:

| Role | Scoped By | Permissions | Description |
|---|---|---|---|
| Sales Director | N/A | Account-View | Can view all accounts without restrictions. |
| Regional Sales Manager | `Region` | Account-View-where-Scoped-to-Region | Can view all accounts within their assigned region(s). |
| Account Manager | `Account` | Account-View-where-Scoped | Can view only the accounts they are responsible for, as assigned through the Account Manager role. |
