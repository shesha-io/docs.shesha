---
sidebar_label: Audit Logging
position: 1
title: Audit Logging
---

# Audit Logging

Shesha Entity History framework is based on Abp.EntityHistory <a href="https://aspnetboilerplate.com/Pages/Documents/Entity-History" target="_blank">https://aspnetboilerplate.com/Pages/Documents/Entity-History</a>

In addition, were added some Shesha specific features.

## Log Changes to Entity Properties in Audit trail

- TODO

## Logging Custom Events to Audit Trail

A custom event and description can be added to the audit trail simply using:

#### Example:

```csharp
user.Password = newPassword;
user.AddHistoryEvent("Password reset");

// or

user.Password = newPassword;
user.AddHistoryEvent("Password reset", "Password reset by Administrator");
```

## Customising the Change Description

A custom description can be specified for the audit trail as follows:

#### Example:

```cs
user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", "IsActive");

// or

user.IsActive = false;
user.AddPropertyChangeDescription("User inactivated", p => p.IsActive);
```

This change will be shown in the audit trail as `User inactivated` instead of `"IsActive" was changed from "true" to "false"`

### Adding a property change comment

Custom comment of change for specific property will be added after standard description.
Example:

```cs
user.IsActive = false;
user.AddPropertyChangeComment("User inactivated", "IsActive");

// or

user.AddPropertyChangeComment("User inactivated", p => p.IsActive);
```

This change will be shown in the audit trail as: `"IsActive" was changed from "true" to "false" (User inactivated)`

# Audit Logging Attributes

A number of attributes are available to define the audit logging behaviour easily.

### Audit Boolean properties Attribute

Show a custom trueText or falseText message instead the standard property change message
Example:

```cs
[AuditedBoolean("SMS Based One-Time-Passwords enabled", "SMS Based One-Time-Passwords disabled")]
public virtual bool OtpEnabled { get; set; }
```

This change will be shown in the audit trail as:
`SMS Based One-Time-Passwords enabled` instead of `"OtpEnabled" was changed from "false" to "true"`
or
`SMS Based One-Time-Passwords disabled` instead of `"OtpEnabled" was changed from "true" to "false"`

### Audit property change as a custom event

Show a custom description and event type created by a class that implements the `IEntityHistoryEventCreator` interface or inherits from the `EntityHistoryEventCreatorBase` class.
Example:

```cs
[AuditedAsEvent(typeof(SchoolInformationStatusEventCreator))]
public virtual RefListSchoolInformationStatus? SchoolInformationStatus { get; set; }

...

private class SchoolInformationStatusEventCreator : EntityHistoryEventCreatorBase<RefListSchoolInformationStatus>
{
    public override EntityHistoryEventInfo CreateEvent(EntityChangesInfo<RefListSchoolInformationStatus> change)
    {
        return CreateEvent("School information status changed",
            change.NewValue == RefListSchoolInformationStatus.Submitted
                ? "Submitted for verification"
                : change.NewValue == RefListSchoolInformationStatus.Approved
                    ? "Submitted as final"
                    : "Not submitted");
    }
}

```

This change will be shown in the audit trail as:
`School information status changed: Not submitted` instead of `"SchoolInformationStatus" was changed from "" to "Draft"`

or

`School information status changed: Submitted for verification` instead of `"SchoolInformationStatus" was changed from "Draft" to "Submitted"`

or

`School information status changed: Submitted as final` instead of `"SchoolInformationStatus" was changed from "Submitted" to "Approved"`

# Audit trail of related or child entities

By default the audit trail will only display changes to properties at the top level. It is however quite common to want to see changes occurring on child objects. Attributes that allow to include audit events of related or children entities to the Audit trail of entity

### Display events from related entity

```cs
[AttributeUsage(AttributeTargets.Property)]
public class DisplayChildAuditTrailAttribute : Attribute
{
    public string[] AuditedFields { get; set; }
}
```

**`AuditedFields`** - an array of the child entity field names to be displayed. If this array is provided then the action types that should be shown in the audit have to be added - `Created`, `Updated` or `Deleted`.

#### Example

```cs
[DisplayChildAuditTrail]
[Display(Name = "Parent")]
public virtual Parent SubmittedBy { get; set; }
```

Show changes of entity (`Parent`) related through `SubmittedBy` field

## Display events from generic child entities (e.g. Notes, Attachments, Notifications)

Usually all generic entities implement the `IEntityWithMultipleOwnerTypes` interface

```cs
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class DisplayGenericEntitiesAuditTrailAttribute : Attribute
{
	public Type EntityType { get; set; }

	public string OwnerIdField { get; set; }

    public string OwnerTypeField { get; set; }

	public string DisplayName { get; set; }

	public string NameField { get; set; }

	public DisplayGenericEntitiesAuditTrailAttribute(Type entityType)
    {
    	EntityType = entityType;
    }
}
```

