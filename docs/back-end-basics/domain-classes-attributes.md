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
| `[CascadeUpdateRules]`                          | Applies to properties that reference other entities to specify if updates and create actions should be cascaded to the referenced entity. |
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
