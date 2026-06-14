---
sidebar_label: Audit Logging
title: Audit Logging
---

# Audit Logging

Audit logging keeps a record of what changed on your data, when it changed, and who changed it. In Shesha this record is called the audit trail, and it lets you answer questions like "who deactivated this user?" or "when was this application submitted?" without writing any extra code.

Shesha builds its audit trail on top of the ABP Entity History framework and then adds several Shesha specific features on top. If you want to understand the underlying mechanism, the ABP documentation is a good starting point: <a href="https://aspnetboilerplate.com/Pages/Documents/Entity-History" target="_blank">ABP Entity History</a>.

:::info
The features described on this page are written against the `releases/0.43` branch of the Shesha framework. All attribute names, method signatures, and stored procedure parameters have been verified against that source.
:::

---

## Logging changes to entity properties

The simplest way to track changes is to mark what you want audited.

- Mark an individual property with the `[Audited]` attribute to track changes to that property.
- Have the entity inherit from a fully audited base class such as `FullAuditedEntity<Guid>` so that creation, update, and deletion are all tracked.

**Example - Audit a single property:**

```csharp
[Audited]
[ReferenceList("SheshaFunctionalTests", "MembershipStatuses")]
public virtual RefListMembershipStatuses? MembershipStatus { get; set; }
```

Once a property or entity is audited, Shesha records the old value and the new value for every change and displays them in the audit trail.

---

## Logging custom events to the audit trail

Sometimes a change is more meaningful as a named event than as a raw property change. You can add a custom event and description to the audit trail directly from your code.

**Example - Record a password reset as an event:**

```csharp
user.Password = newPassword;
user.AddHistoryEvent("Password reset");

// or with a longer description

user.Password = newPassword;
user.AddHistoryEvent("Password reset", "Password reset by Administrator");
```

The `AddHistoryEvent` extension method has several overloads, so you can supply just a description, an event name and description, or a full event type, name, and description depending on how much detail you need.

---

## Customising the change description

By default the audit trail shows a generic message such as `"IsActive" was changed from "true" to "false"`. You can replace that with a description that reads in plain business language.

**Example - Show a friendly description instead of the raw property change:**

```csharp
user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", "IsActive");

// or using a strongly typed property expression

user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", p => p.IsActive);
```

This change shows in the audit trail as `User inactivated` instead of `"IsActive" was changed from "true" to "false"`.

___

### Adding a property change comment

A comment is different from a description. Where a description replaces the standard message, a comment is appended after it. The standard property change message is kept and your comment is added in brackets.

**Example - Append a comment to the standard message:**

```csharp
user.IsActive = false;
user.AddPropertyChangeComment("User inactivated", "IsActive");

// or using a strongly typed property expression

user.AddPropertyChangeComment("User inactivated", p => p.IsActive);
```

This change shows in the audit trail as `"IsActive" was changed from "true" to "false" (User inactivated)`.

---

## Audit logging attributes

The methods above are useful when you want to control logging from inside a method. When the behaviour is always the same for a property, it is cleaner to declare it once with an attribute. The following attributes let you define audit logging behaviour declaratively on the entity.

### Audited boolean properties

Use the `[AuditedBoolean]` attribute to show a custom message for `true` and `false` instead of the standard property change message. The constructor takes a `trueText` and a `falseText`.

**Example - Show readable text for a boolean toggle:**

```csharp
[AuditedBoolean("SMS Based One-Time-Passwords enabled", "SMS Based One-Time-Passwords disabled")]
public virtual bool OtpEnabled { get; set; }
```

This change shows in the audit trail as `SMS Based One-Time-Passwords enabled` when the value becomes `true`, and `SMS Based One-Time-Passwords disabled` when it becomes `false`, instead of `"OtpEnabled" was changed from "false" to "true"`.

___

### Auditing a property change as a custom event

Use the `[AuditedAsEvent]` attribute to generate a custom description and event type when a property changes. The logic lives in a class that inherits from `EntityHistoryEventCreatorBase<E, T>`, where `E` is the entity type and `T` is the type of the property being audited.

The constructor takes the type of the event creator, and an optional `saveFullInfo` flag that defaults to `true`.

**Example - Generate a custom event when a membership number changes:**

