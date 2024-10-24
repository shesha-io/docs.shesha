---
sidebar_label: Domain Model
sidebar_position: 1
---

# Domain Model

The heart of a Shesha application is the domain. The domain is the set of entities that represent the core business concepts of your application.

## The Base Domain Model

To accelerate the development of your application, Shesha provides a set of core domain entities that you can use as a starting point for your application. We refer to this as the base domain.
The base domain includes entities such as Person, Address, Organisation and Site which are recurrent in the vast majority of business applications and means you don't have to recreate them for every application.

| Entity                                  | Description                                                                                                                                                                                                                                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Account`                               | Represents a customer account, whether on behalf of a person or organisation.                                                                                                                                                                                                                  |
| `Address`                               | Represents an address.                                                                                                                                                                                                                                                                         |
| `Organisation`                          | Represents an organizational unit, organisation/company, team or similar.                                                                                                                                                                                                                      |
| `Person`                                | Represents a person in the application such as employee, customer, contact, etc... A Person is not necessarily a system user as this will depend on wether there is a corresponding `User` for Person. See also ([User management fundamentals](/docs/manage-apps-and-users/user-management)). |
| `Note`                                  | Represents a user note or comment. A list of notes may be associated with any parent entity. See also [notes fundamentals](/docs/fundamentals/notes).                                                                                                                                          |
| `ReferenceList` and `ReferenceListItem` | Represents a standard list of values. See also [reference lists](/docs/back-end-basics/reference-lists).                                                                                                                                                                                       |
| `Site`                                  | Represents a geographic location or physical structure such as location, area, buildings, room etc...                                                                                                                                                                                          |
| `StoredFile`                            | Represents a file stored in the system. See also [file storage fundamentals](/docs/fundamentals/file-storage).                                                                                                                                                                                 |

Though it is not a requirement to use the base domain, it is highly recommended to do so as it will accelerate the development of your application and you will be able to leverage other modules that also reference base entities.

## Extending the Domain Model

While the base domain entities are beneficial, you will likely need to customize them to fit your application's unique requirements. For instance, you might need to create a `Customer` entity derived from the `Person` entity, or a `Supplier` entity derived from the `Organisation` entity. You might also find it necessary to append additional properties to the base entities or introduce entirely new entities.

### Creating a new entity

To create a new entity, simply create a new class that inherits from the `Entity` class. The example below illustrates the creation of a `Ticket` entity.

#### Create the entity class

```csharp
public class Ticket : Entity<Guid>
{
    public virtual string Title { get; set; }

    public virtual string Description { get; set; }

    public virtual RefListTicketStatus Status { get; set; }

    public virtual Person LoggedBy { get; set; }

    public virtual Agent AssignedTo { get; set; }

    public virtual DateTime? ClosedOn { get; set; }

}

/// <summary>
/// Ticket status reference list
/// </summary>
[ReferenceList("MyOrg.TicketManagement", "TicketStatus")]   // The ReferenceList attribute is used to indicate that this enum is a reference list see [Reference Lists](/docs/back-end-basics/reference-lists) for more details.
public enum RefListTicketStatus : long
{
    [Description("Open")]
    Open = 1,

    [Description("Closed")]
    Closed = 2
}
```

:::tip Entity base classes
All entities should ultimately inherit from `Entity` class as per the example above. You may however also inherit from other pre-existing sub-classes of `Entity` depending of the level of auditing you require for your entity. For example, if you want to track the creation and modification of your entity you can inherit from `CreationAuditedEntity`. Inheriting from `AuditedEntity` will track modification timestamp and user, while inheriting from `FullAuditedEntity` will track deletion timestamp and user as well.
:::

:::tip Entity Ids
Although it is possible to create entities with any type of Id, it is recommended to use `Guid` Ids for all entities. This is because Shesha uses `Guid` Ids for all entities in the base domain and many other modules. Using `Guid` Ids will therefore ensure consistency across your application and make it easier to integrate with other modules.
:::

#### Add the database migration

To ensure that your new entity can be persisted to the database you will need to create the corresponding database objects. In order to do this you will need to create a database migration class. Shesha uses [Fluent Migrator](https://fluentmigrator.github.io/) for the creation of the database migrations with Shesha specific extensions.

:::info Shesha uses NHiberate as its ORM
Shesha currently uses NHibernate as its ORM rather than the more common EFCore. NHibernate is a mature ORM that has been around for many years and is used in many enterprise applications, however unlike EFCore, NHibernate does not have the ability to generate database migration classes automatically hence the need to create database migrations manually. Migrating Shesha to use **EFCore as its ORM is a priority feature on the roadmap and is planned Feb 2024**.
:::

To create a database migration class, simply create a new class that inherits from the `Migration` class. The example below illustrates the creation of a database migration class for the `Ticket` entity.

```csharp
using System;
using FluentMigrator;
using Shesha.FluentMigrator;

