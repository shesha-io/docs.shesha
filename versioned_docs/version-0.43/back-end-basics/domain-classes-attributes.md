---
sidebar_label: Domain Class Attributes
sidebar_position: 2
---

# Domain Attributes

# Entity Class Attributes

| **Attribute**                               | **Description**  |
| --- | --- |
| `[Audited]`                                | When applied at the class level, all properties on the entity will be audited, meaning that any changes to their values will be logged, indicating when the change was made, the user responsible for that change, as well as the original and new value(s). See also [audit logging](/docs/fundamentals/audit-logging). |
| `[Discriminator]`                           | This attribute should be applied to any entity that you expect to inherit from so that a Discriminator column can be added at the database layer. By default, Shesha uses a 'Table per Hierarchy' inheritance strategy. This means that all entity subclasses will be stored in the same table as the base class, and a discriminator column will be used to identify the type of entity being stored. |
| `[DiscriminatorValue("DiscriminatorName")]` | This attribute should only be applied to entities that inherit from another entity class. It specifies the value to be used as its discriminator when stored in the database. By default, Shesha uses a 'Table per Hierarchy' inheritance strategy. This means that all entity subclasses will be stored in the same table as the base class, and a discriminator column will be used to identify the type of entity being stored. If this attribute is omitted, Shesha will use the entity class's namespace and name, e.g., `MyOrg.MyApp.` |
| `[Entity]`                                  | Provides parameters to add additional metadata to the entity and control additional aspects of the behavior of the entity: <br/> **`GenerateApplicationService`** - Specifies whether CRUD APIs for this entity should be generated. See also [CRUD APIs](/docs/back-end-basics/crud-apis). <br/> **`ApplicationServiceName`** - The name of the application service to be generated for the entity. This will be reflected in the URL of the dynamically generated CRUD API. If not specified, the name of the entity will be used. See also [CRUD APIs](/docs/back-end-basics/crud-apis). <br/> **`FriendlyName`** - A more user-friendly name for the entity to be used in the UI. If not specified, the name of the entity will be used. <br/> **`TypeShortAlias`** - (For internal use) Alias sometimes used by the framework instead of the fully qualified type name to identify the type of the entity. |
| `[Table("TableName")]`                      | Specifies the database table that the entity data will be persisted to. If omitted, the framework will assume the normal naming conventions. |
| `[AddToMetadata]`                           | This attribute can mainly be used to forcibly add a DTO that has not been utilized on any service in the application to the list of models available to be used on the frontend. |

# Properties Attributes