```csharp
[AuditedAsEvent(typeof(MembershipNumberEventCreator))]
public virtual string MembershipNumber { get; set; }

...

private class MembershipNumberEventCreator : EntityHistoryEventCreatorBase<Member, string>
{
    public override EntityHistoryEventInfo CreateEvent(EntityChangesInfo<Member, string> change)
    {
        return CreateEvent("Custom Event Description",
            $"Membership number updated from {change.OldValue} to {change.NewValue}");
    }
}
```

Inside `CreateEvent` you have access to the change through `EntityChangesInfo<E, T>`, which exposes the audited `Entity`, the `Property` that changed, and the `OldValue` and `NewValue` (both typed as `T`). The `CreateEvent(eventName, description)` helper builds the `EntityHistoryEventInfo` that is written to the audit trail.

---

## Auditing related and child entities

By default the audit trail only shows changes to properties at the top level of the entity. It is common to also want to see changes that happen on child or related objects. The following attributes let you include audit events from related or child entities in the audit trail of the parent entity.

### Display events from a related entity

The `[DisplayChildAuditTrail]` attribute pulls the audit events of a related entity into the current entity's audit trail.

```csharp
[AttributeUsage(AttributeTargets.Property)]
public class DisplayChildAuditTrailAttribute : Attribute
{
    public string[] AuditedFields { get; set; }
}
```

**`AuditedFields`** is an array of the child entity field names to display. When this array is provided, you also need to add the action types that should be shown in the audit: `Created`, `Updated`, or `Deleted`.

**Example - Show changes of a related parent entity:**

```csharp
[DisplayChildAuditTrail]
[Display(Name = "Parent")]
public virtual Parent SubmittedBy { get; set; }
```

This shows changes of the `Parent` entity related through the `SubmittedBy` field.

___

### Display events from generic child entities

Generic entities such as notes, attachments, and comments are linked to their owner through an owner id and an owner type rather than a normal foreign key. Use the `[DisplayGenericEntitesAuditTrail]` attribute on the owning entity class to include their events.

```csharp
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayGenericEntitesAuditTrailAttribute : Attribute
{
    public Type EntityType { get; set; }

    public string OwnerIdField { get; set; }

    public string OwnerTypeField { get; set; }

    public string DisplayName { get; set; }

    public string NameField { get; set; }

    public string CategoryField { get; set; }

    public object CategoryValue { get; set; }

    public DisplayGenericEntitesAuditTrailAttribute(Type entityType)
    {
        EntityType = entityType;
    }
}
```

- **`EntityType`** - the type of the related generic entity (for example `StoredFile`, `Note`, or `Comment`).
- **`OwnerIdField`** - the field on the generic entity that stores the id of the owner. Defaults to `OwnerId`.
- **`OwnerTypeField`** - the field on the generic entity that stores the type of the owner. Defaults to `OwnerType`.
- **`DisplayName`** - the name of the generic entity type shown in the audit trail. If empty, it uses the `FriendlyName` from the entity's `EntityAttribute`, or a friendly name derived from the class name.
- **`NameField`** - the field used to name a specific related generic entity. If empty, it looks for a field marked with `EntityDisplayNameAttribute`, or falls back to `ToString()`.
- **`CategoryField`** - an optional field used to filter the related entities by category.
- **`CategoryValue`** - the value the category field must match for the entity to be included.

:::note
The attribute class name in the framework source is spelled `DisplayGenericEntitesAuditTrail` (without the second "i"). Use that exact spelling in your code so it compiles.
:::

**Example - Show comments related to a school application:**

```csharp
[DisplayGenericEntitesAuditTrail(typeof(Comment), NameField = "Text")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

This shows events from related `Comment` entities and uses the `Text` field of the comment as the event name.

___

### Display events from many-to-many child entities

When two entities are related many-to-many through a third relation entity, use the `[DisplayManyToManyAuditTrail]` attribute. The relation entity must implement `IFullAudited`.

A typical relation structure looks like this:

```csharp
public class A
{
    ...
}

public class B
{
    ...
}

public class RelationAB
{
    public A ObjectA { get; set; }
    public B ObjectB { get; set; }