- **`EntityType`** - type of related generic entity (eg. `StoredFile`, `Note`, `Comment`)
- **`OwnerIdField`** - name of field of generic entity that store Id of owner entity. `OwnerId` by default
- **`OwnerTypeField`** - name of field of generic entity that store Type of owner entity. `OwnerType` by default
- **`DisplayName`** - name of the type of generic entity that will be displayed in the audit trail. If empty then gets `EntityAttribute()?.FriendlyName` of the **`EntityType`** or uses friendly name of the class of generic entity (**`EntityType`**`.Name.ToFriendlyName()`))
- **`NameField`** - name of field of generic entity that will use to get name of specific related generic entity. If empty then tries to find field with `EntityDisplayNameAttribute` or uses `genericEntity.ToString()`

#### Example:

```cs
[DisplayGenericEntitiesAuditTrail(typeof(Comment), NameField = "Text")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

Show events from related `Comment` entities and use `Text` field of `Comment` (content of comment) as name (description of event)

### Display events from child entities related as many to many through third entity

Relation entity should implement `IFullAudited` interface
Example of relation structure:

```cs
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

```cs
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

- **`ManyToManyEntityType`** - type of relation entity.
- **`DisplayName`** - name of the type of related entity that will be displayed in the audit trail. If empty then gets `EntityAttribute()?.FriendlyName` of the related entity or uses friendly name of the class of generic entity (`Related_Entity_Type.Name.ToFriendlyName()`)).
- **`OwnEntityField`** - name of field of relation entity that store reference to this entity. If empty then tries to find field with the same type as this entity.
- **`RelatedEntityField`** - name of field of relation entity that store reference to related entity.
- **`RelatedEntityType`** - type of relation entities (optional). It can be helpful if a type of relation entities is inherited.
- **`AnyRelatedEntityType`** - if true then will be found entities with any types by reference from **`RelatedEntityField`**. It can be helpful if related entities have different but inherited types (`Employee` -> `Person`).
- **`NameField`** - name of field of related entity that will use to get name of specific related entity. If empty then tries to find field with `EntityDisplayNameAttribute` or uses `relatedEntity.ToString()`.
- **`AuditedFields`** - an array of the child entity field names to be displayed. If this array is provided then the action types that should be shown in the audit have to be added - `Created`, `Updated` or `Deleted`.

Example:

Relation entity

```cs
public class ShaRoleAppointedPerson : FullAuditedEntity<Guid>
{
	public virtual Person Person { get; set; }
	public virtual ShaRole Role { get; set; }
}
```

```cs
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Person", DisplayName = "Member")]
public class ShaRole: FullAuditedEntity<Guid>, IMayHaveTenant
```

Show events from related `Person` entities as `Member` changes. `ShaRoleAppointedPerson` entities are used as many-to-many relation
`"Member" added : Full Name of person`

Also there is can be inverse relation:

```cs
[DisplayManyToManyAuditTrail(typeof(ShaRoleAppointedPerson), "Role", DisplayName = "Role Appointment")]
public class Person : FullAuditedEntity<Guid>, IMayHaveTenant
```

Show events from related `Role` entities as `Role Appointment` changes. `ShaRoleAppointedPerson` entities are used as many-to-many relation
`"Role Appointment" added : Name of role`

### Display events from child entities related as many to one

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
    {
    	ManyToOneEntityType = manyToOneEntityType;
        DisplayName = manyToOneEntityType.Name.ToFriendlyName();
    }
}
```

- **`ManyToOneEntityType`** - type of related entities.
- **`DisplayName`** - name of the type of related entity that will be displayed in the audit trail. If empty then gets `EntityAttribute()?.FriendlyName` of the related entity or uses friendly name of the class of generic entity (**`RelatedEntityType`**`.Name.ToFriendlyName()`)).
- **`RelatedEntityField`** - name of field of related entity that store reference to this entity.
- **`NameField`** - name of field of related entity that will use to get name of specific related entity. If empty then tries to find field with `EntityDisplayNameAttribute` or uses `relatedEntity.ToString()`.
- **`AuditedFields`** - an array of the child entity field names to be displayed. If this array is provided then the action types that should be shown in the audit have to be added - `Created`, `Updated` or `Deleted`.

### Example:

```cs
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

Show events from related `DepartmentUser` entities as `School user` changes.
`"School use" added : Full Name of Department user`

### End of the audit trail

Specify the property and value after which the audit will be considered complete

```cs
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

