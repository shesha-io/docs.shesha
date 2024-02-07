---
sidebar_label: Domain Class Attributes
sidebar_position: 2
---

# Domain Attributes

# Entity Class Attributes

| **Attribute**                               | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[Audited]`                                 | When applied at the class level, all properties of that entity will be logged indicating when the change was made, the user responsible for that change as well as the original and new value(s). See also [audit logging](/docs/manage-apps-and-users/audit-logging).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `[Discriminator]`                           | This attribute should be applied to any entity that you would expect to inherit from so that a Discriminator column can be added at the database layer. By default Shesha uses a 'Table per Hierarchy' inheritance strategy. This means that all entity subclasses will be stored in the same table as the base class, and a discriminator column will be used to identify the type of entity being stored.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `[DiscriminatorValue("DiscriminatorName")]` | This attribute should only be applied to entities that inherit from another entity class. It specifies the value to be used as its discriminator when stored in the database. By default Shesha uses a 'Table per Hierarchy' inheritance strategy. This means that all entity subclasses will be stored in the same table as the base class, and a discriminator column will be used to identify the type of entity being stored. If this attribute is ommitted, Shesha will use the entity class' namespace and name e.g. `MyOrg.MyApp.`                                                                                                                                                                                                                                                                                                                                                                       |
| `[Entity]`                                  | Provides parameters to add additional metadata to the entity and control additional aspects of the beharior of the entity: <br/> **`GenerateApplicationService`** - Specifies whether CRUD APIs for this entity should be generated. See also [CRUD APIs](/docs/back-end-basics/crud-apis). <br/> **`ApplicationServiceName`** - The name of the application service to be generated for the entity. This will be reflected in the url of the dynamically generated CRUD API. If not specified, the name of the entity will be used. See also [CRUD APIs](/docs/back-end-basics/crud-apis). <br/> **`FriendlyName`** - A more user friendly name for the entity to be used in the UI. If not specified, the name of the entity will be used. <br/> **`TypeShortAlias`** - (For internal use) Alias sometimes used by the framework instead of the fully qualified type name to identify the type of the entity. |
|                                             |
| `[Table(“TableName”)]`                      | Specifies the database table that the entity data will be persisted to. If ommitted, the framework will assume the normal naming conventions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

# Properties Attributes

| **Attribute**                                                                                                                                                                                                                                                                              | **Description**                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[Audited]`                                                                                                                                                                                                                                                                                | When applied to a property, any changes to that property will be logged indicating when the change was made, the user responsible for that change as well as the original and new value(s). See also [audit logging](/docs/manage-apps-and-users/audit-logging). |
| Identifies fields whose changes should be logged for easy tracking of when the change was made and the user responsible for that change. When used on the class level, all properties of that entity will be audited. See also [audit logging](/docs/manage-apps-and-users/audit-logging). |
| `[CascadeUpdateRules]`                                                                                                                                                                                                                                                                     | Applies to properties that reference other entities in order to specify if updates and creates actions should be cascaded to the referenced entity.                                                                                                              |
| `[Description(“Description of Property name”)]`                                                                                                                                                                                                                                            | Description of Class/Property Name.                                                                                                                                                                                                                              |
| `[Encrypt]`                                                                                                                                                                                                                                                                                | Identifies fields which should be persisted in the database as an encrypted string.                                                                                                                                                                              |
| `[NotMapped]`                                                                                                                                                                                                                                                                              | Identifies properties which Shesha should not attempt to map to the database for read or write purposes. This is typically used for properties calculated at the application level.                                                                              |
| `[ReadonlyProperty]`                                                                                                                                                                                                                                                                       | Identifies properties which Shesha should read from the database, but not attempt to update. This is typically used for properties based calculated columns at the database level.                                                                               |
| `[ReferenceList(“ModuleName”, “RefListName”)]`                                                                                                                                                                                                                                             | Used to denote properties of referencelist data type. See also [reference lists](/docs/back-end-basics/reference-lists).                                                                                                                                         |
| `[Required]`                                                                                                                                                                                                                                                                               | Used to specify fields that are mandatory for the user to enter, usually denoted by \* on applications.                                                                                                                                                          |
| `[StringLength(maxLength)] / [StringLength(minLength, maxLength)`                                                                                                                                                                                                                          | Used to specify a field length(in number of bytes required to store the string) that needs to be limited to maximum length or both minimum and maximum lengths. Its default parameter is maxLength and is used by properties with the _string_ data type.        |
| `[SaveAsJson]`                                                                                                                                                                                                                                                                             | Applies to properties that reference child objects and causes them to be saved in the database as a Json string rather than as a regular entity.                                                                                                                 |

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
        [ReferenceList("Shesha.Core", "AddressType")]
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