namespace Shesha.Enterprise
{
    [Migration(20240114101300)]     // The migration number must be unique across all migrations in the application usually follows the following convention YYYYMMDDHHMMSS
    public class M20220921101300 : Migration
    {
        public override void Up()
        {
            Create.Table("entpr_Orders")
             .WithIdAsGuid()
             .WithFullAuditColumns()
             .WithColumn("RequisitionNo").AsString().Nullable()
             .WithColumn("RefNo").AsString().Nullable()
             .WithColumn("RequestedCollectionDate").AsDateTime().Nullable()
             .WithColumn("ConfirmedCollectionDate").AsDateTime().Nullable()
             .WithColumn("Comment").AsString().Nullable()
             .WithColumn("StatusLkp").AsInt64().Nullable();

            Create.Table("entpr_Sequences")
             .WithIdAsGuid()
             .WithFullAuditColumns()
             .WithColumn("SequenceName").AsString().Nullable()
             .WithColumn("SeriesName").AsString().Nullable()
             .WithColumn("LastIssuedNumber").AsInt32()
             .WithColumn("LastIssuedDate").AsDateTime().Nullable();

            if (!Schema.Table("entpr_Services").Exists())
            Create.Table("entpr_Services")
             .WithIdAsGuid()
             .WithFullAuditColumns()
             .WithColumn("ServiceName").AsString().Nullable()
             .WithColumn("Description").AsString().Nullable()
             .WithColumn("Comments").AsString().Nullable()
             .WithColumn("TenantId").AsInt32().Nullable()
             .WithColumn("ServiceCategoryLkp").AsInt64().Nullable();

            if (!Schema.Table("entpr_SupplierPrices").Exists())
            Create.Table("entpr_SupplierPrices")
             .WithIdAsGuid()
             .WithColumn("Price").AsString().Nullable()
             .WithColumn("Name").AsString();

            if (!Schema.Table("Core_Organisations").Column("entpr_SupplierStatusLkp").Exists())
            {
                Alter.Table("Core_Organisations").AddColumn("entpr_SupplierStatusLkp").AsInt64().Nullable();
            }


			if (!Schema.Table("entpr_PaymentOuts").Column("BankTransactionId").Exists())
				Alter.Table("entpr_PaymentOuts").AddForeignKeyColumn("BankTransactionId", "entpr_BankTransactions");

                this.Shesha().ReferenceListCreate("Shesha.Enterprise", "TransactionStatuses")
                .AddItem(1, "Pending", 1)
                .AddItem(2, "Finalised", 2)
                .AddItem(3, "Reversed", 3);

            Alter.Table("entpr_PriceListProductPrices").AddForeignKeyColumn("PriceListId", "entpr_PriceLists");

        }


        /// <summary>
        ///
        /// </summary>
        public override void Down()
        {
            throw new NotImplementedException();
        }
    }
}
```

### Update an existing entity

```csharp
using System;
using FluentMigrator;
using Shesha.FluentMigrator;

[assembly: DefaultIntentManaged(Mode.Fully)]
[assembly: IntentTemplate("Boxfusion.Modules.FluentMigrator.Migration", Version = "1.0")]

namespace Shesha.Enterprise
{
    [Migration(20220921101300)]
    public class M20220921101300 : Migration
    {
        /// <summary>
        ///
        /// </summary>
        public override void Up()
        {
            if (!Schema.Table("Core_Organisations").Column("entpr_SupplierStatusLkp").Exists())
            {
                Alter.Table("Core_Organisations").AddColumn("entpr_SupplierStatusLkp").AsInt64().Nullable();
            }

			Alter.Table("entpr_PaymentOuts").AddForeignKeyColumn("BankTransactionId", "entpr_BankTransactions");

        }

        /// <summary>
        ///
        /// </summary>
        public override void Down()
        {
            throw new NotImplementedException();
        }
    }
}

```

## Custom Queries

```csharp
using System;
using FluentMigrator;
using Intent.RoslynWeaver.Attributes;
using Shesha.FluentMigrator;