- **`PropertyName`** - name of the audited property.
- **`PropertyValue`** - value of the audited property. When the property changed to this value then the audit will be considered complete (records after this changes will be ignored).

#### Example:

```cs
[PropertyChangeToStopAuditTrail("SchoolVerificationOutcome", "Deleted By Parent")]
public class SchoolApplication : FullAuditedEntity<Guid>
```

When the `SchoolVerificationOutcome` property of the `SchoolApplication` entity will be changed to `Deleted By Parent` then the next records of audit for this entity will not be displayed

# Adding Audit trail events directly at the Database level

If changes to the data are made through direct database calls, these by-pass the logic responsible for tracking and logging data changes to the audit trail and therefore introduces potential gaps in the audit trail. To address this a number of SQL Stored Procedures are available for adding audit trail events when changes are made directly at the database level.

## Add list of changes

```sql
exec [dbo].[Core_AddEntityHistoryEvents] @changeTime, @reason, @tenantId, @userId, @changes
```

- **`@changeTime`** - Date and time of changes. `Null` will be replaced with current time
- **`@reason`** - Reason of changes
- **`@tenantId`** - Tenant Id
- **`@userId`** - User Id
- **`@changes`** - list (table) of changes. It is a variable of **Core_EntityHistoryItem** type

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

- **`ChangeType`** - type of changes - 0 - Created, 1 - Updated, 2 - Deleted.
- **`EntityId`** - Id of changed entity.
- **`EntityTypeFullName`** - fully qualified name of the entity type, including its namespace but not its assembly (C# - `entity.GetType().FullName.FullName` or `typeof(EntityType).FullName`).
- **`PropertyName`** - name of changed property.
- **`PropertyTypeFullName`** - Fully qualified name of the property type, including its namespace but not its assembly.
- **`NewValue`** - new value.
- **`OldValue`** - old value.
- **`Description`** - optional description.

Example:

Unlock all locked users - set IsLocked to false for all users with IsLocked with true.

With property changes data. It will be displayed as a property change in the Audtit trail (Like `User updated` event type with description `'IsLocked' was changed from 'true' to 'false'` or `User updated` event type with description `User unlocked`)

```sql
	Declare @changes Core_EntityHistoryItem

	insert into @changes
	select 1/* update*/, Id, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
	from Core_Persons
	where IsLocked = 1

	exec [dbo].[Core_AddEntityHistoryEvents] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, @changes
```

Without property changes date. It will be displayed as a Entity change event (Like `User unlocked` event type)

```sql
	Declare @changes Core_EntityHistoryItem

	insert into @changes
	select 1/* update*/, Id, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
	from Core_Persons
	where IsLocked = 1

	exec [dbo].[Core_AddEntityHistoryEvents] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, @changes
```

### Add single change

```sql
exec [dbo].[Core_AddEntityHistoryEvents] @changeTime, @reason, @tenantId, @userId, @changeType, @entityId, @entityTypeFullName, @propertyName, @propertyTypeFullName, @newValue, @oldValue, @description
```

- **`@changeTime`** - Date and time of changes.
- **`@reason`** - Reason of changes.
- **`@tenantId`** - Tenant Id.
- **`@userId`** - User Id.
- **`@changeType`** - type of changes - 0 - Created, 1 - Updated, 2 - Deleted.
- **`@entityId`** - Id of changed entity.
- **`@entityTypeFullName`** - fully qualified name of the entity type, including its namespace but not its assembly (C# - `entity.GetType().FullName.FullName` or `typeof(EntityType).FullName`).
- **`@propertyName`** - name of changed property.
- **`@propertyTypeFullName`** - Fully qualified name of the property type, including its namespace but not its assembly.
- **`@newValue`** - new value.
- **`@oldValue`** - old value.
- **`@description`** - optional description.

#### Example

Unlock specific user - set IsLocked to false for user

With property changes data. It will be displayed as a property change in the Audtit trail (Like `User updated` event type with description `'IsLocked' was changed from 'true' to 'false'` or `User updated` event type with description `User unlocked`)

```sql
	exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, 1/* update*/, 123456 /* User Id */, 'Shesha.Authorization.Users.User', 'IsLocked', 'System.Boolean', 'false', 'true', 'User unlocked' /* optional description */
```

Without property changes date. It will be displayed as a Entity change event (Like `User unlocked` event type)

```sql
	exec [dbo].[Core_AddSingleEntityHistoryEvent] null /* will be used current time */, 'Support ticket #12345: Unlock all users', null, 1 /* Admin user ID*/, 1/* update*/, 123456 /* User Id */, 'Shesha.Authorization.Users.User', null, null, null, null, 'User unlocked'
```