| **Attribute** | **Description** |
| --- | --- |
| `[Audited]`                                     | Identifies fields whose changes should be logged for easy tracking of when the change was made and the user responsible for that change. When used on the class level, all properties of that entity will be audited. See also [audit logging](/docs/fundamentals/audit-logging). |
| `[CascadeUpdateRules]`                          | Applies to properties that reference other entities to control whether create, update, and delete operations should cascade to the referenced entity. See [CascadeUpdateRules details](#cascadeupdaterules) below. |
| `[Description("Description of Property name")]` | Description of Class/Property Name. |
| `[Encrypt]`                                     | Identifies fields that should be persisted in the database as an encrypted string. |
| `[EntityDisplayName]`                           | Specifies the property that represents the entity's display name to users. If not explicitly defined, the framework defaults to using a property named 'Name,' if it exists. |
| `[InverseProperty("PropertyName")]`             | Specifies the name of the DB column on the other side of a one-to-many relationship. This is used to establish a link between two entities. For example, if you have a `Customer` entity with a collection of `Orders`, you would use this attribute on the `Orders` property to specify the `Customer` property on the `Order` entity, e.g., `[InverseProperty("CustomerId")]`. |
| `[NotMapped]`                                   | Identifies properties that Shesha should not attempt to map to the database for read or write purposes. This is typically used for properties calculated at the application level. |
| `[ReadonlyProperty]`                            | Identifies properties that Shesha should read from the database but not attempt to update. This is typically used for properties based on calculated columns at the database level. |
| `[ReferenceList("RefListName", optional moduleName)]` | Specifies the reference list that an `int` or `long` property is associated with. For more details, see [reference lists](/docs/back-end-basics/reference-lists). |
| `[Required]`                                    | Used to specify fields that are mandatory for the user to enter, usually denoted by \* on applications. |
| `[StringLength(maxLength)] / [StringLength(minLength, maxLength)]` | Used to specify a field length (in number of bytes required to store the string) that needs to be limited to a maximum length or both minimum and maximum lengths. Its default parameter is maxLength and is used by properties with the _string_ data type. |
| `[SaveAsJson]`                                  | Applies to properties that reference child objects and causes them to be saved in the database as a JSON string rather than as a regular entity. |

# Sample Domain Entity Class with Attributes

### Example

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Abp.Auditing;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Shesha.Domain.Attributes;

namespace Shesha.Domain
{
    [DiscriminatorValue("Shesha.Core.Address")]
    [Discriminator]
    [Entity(TypeShortAlias = "Shesha.Core.Address")]
    public class Address: FullAuditedEntity<Guid>
    {
        
        [ReferenceList("AddressType")]
        public virtual int? AddressType { get; set; }

        [StringLength(200)]
        [Audited]
        public virtual string AddressLine1 { get; set; }

        [StringLength(200)]
        public virtual string AddressLine2 { get; set; }

        [StringLength(100)]
        public virtual string Suburb { get; set; }

        [StringLength(100)]
        public virtual string Town { get; set; }

        [StringLength(10)]
        public virtual string POBox { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude should be in range (-90, 90)")]
        public virtual decimal? Latitude { get; set; }

        [Range(-90, 90, ErrorMessage = "Longitude should be in range (-90, 90)")]
        public virtual decimal? Longitude { get; set; }

        [EntityDisplayName]
        [ReadonlyProperty]
        public virtual string FullAddress { get; set; }

    }
}
```

## CascadeUpdateRules

The `[CascadeUpdateRules]` attribute controls how create, update, and delete operations cascade from a parent entity to a referenced child entity through Shesha's dynamic CRUD APIs. Without this attribute, updating a parent entity that references another entity will only update the reference (i.e., which entity is pointed to), but will **not** modify the properties of the referenced entity itself.

### Attribute Signature

```csharp
[CascadeUpdateRules(canCreate, canUpdate, deleteUnreferenced)]
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `canCreate` | `bool` | `false` | When `true`, allows creating a new child entity inline when the parent is created or updated via the CRUD API. |
| `canUpdate` | `bool` | `false` | When `true`, allows updating properties of the referenced child entity when the parent is updated via the CRUD API. |
| `deleteUnreferenced` | `bool` | `false` | When `true`, automatically deletes the child entity if the reference is removed **and** no other entities reference it. |

The attribute can be applied at either the **property level** or the **class level** (on the child entity type). When applied at the class level, it sets the default cascade behavior for all properties that reference that entity type. A property-level attribute takes precedence over a class-level attribute.

### Usage Examples

#### Allowing cascade updates only

In this example, when a `Person` is updated via the CRUD API, the properties of the associated `User` entity can also be updated in the same API call. However, creating a new `User` through the `Person` API is not permitted.

```csharp
public class Person : FullAuditedEntity<Guid>
{
    public virtual string FirstName { get; set; }

    public virtual string LastName { get; set; }

    // highlight-start
    [CascadeUpdateRules(canCreate: false, canUpdate: true)]
    public virtual User User { get; set; }
    // highlight-end
}
```

#### Allowing cascade create and update

In this example, the `PrimaryContact` can be both created and updated through the `Organisation` CRUD API. If no existing `Person` is referenced, a new one can be created inline.

```csharp
public class Organisation : FullAuditedEntity<Guid>
{
    public virtual string Name { get; set; }

    // highlight-start
    [CascadeUpdateRules(canCreate: true, canUpdate: true)]
    public virtual Person PrimaryContact { get; set; }
    // highlight-end
}
```

#### Enabling cascade delete of unreferenced children

When `deleteUnreferenced` is set to `true`, removing or changing the reference will automatically delete the previously referenced child entity — **but only if no other entities still reference it**. This prevents accidental data loss from shared references.

```csharp
public class Membership : FullAuditedEntity<Guid>
{
    public virtual string MemberNo { get; set; }

    // highlight-start
    [CascadeUpdateRules(canCreate: true, canUpdate: true, deleteUnreferenced: true)]
    public virtual MembershipCard Card { get; set; }
    // highlight-end
}
```

In this example, if `Card` is set to `null` or changed to a different `MembershipCard`, the previously referenced `MembershipCard` will be deleted **only if** no other entity in the system references it.

### How It Works at Runtime

When a CRUD API request is received:

1. **Create scenario** (`canCreate: true`): If the request body contains a nested object for the property (without an `id`), the framework creates a new child entity and populates its properties from the nested object.
2. **Update scenario** (`canUpdate: true`): If the request body contains a nested object with an `id` matching the currently referenced entity, the framework updates the referenced entity's properties from the nested object.
3. **Delete unreferenced scenario** (`deleteUnreferenced: true`): If the property value is set to `null` or changed to reference a different entity, the framework checks whether any other entities still reference the old child entity. If none do, the child entity is deleted. If other references exist, the child entity is preserved.

:::warning Validation errors
If a CRUD API request attempts to create or update a child entity but the corresponding cascade rule is not enabled, the framework will return a validation error indicating that the operation is not allowed.
:::

### Configuring Cascade Rules Without Code

Cascade rules can also be configured through the Shesha administration UI without modifying source code:

1. Navigate to **Administration > Entity Configurations**
2. Select the parent entity
3. Go to the **Properties** tab
4. Select the entity reference property
5. Configure the **Cascade Create**, **Cascade Update**, and **Cascade Delete Unreferenced** settings

Rules defined via the `[CascadeUpdateRules]` attribute in code take precedence over configuration-based rules. Configuration-based rules are applied only when the corresponding attribute value is not set.