    ...
}
```

```csharp
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayManyToManyAuditTrailAttribute : Attribute
{
    public Type ManyToManyEntityType { get; set; }

    public string DisplayName { get; set; }

    public string OwnEntityField { get; set; }

    public string RelatedEntityField { get; set; }

    public Type RelatedEntityType { get; set; }

    public bool AnyRelatedEntityType { get; set; }

    public string NameField { get; set; }

    public string[] AuditedFields { get; set; }

    public DisplayManyToManyAuditTrailAttribute(Type manyToManyEntityType, string relatedEntityField)
    {
        ManyToManyEntityType = manyToManyEntityType;
        DisplayName = manyToManyEntityType.Name.ToFriendlyName();
        RelatedEntityField = relatedEntityField;
    }
}
```

- **`ManyToManyEntityType`** - the type of the relation entity.
- **`DisplayName`** - the name of the related entity type shown in the audit trail. If empty, it uses the related entity's `FriendlyName`, or a friendly name derived from the class name.
- **`OwnEntityField`** - the field on the relation entity that references this entity. If empty, it looks for a field with the same type as this entity.
- **`RelatedEntityField`** - the field on the relation entity that references the related entity.
- **`RelatedEntityType`** - the type of the related entities. This is optional and helps when the related type is inherited.
- **`AnyRelatedEntityType`** - when `true`, related entities of any type found through `RelatedEntityField` are included. This helps when related entities have different but inherited types (for example `Employee` inheriting from `Person`).
- **`NameField`** - the field used to name a specific related entity. If empty, it looks for a field marked with `EntityDisplayNameAttribute`, or falls back to `ToString()`.
- **`AuditedFields`** - an array of child entity field names to display. When provided, you also need to add the action types to show: `Created`, `Updated`, or `Deleted`.

**Example - Show role members as a many-to-many relationship:**

The relation entity:

```csharp
public class ShaRoleAppointedPerson : FullAuditedEntity<Guid>
{
    public virtual Person Person { get; set; }
    public virtual ShaRole Role { get; set; }
}
```

```csharp
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Person", DisplayName = "Member")]
public class ShaRole: FullAuditedEntity<Guid>, IMayHaveTenant
```

This shows events from related `Person` entities as `Member` changes, using `ShaRoleAppointedPerson` as the many-to-many relation, for example `"Member" added : Full Name of person`.

The relationship can also be defined in the inverse direction:

```csharp
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Role", DisplayName = "Role Appointment")]
public class Person : FullAuditedEntity<Guid>, IMayHaveTenant
```

This shows events from related `Role` entities as `Role Appointment` changes, for example `"Role Appointment" added : Name of role`.

___

### Display events from many-to-one child entities

When child entities reference this entity through a single foreign key, use the `[DisplayManyToOneAuditTrail]` attribute.

```csharp
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayManyToOneAuditTrailAttribute : Attribute
{
    public Type ManyToOneEntityType { get; set; }

    public string DisplayName { get; set; }

    public string RelatedEntityField { get; set; }

    public string NameField { get; set; }

    public string[] AuditedFields { get; set; }

    public DisplayManyToOneAuditTrailAttribute(Type manyToOneEntityType)
    {
        ManyToOneEntityType = manyToOneEntityType;
        DisplayName = manyToOneEntityType.Name.ToFriendlyName();
    }
}
```

- **`ManyToOneEntityType`** - the type of the related entities.
- **`DisplayName`** - the name of the related entity type shown in the audit trail. If empty, it uses the related entity's `FriendlyName`, or a friendly name derived from the class name.
- **`RelatedEntityField`** - the field on the related entity that references this entity.
- **`NameField`** - the field used to name a specific related entity. If empty, it looks for a field marked with `EntityDisplayNameAttribute`, or falls back to `ToString()`.
- **`AuditedFields`** - an array of child entity field names to display. When provided, you also need to add the action types to show: `Created`, `Updated`, or `Deleted`.

**Example - Show department users related to a school:**

```csharp
[DisplayManyToOneAuditTrail(typeof(DepartmentUser), DisplayName = "School user")]
public class School : Facility
{
    ...
}

public class DepartmentUser : GDEPerson
{
    [Audited]
    public virtual School School { get; set; }

