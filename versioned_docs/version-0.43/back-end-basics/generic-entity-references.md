---
sidebar_label: Generic Entity References
sidebar_position: 3
---

# Generic Entity References

A `GenericEntityReference` is a special property type that allows an entity to reference **any other entity** without requiring a fixed foreign key relationship. This is useful when a property needs to point to different types of entities depending on the context.

For example, a `StoredFile` might be owned by a `Person`, an `Organisation`, or an `Order` — all through the same `Owner` property.

## How It Works

At the database level, a `GenericEntityReference` maps to **two or three columns** instead of a single foreign key:

| Column | Type | Description |
|---|---|---|
| `{Property}Id` | `nvarchar(100)` | The GUID of the referenced entity |
| `{Property}ClassName` | `nvarchar(1000)` | The fully qualified class name (or `TypeShortAlias`) of the referenced entity |
| `{Property}DisplayName` | `nvarchar(1000)` | *(Optional)* The display name of the referenced entity, cached for quick display on the front-end |

The third column (`DisplayName`) is only added when you opt in via the `[EntityReference(true)]` attribute. Storing the display name avoids additional API or database calls when rendering the reference in the UI.

## When to Use

Use `GenericEntityReference` when:

- A property needs to reference **different entity types** (e.g., an audit log entry that can relate to any entity)
- You want a **polymorphic association** without creating a separate foreign key for each possible target type
- You need to **display the referenced entity's name** in the UI without extra lookups

Use a standard entity reference (foreign key) when:

- The property always references the **same entity type**
- You need **database-level referential integrity** (foreign keys are not created for generic references)

## Defining a Generic Entity Reference

### Step 1: Add the property to your entity

```csharp
using Shesha.Domain.Attributes;
using Shesha.EntityReferences;

public class AuditEntry : FullAuditedEntity<Guid>
{
    public virtual string Action { get; set; }

    public virtual string Description { get; set; }

    /// <summary>
    /// The entity this audit entry relates to.
    /// The 'true' parameter stores the display name for quick UI rendering.
    /// </summary>
    [EntityReference(true)]
    public virtual GenericEntityReference RelatedEntity { get; set; }
}
```

The `[EntityReference]` attribute accepts the following parameters:

| Parameter | Type | Description |
|---|---|---|
| `storeDisplayName` | `bool` | When `true`, adds a `DisplayName` column to cache the referenced entity's display text. Default is `false`. |

### Step 2: Create the database migration

Use the `AddGenericEntityReferenceColumns` extension method to add the required columns:

```csharp
using FluentMigrator;
using Shesha.FluentMigrator;

[Migration(20260227120000)]
public class M20260227120000 : Migration
{
    public override void Up()
    {
        Create.Table("MyApp_AuditEntries")
            .WithIdAsGuid()
            .WithFullAuditColumns()
            .WithColumn("Action").AsString(100).Nullable()
            .WithColumn("Description").AsString(2000).Nullable();

        // Adds RelatedEntityId, RelatedEntityClassName, and RelatedEntityDisplayName columns
        Alter.Table("MyApp_AuditEntries")
            .AddGenericEntityReferenceColumns("RelatedEntity", storyDisplayName: true);
    }

    public override void Down()
    {
        throw new NotImplementedException();
    }
}
```

If you don't need the display name column, omit the second parameter or set it to `false`:

```csharp
// Adds only RelatedEntityId and RelatedEntityClassName columns
Alter.Table("MyApp_AuditEntries")
    .AddGenericEntityReferenceColumns("RelatedEntity");
```

:::tip Manual column creation
If you prefer to create the columns manually without the extension method, add the columns following this naming convention:

```csharp
Alter.Table("MyApp_AuditEntries")
    .AddColumn("RelatedEntityId").AsString(100).Nullable()
    .AddColumn("RelatedEntityClassName").AsString(1000).Nullable()
    .AddColumn("RelatedEntityDisplayName").AsString(1000).Nullable();  // Optional
```
:::

## Working with Generic Entity References in Code

### Creating a reference from an entity

When you have an entity instance, pass it to the `GenericEntityReference` constructor. The ID, class name, and display name are extracted automatically:

```csharp
var person = await _personRepository.GetAsync(personId);
var auditEntry = new AuditEntry
{
    Action = "Reviewed",
    Description = "Record reviewed by administrator",
    RelatedEntity = new GenericEntityReference(person)
};
```

### Creating a reference manually

If you don't have the entity loaded, you can construct the reference from its ID and type name:

```csharp
var auditEntry = new AuditEntry
{
    RelatedEntity = new GenericEntityReference(
        id: "550e8400-e29b-41d4-a716-446655440000",
        typeName: "Shesha.Core.Person",
        displayName: "John Smith"
    )
};
```

### Reading reference properties

```csharp
var entry = await _auditEntryRepository.GetAsync(entryId);

string entityId = entry.RelatedEntity?.Id;                // "550e8400-..."
string entityType = entry.RelatedEntity?._className;      // "Shesha.Core.Person"
string displayText = entry.RelatedEntity?._displayName;   // "John Smith"
```

## API and Front-End Integration

### API response format

When returned from an API, a `GenericEntityReference` is serialized as a JSON object:

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "_className": "Shesha.Core.Person",
    "_displayName": "John Smith"
}
```

### Sending a reference in API requests

When creating or updating an entity through the API, send the reference as a JSON object with at least `id` and `_className`:

```json
{
    "action": "Reviewed",
    "description": "Record reviewed by administrator",
    "relatedEntity": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "_className": "Shesha.Core.Person",
        "_displayName": "John Smith"
    }
}
```

## How the Display Name Is Resolved

When a `GenericEntityReference` is created from an entity instance, the framework automatically determines the display name by looking for (in order of priority):

1. A property decorated with the `[EntityDisplayName]` attribute
2. A property named `Name`, `DisplayName`, `FullName`, `Address`, or `FullAddress` (case-insensitive)

If the display name column is enabled (`[EntityReference(true)]`), this value is persisted in the database so the front-end can display it without additional lookups.

## Framework Usage Examples

The Shesha framework itself uses `GenericEntityReference` in several core entities:

| Entity | Property | Purpose |
|---|---|---|
| `StoredFile` | `Owner` | Links a stored file to any parent entity (Person, Organisation, etc.) |
| `Notification` | `TriggeringEntity` | References the entity that triggered a notification |

## See Also

- [Domain Model](/docs/back-end-basics/domain-model)
- [Domain Class Attributes](/docs/back-end-basics/domain-classes-attributes)