[assembly: DefaultIntentManaged(Mode.Fully)]
[assembly: IntentTemplate("Boxfusion.Modules.FluentMigrator.Migration", Version = "1.0")]

namespace Shesha.Enterprise
{
	[Migration(20220921101200), MsSqlOnly]
	public class M20220921101200 : Migration
	{
		/// <summary>
		///
		/// </summary>
		public override void Up()
		{

			if (Schema.Table("entpr_Currencies").Exists())
				Execute.Sql(@"INSERT INTO [dbo].[VersionInfo]
           ([Version]
           ,[AppliedOn]
           ,[Description])
     VALUES
           (20220921101300
           ,DATEADD(HOUR, 2, GETUTCDATE())
           ,'M20220921101300')
GO");

		}

		/// <summary>
		///
		/// </summary>
		public override void Down()
		{
			throw new NotImplementedException();
		}
	}
}
```

the database schema from the domain model. Instead, the database schema is generated using database migrations which must be manually created.

## Database Object Naming Conventions

Shesha will attempt to map the domain model to the database objects by convention. It is therefore important to understand the naming conventions used by Shesha and reference table and column accordingly in your migrations.

Shesha automatically maps entities to database tables and properties by convention. The naming conventions used are as follows:

| Type of Mapping                        | Naming Convention                                            | Example                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Entity Class -> Table name             | `{EntityName}` -> `{Module Prefix}_{Pulrelizsed EntityName}` | `Person` entity class will map to `Core_Persons` table in the database where that the Framework module has table prefix of `Core` |
| Entity Property -> Column name         | `{PropertyName}` -> `{PropertyName}`                         | `Firstname` property will map to `Firstname` column in the database                                                               |
| Foreign Key Property -> Column name    | `{PropertyName}` -> `{PropertyName}Id`                       | `AddressId` property will map to `AddressId` column in the database                                                               |
| Reference List Property -> Column name | `{PropertyName}` -> `{PropertyName}Lkp`                      | `GenderLkp` property will map to `GenderLkp` column in the database                                                               |
| Inheritence Property -> Column name    | `{PropertyName}` -> `{module db prefix}_{PropertyName}`      | `ProvinceId` property will map to `ProvinceId` column in the database                                                             |

## Module Database Prefix

The Module Database Prefix helps clearly identify all objects within a database belonging to a specific module. This is especially important when a Shesha application is composed of many modules and it useful to have visibility of source of a database object.

For example, all Tables and Columns belonging to Shesha framework are prefixed with `Frwk_` or `Core_`. Similarly, all Tables and Columns added by your application could be prefixed with `MyApp_`, clearly identifying them at at the database layer.

The prefix is defaulted to `App_` in the default starter project but can be changed by editing or adding the following lines to the `AssemblyInfo.cs` file on the project within which the entity is defined.

```csharp title="/Properties/AssemblyInfo.cs"
...
// Shesha specific attributes
// highlight-start
// Specifying the prefix to use for database objects belonging to this project
[assembly: TablePrefix("MyApp_")]
// highlight-end
[assembly: BelongsToConfigurableModule("Shesha.Enterprise")]
...
```

# Mapping to the Table Structure

- Explaining table and column naming conventions
- Table naming - `{database prefix}_{entity name pluralised}` e.g Core_Persons
- Column naming
  - Ordinary column - `{property name as-is from entity}` e.g Firstname
  - Foreign key column - `{property name as-is from entity}{Id}` e.g AddressId
  - Reference list based column - `{property name as-is from entity}{Lkp}` e.g GenderLkp
  - Inheritence column - `{module db prefix}_{column name with the above conventions}` e.g Mem_ProvinceId, Mem_MembershipNo, Mem_MemberTypeLkp

* Table naming conventions
  - DB table prefix
  - Entity name pluralised
  - e.g Core_Persons

### Add a new property to an existing entity

- How to extend an existing entity
  - Add DB Migration
  - Add attributes (reference separate attributes page)
  - Explaining discriminators

### Supported Property Types

- Primitives
- Entities
- Reference Lists

[//]: # "TODO:GenericEntityReferences - Ignore for now as advanced feature"
[//]: # "TODO:Json Entities - Ignore for now as advanced feature"

## Domain Repositories

### See Also:

- [Reference Lists](/docs/back-end-basics/reference-lists)
- [Domain Class Attributes](/docs/back-end-basics/domain-classes-attributes)