    ...
}
```

This shows events from related `DepartmentUser` entities as `School user` changes, for example `"School user" added : Full Name of Department user`.

___

### Stopping the audit trail at a property value

Use the `[PropertyChangeToStopAuditTrail]` attribute to mark the point after which auditing should be considered complete. Once the named property reaches the given value, later changes to that entity are no longer shown.

```csharp
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class PropertyChangeToStopAuditTrailAttribute : Attribute
{
    public string PropertyName { get; set; }

    public string PropertyValue { get; set; }

    public PropertyChangeToStopAuditTrailAttribute(string propertyName, string propertyValue)
    {
        PropertyName = propertyName;
        PropertyValue = propertyValue;
    }
}
```

- **`PropertyName`** - the name of the audited property.
- **`PropertyValue`** - the value that completes the audit. When the property changes to this value, later audit records for this entity are not displayed.

**Example - Stop auditing once an application is deleted by the parent:**

```csharp
[PropertyChangeToStopAuditTrail("SchoolVerificationOutcome", "Deleted By Parent")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

When the `SchoolVerificationOutcome` property of the `SchoolApplication` entity changes to `Deleted By Parent`, later audit records for this entity are not displayed.

---

## Adding audit trail events directly at the database level

When data is changed through direct database calls, those changes bypass the application logic that normally tracks and logs them. This creates gaps in the audit trail. To close those gaps, Shesha provides SQL stored procedures that add audit trail events for changes made directly at the database level.

### Add a list of changes

```sql
exec [dbo].[Core_AddEntityHistoryEvents] @changeTime, @reason, @tenantId, @userId, @changes
```

- **`@changeTime`** - the date and time of the changes. `Null` is replaced with the current time.
- **`@reason`** - the reason for the changes.
- **`@tenantId`** - the tenant id.
- **`@userId`** - the user id.
- **`@changes`** - a table of changes, passed as a variable of the `Core_EntityHistoryItem` type.

The `Core_EntityHistoryItem` table type is defined as follows:

```sql
CREATE TYPE Core_EntityHistoryItem AS TABLE
(
    /* Entity changes data */
    ChangeType tinyint, /* 0 - Created, 1 - Updated, 2 - Deleted */
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

- **`ChangeType`** - the type of change: 0 for Created, 1 for Updated, 2 for Deleted.
- **`EntityId`** - the id of the changed entity.
- **`EntityTypeFullName`** - the fully qualified name of the entity type, including its namespace but not its assembly (in C#, `entity.GetType().FullName` or `typeof(EntityType).FullName`).
- **`PropertyName`** - the name of the changed property.
- **`PropertyTypeFullName`** - the fully qualified name of the property type, including its namespace but not its assembly.
- **`NewValue`** - the new value.
- **`OldValue`** - the old value.
- **`Description`** - an optional description.

**Example - Unlock all locked users with property change data:**

This records property change data, so it shows as a property change in the audit trail, for example a `User updated` event with the description `User unlocked`.

```sql
Declare @changes Core_EntityHistoryItem

insert into @changes
select 1 /* update */, Id, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
from Core_Persons
where IsLocked = 1

exec [dbo].[Core_AddEntityHistoryEvents] null /* current time is used */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user id */, @changes
```

**Example - Unlock all locked users without property change data:**

This omits property change data, so it shows as an entity change event, for example a `User unlocked` event.

```sql
Declare @changes Core_EntityHistoryItem

insert into @changes
select 1 /* update */, Id, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
from Core_Persons
where IsLocked = 1

exec [dbo].[Core_AddEntityHistoryEvents] null /* current time is used */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user id */, @changes
```

___

### Add a single change

```sql
exec [dbo].[Core_AddSingleEntityHistoryEvent] @changeTime, @reason, @tenantId, @userId, @changeType, @entityId, @entityTypeFullName, @propertyName, @propertyTypeFullName, @newValue, @oldValue, @description
```

- **`@changeTime`** - the date and time of the change.
- **`@reason`** - the reason for the change.
- **`@tenantId`** - the tenant id.
- **`@userId`** - the user id.
- **`@changeType`** - the type of change: 0 for Created, 1 for Updated, 2 for Deleted.
- **`@entityId`** - the id of the changed entity.
- **`@entityTypeFullName`** - the fully qualified name of the entity type, including its namespace but not its assembly.
- **`@propertyName`** - the name of the changed property.
- **`@propertyTypeFullName`** - the fully qualified name of the property type, including its namespace but not its assembly.
- **`@newValue`** - the new value.
- **`@oldValue`** - the old value.
- **`@description`** - an optional description.

**Example - Unlock a specific user with property change data:**

```sql
exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* current time is used */, 'Support ticket #12345: Unlock user', null, 1 /* Admin user id */, 1 /* update */, 123456 /* User id */, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
```

**Example - Unlock a specific user without property change data:**

```sql
exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* current time is used */, 'Support ticket #12345: Unlock user', null, 1 /* Admin user id */, 1 /* update */, 123456 /* User id */, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
```

:::note
These stored procedures are available for both Microsoft SQL Server and PostgreSQL. The parameter lists shown above are the same across both database engines.
:::
