---
sidebar_label: Audit Logging
title: Audit Logging
---

# Audit Logging

Shesha's audit logging (Entity History) framework records changes made to your entities - who changed what, when, and how the change should be described in an audit trail. It builds on `Abp.EntityHistory` ([ASP.NET Boilerplate's Entity History](https://aspnetboilerplate.com/Pages/Documents/Entity-History)), with a set of Shesha-specific attributes and helper methods added on top for friendlier descriptions and for tracking related and generic child entities.

---

## Audit Trail DataTable Configuration

Implemented in the `Shesha.Application` module's `Shesha.EntityHistory.EntityHistoryAppService` class (`GetAuditTrailAsync`). This lets you show the audit trail for a specific entity in a DataTable control.

Columns:

| Column | Description |
|---|---|
| **Type of event** | Type of audited event (Created, Updated, Child object updated, Child object added, etc.) or the changed property |
| **Description** | Main description of the event - property changes, the name of an added or removed child entity, or a custom event description. If several properties changed at once, all changes are shown as one description |
| **User** | Full name of the user who made the change or triggered the event |
| **Date** | Date of the event |

---

## Entity History for Anonymous Users (e.g. Background Jobs)

By default, entity history is already enabled for anonymous requests at the framework level (`Configuration.EntityHistory.IsEnabledForAnonymousUsers = true`, set in `SheshaFrameworkModule`). You only need to add the snippet below to your own module if something else in your application has turned it off and you want to re-enable it explicitly:

```cs
public override void PostInitialize()
{
	Configuration.EntityHistory.IsEnabledForAnonymousUsers = true;
}
```

---

## Audit Custom Events

Add any custom event to an entity's audit trail using the `Shesha.NHibernate.EntityHistory.EntityHistoryExtension` extension methods.

### Add a Simple Event With a Description

```cs
public static void AddHistoryEvent(this object entity, string description)
```

**Example - Record a password reset:**

```cs
user.Password = newPassword;
user.AddHistoryEvent("Password reset");
```

### Add an Event With a Type and a Description

```cs
public static void AddHistoryEvent(this object entity, string eventName, string description)
```

**Example - Record who reset the password:**

```cs
user.Password = newPassword;
user.AddHistoryEvent("Password reset", "Password reset by Administrator");
```

### Add a Property Change Description

Use a custom description for a specific property change, replacing the standard one.

```cs
public static void AddPropertyChangeDescription(this object entity, string description, string propertyName)
// or
public static void AddPropertyChangeDescription<TModel, TValue>(this TModel entity, string description, Expression<Func<TModel, TValue>> property)
```

**Example - Replace the default change description:**

```cs
user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", "IsActive");
// or
user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", p => p.IsActive);
```

This change is shown in the audit trail as `User inactivated`, instead of `"IsActive" was changed from "true" to "false"`.

### Add a Property Change Comment

Add a custom comment for a specific property change, appended after the standard description.

```cs
public static void AddPropertyChangeComment(this object entity, string description, string propertyName)
// or
public static void AddPropertyChangeComment<TModel, TValue>(this TModel entity, string description, Expression<Func<TModel, TValue>> property)
```

**Example - Add a comment alongside the default description:**

```cs
user.IsActive = false;
user.AddPropertyChangeComment("User inactivated", "IsActive");
// or
user.AddPropertyChangeComment("User inactivated", p => p.IsActive);
```

This change is shown in the audit trail as `"IsActive" was changed from "true" to "false" (User inactivated)`.

---

## Specific Property Audit Attributes

### Audit Boolean Properties

Show a custom `trueText`/`falseText` message instead of the standard property-change message.

```cs
[AttributeUsage(AttributeTargets.Property)]
public class AuditedBooleanAttribute : Attribute
{
    public string? EventText { get; set; }
    public AuditedBooleanAttribute(string trueText, string falseText)
}
```

**Example:**

```cs
[AuditedBoolean("SMS Based One-Time-Passwords enabled", "SMS Based One-Time-Passwords disabled")]
public virtual bool OtpEnabled { get; set; }
```

This change is shown in the audit trail as `SMS Based One-Time-Passwords enabled` instead of `"OtpEnabled" was changed from "false" to "true"` (and the equivalent `...disabled` message for the reverse change).

### Audit a Property Change as a Custom Event

Show a custom description and event type, created by a class that implements `IEntityHistoryEventCreator` or inherits `EntityHistoryEventCreatorBase`.

```cs
[AttributeUsage(AttributeTargets.Property)]
public class AuditedAsEventAttribute : Attribute
{
    public Type EventCreator { get; set; }
    public bool SaveFullInfo { get; set; }
    public AuditedAsEventAttribute(Type eventCreator, bool saveFullInfo = true)
}
```

:::note Two type parameters
`EntityHistoryEventCreatorBase` and `EntityChangesInfo` each take two type parameters: the entity type first, then the property's value type. A creator for a `RefListSchoolInformationStatus` property on `SchoolApplication` is written `EntityHistoryEventCreatorBase<SchoolApplication, RefListSchoolInformationStatus>`, not a single-parameter form.
:::

**Example:**

```cs
private class SchoolInformationStatusEventCreator : EntityHistoryEventCreatorBase<SchoolApplication, RefListSchoolInformationStatus>
{
    public override EntityHistoryEventInfo CreateEvent(EntityChangesInfo<SchoolApplication, RefListSchoolInformationStatus> change)
    {
        return CreateEvent("School information status changed",
            change.NewValue == RefListSchoolInformationStatus.Submitted
                ? "Submitted for verification"
                : change.NewValue == RefListSchoolInformationStatus.Approved
                    ? "Submitted as final"
                    : "Not submitted");
    }
}

[AuditedAsEvent(typeof(SchoolInformationStatusEventCreator))]
public virtual RefListSchoolInformationStatus? SchoolInformationStatus { get; set; }
```

This change is shown in the audit trail as **`School information status changed: Submitted for verification`**, instead of **`"SchoolInformationStatus" was changed from "Draft" to "Submitted"`**.

---

## Audit Trail of Related or Child Entities

Attributes that include audit events from related or child entities in an entity's own audit trail.

### Display Events From a Related Entity

```cs
[AttributeUsage(AttributeTargets.Property)]
public class DisplayChildAuditTrailAttribute : Attribute
{
    public string[]? AuditedFields { get; set; }
}
```

`AuditedFields` is an array of the child entity's field names to display. If provided, you must also add the action types to show (`Created`, `Updated`, or `Deleted`).

**Example:**

```cs
[DisplayChildAuditTrail]
[Display(Name = "Parent")]
public virtual Parent SubmittedBy { get; set; }
```

Shows changes of the related `Parent` entity, reached through the `SubmittedBy` field.

### Display Events From Generic Child Entities (e.g. Notes, Attachments, Notifications)

Generic entities are matched to their owner by field name convention rather than a shared interface. They typically expose an `OwnerId` field (the owner entity's Id) and an `OwnerType` field (the owner entity's type), which `DisplayGenericEntitesAuditTrailAttribute` reads by default - see `OwnerIdField` and `OwnerTypeField` below if your entity uses different field names.

:::note Watch the spelling
This attribute is spelled `DisplayGenericEntitesAuditTrailAttribute` - missing the "i" in "Entites" - not the more natural-looking `DisplayGenericEntitiesAuditTrailAttribute`. Your code needs to match this exact spelling, as shown below, or it won't compile.
:::

```cs
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayGenericEntitesAuditTrailAttribute : Attribute
{
    public Type EntityType { get; set; }
    public string? OwnerIdField { get; set; }
    public string? OwnerTypeField { get; set; }
    public string? DisplayName { get; set; }
    public string? NameField { get; set; }

    public DisplayGenericEntitesAuditTrailAttribute(Type entityType)
}
```

| Property | Description |
|---|---|
| `EntityType` | Type of the related generic entity (e.g. `StoredFile`, `Note`, `Comment`) |
| `OwnerIdField` | Name of the generic entity's field that stores the owner entity's Id. `OwnerId` by default |
| `OwnerTypeField` | Name of the generic entity's field that stores the owner entity's type. `OwnerType` by default |
| `DisplayName` | Name of the generic entity type shown in the audit trail. If empty, uses `EntityAttribute()?.FriendlyName` of `EntityType`, or the class's friendly name |
| `NameField` | Field used to get the name of the specific related generic entity. If empty, tries a field with `EntityDisplayNameAttribute`, or falls back to `genericEntity.ToString()` |

**Example:**

```cs
[DisplayGenericEntitesAuditTrail(typeof(Comment), NameField = "Text")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

Shows events from related `Comment` entities, using the comment's `Text` field as the event's description.

### Display Events From Many-to-Many Related Entities

The relation entity must implement `IFullAudited`. Example relation structure:

```cs
public class A { }
public class B { }

public class RelationAB
{
    public A ObjectA { get; set; }
    public B ObjectB { get; set; }
}
```

```cs
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayManyToManyAuditTrailAttribute : Attribute
{
    public Type ManyToManyEntityType { get; set; }
    public string DisplayName { get; set; }
    public string? OwnEntityField { get; set; }
    public string RelatedEntityField { get; set; }
    public Type? RelatedEntityType { get; set; }
    public bool AnyRelatedEntityType { get; set; }
    public string? NameField { get; set; }
    public string[]? AuditedFields { get; set; }

    public DisplayManyToManyAuditTrailAttribute(Type manyToManyEntityType, string relatedEntityField)
}
```

| Property | Description |
|---|---|
| `ManyToManyEntityType` | Type of the relation entity |
| `DisplayName` | Name of the related entity type shown in the audit trail. Defaults to the relation entity's friendly name |
| `OwnEntityField` | Field on the relation entity that references this entity. If empty, looks for a field with the same type as this entity |
| `RelatedEntityField` | Field on the relation entity that references the related entity |
| `RelatedEntityType` | Type of the relation entities (optional) - useful when the relation entity type is inherited |
| `AnyRelatedEntityType` | If `true`, matches entities of any type referenced by `RelatedEntityField` - useful when related entities have different but related types (e.g. `Employee` -> `Person`) |
| `NameField` | Field used to get the related entity's name. If empty, tries a field with `EntityDisplayNameAttribute`, or falls back to `relatedEntity.ToString()` |
| `AuditedFields` | Array of the child entity's field names to display. If provided, you must also add the action types to show (`Created`, `Updated`, or `Deleted`) |

**Example - Relation entity:**

```cs
public class ShaRoleAppointedPerson : FullAuditedEntity<Guid>
{
    public virtual Person Person { get; set; }
    public virtual ShaRole Role { get; set; }
}
```

```cs
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Person", DisplayName = "Member")]
public class ShaRole : FullAuditedEntity<Guid>, IMayHaveTenant
```

Shows events from related `Person` entities as `Member` changes, using `ShaRoleAppointedPerson` as the many-to-many relation - for example `"Member" added: Full Name of person`.

The inverse relation can be declared the same way:

```cs
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Role", DisplayName = "Role Appointment")]
public class Person : FullAuditedEntity<Guid>, IMayHaveTenant
```

### Display Events From Many-to-One Related Entities

```cs
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayManyToOneAuditTrailAttribute : Attribute
{
    public Type ManyToOneEntityType { get; set; }
    public string DisplayName { get; set; }
    public string RelatedEntityField { get; set; }
    public string NameField { get; set; }
    public string[] AuditedFields { get; set; }

    public DisplayManyToOneAuditTrailAttribute(Type manyToOneEntityType)
}
```

| Property | Description |
|---|---|
| `ManyToOneEntityType` | Type of the related entities |
| `DisplayName` | Name of the related entity type shown in the audit trail. Defaults to the related entity's friendly name |
| `RelatedEntityField` | Field on the related entity that references this entity |
| `NameField` | Field used to get the related entity's name. If empty, tries a field with `EntityDisplayNameAttribute`, or falls back to `relatedEntity.ToString()` |
| `AuditedFields` | Array of the child entity's field names to display. If provided, you must also add the action types to show (`Created`, `Updated`, or `Deleted`) |

**Example:**

```cs
[DisplayManyToOneAuditTrail(typeof(DepartmentUser), DisplayName = "School user")]
public class School : Facility { }

public class DepartmentUser : GDEPerson
{
    [Audited]
    public virtual School School { get; set; }
}
```

Shows events from related `DepartmentUser` entities as `School user` changes - for example `"School user" added: Full Name of Department user`.

### End of the Audit Trail

Specify a property and value after which the entity's audit trail is considered complete.

```cs
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class PropertyChangeToStopAuditTrailAttribute : Attribute
{
    public string PropertyName { get; set; }
    public string PropertyValue { get; set; }

    public PropertyChangeToStopAuditTrailAttribute(string propertyName, string propertyValue)
}
```

**Example:**

```cs
[PropertyChangeToStopAuditTrail("SchoolVerificationOutcome", "Deleted By Parent")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

Once `SchoolVerificationOutcome` changes to `Deleted By Parent`, later audit records for this entity are not displayed.

---

## SQL Stored Procedures for Adding Entity History

If you make direct database changes, you can call these stored procedures to add matching entity history events, so the audit trail stays complete even for changes made outside the application.

### Add a List of Changes

```sql
exec [dbo].[Core_AddEntityHistoryEvents] @changeTime, @reason, @tenantId, @userId, @changes
```

| Parameter | Description |
|---|---|
| `@changeTime` | Date and time of the changes. `Null` is replaced with the current time |
| `@reason` | Reason for the changes |
| `@tenantId` | Tenant Id |
| `@userId` | User Id |
| `@changes` | List (table-valued parameter) of changes, of type `Core_EntityHistoryItem` |

```sql
CREATE TYPE Core_EntityHistoryItem AS TABLE
(
	/* Entity changes data */
	ChangeType tinyint, /* 0 - Created, 1 - Updated, 2 - Deleted*/
	EntityId nvarchar(48),
	EntityTypeFullName nvarchar(192), /* Fully qualified name of the entity type, including its namespace but not its assembly */

	/* Property changes data */
	PropertyName nvarchar(96),
	PropertyTypeFullName nvarchar(256), /* Fully qualified name of the property type, including its namespace but not its assembly */
	NewValue nvarchar(512),
	OldValue nvarchar(512),

	Description nvarchar(512) /* Optional */
)
```

**Example - Unlock all locked users, with a property-change description:**

Shown as a property change in the audit trail (`User updated` with description `'IsLocked' was changed from 'true' to 'false'`, or with the custom description `User unlocked` if provided):

```sql
Declare @changes Core_EntityHistoryItem

insert into @changes
select 1/* update*/, Id, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
from Core_Persons
where IsLocked = 1

exec [dbo].[Core_AddEntityHistoryEvents] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, @changes
```

**Example - Unlock all locked users, as a plain entity event:**

Without property-change data, shown as an entity-level event (`User unlocked`):

```sql
Declare @changes Core_EntityHistoryItem

insert into @changes
select 1/* update*/, Id, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
from Core_Persons
where IsLocked = 1

exec [dbo].[Core_AddEntityHistoryEvents] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, @changes
```

### Add a Single Change

```sql
exec [dbo].[Core_AddEntityHistoryEvents] @changeTime, @reason, @tenantId, @userId, @changeType, @entityId, @entityTypeFullName, @propertyName, @propertyTypeFullName, @newValue, @oldValue, @description
```

| Parameter | Description |
|---|---|
| `@changeTime` | Date and time of the changes |
| `@reason` | Reason for the changes |
| `@tenantId` | Tenant Id |
| `@userId` | User Id |
| `@changeType` | Type of change - 0 Created, 1 Updated, 2 Deleted |
| `@entityId` | Id of the changed entity |
| `@entityTypeFullName` | Fully qualified name of the entity type, including its namespace but not its assembly (C# - `entity.GetType().FullName` or `typeof(EntityType).FullName`) |
| `@propertyName` | Name of the changed property |
| `@propertyTypeFullName` | Fully qualified name of the property type, including its namespace but not its assembly |
| `@newValue` | New value |
| `@oldValue` | Old value |
| `@description` | Optional description |

**Example - Unlock a specific user, with a property-change description:**

```sql
exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, 1/* update*/, 123456 /* User Id */, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
```

**Example - Unlock a specific user, as a plain entity event:**

```sql
exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, 1/* update*/, 123456 /* User Id */, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
```
