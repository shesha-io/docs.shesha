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
| `Person`                                | Represents a person in the application such as employee, customer, contact, etc... A Person is not necessarily a system user as this will depend on whether there is a corresponding `User` for Person. See also ([User management fundamentals](/docs/manage-apps-and-users/user-management)). |
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

:::info Shesha uses NHibernate as its ORM
Shesha currently uses NHibernate as its ORM rather than the more common EFCore. NHibernate is a mature ORM that has been around for many years and is used in many enterprise applications, however unlike EFCore, NHibernate does not have the ability to generate database migration classes automatically hence the need to create database migrations manually. Migrating Shesha to use **EFCore as its ORM is a priority feature on the roadmap and is planned Feb 2024**.
:::

To create a database migration class, simply create a new class that inherits from the `Migration` class. The example below illustrates the creation of a database migration class for the `Order` entity as part of `MyApp`.

```csharp
using System;
using FluentMigrator;
using Shesha.FluentMigrator;

namespace Shesha.Enterprise
{
    [Migration(20250114101300)]     // The migration number must be unique across all migrations in the application usually follows the following convention YYYYMMDDHHMMSS
    public class M20250114101300 : Migration
    {
        public override void Up()
        {
            Create.Table("MyApp_Orders")
             .WithIdAsGuid()
             .WithFullAuditColumns()   // Adds the standard columns required when the new entity inherits from FullAuditedEntity
             .WithColumn("OrderNo").AsString().Nullable()
             .WithColumn("DeliveryDate").AsDateTime().Nullable()
             .WithColumn("Comment").AsString().Nullable()
             .WithColumn("StatusLkp").AsInt64().Nullable();

             Alter.Table("MyApp_Orders").AddForeignKeyColumn("CustomerId", "core_Accounts").Nullable();    // Adds a foreign key

            Create.Table("MyApp_OrderLines")
             .WithIdAsGuid()
             .WithFullAuditColumns()   // Adds the standard columns required when the new entity inherits from FullAuditedEntity
             .WithColumn("Description").AsString(400).Nullable()
             .WithColumn("Product").AsString().Nullable()
             .WithColumn("Price").AsDecimal().Nullable()
             .WithColumn("Quantity").AsInt32().Nullable()
             .WithColumn("SubTotal").AsDecimal().Nullable();

             Alter.Table("MyApp_OrderLines").AddForeignKeyColumn("PartOfId", "MyApp_Orders").NotNullable();    // Adds a foreign key
             Alter.Table("MyApp_OrderLines").AddForeignKeyColumn("ProductId", "MyApp_Products").NotNullable();    // Adds a foreign key

        }

        public override void Down()
        {
            throw new NotImplementedException();
        }
    }
}
```

### Update an existing entity

To update an existing entity, you will need to create a new database migration class. The example below illustrates the addition of a new property to the `Organisation` entity.

```csharp
using System;
using FluentMigrator;
using Shesha.FluentMigrator;

[assembly: DefaultIntentManaged(Mode.Fully)]
[assembly: IntentTemplate("Boxfusion.Modules.FluentMigrator.Migration", Version = "1.0")]

namespace Shesha.Enterprise
{
    [Migration(20250114101302)]
    public class M20250114101302 : Migration
    {
        public override void Up()
        {
            if (!Schema.Table("Core_Organisations").Column("entpr_SupplierStatusLkp").Exists())
            {
                Alter.Table("Core_Organisations").AddColumn("entpr_SupplierStatusLkp").AsInt64().Nullable();
            }

			Alter.Table("entpr_PaymentOuts").AddForeignKeyColumn("BankTransactionId", "entpr_BankTransactions");
        }

        public override void Down()
        {
            throw new NotImplementedException();
        }
    }
}

```

## Custom Queries

You can also use the `Execute.Sql` method to execute custom SQL queries. This is useful for executing complex queries or for executing queries that are not supported by Fluent Migrator.

```csharp
using System;
using FluentMigrator;
using Intent.RoslynWeaver.Attributes;
using Shesha.FluentMigrator;

[assembly: DefaultIntentManaged(Mode.Fully)]
[assembly: IntentTemplate("Boxfusion.Modules.FluentMigrator.Migration", Version = "1.0")]

namespace Shesha.Enterprise
{
	[Migration(20250114101305), MsSqlOnly]
	public class M20250114101305 : Migration
	{
		public override void Up()
		{

			if (Schema.Table("entpr_Currencies").Exists())
				Execute.Sql(@"
                    -- YOUR SQL --
                ");
		}

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


### Entity to Database Table Mapping
For a new entity, Shesha will automatically creates a database table for the entity where the table name will be derived from the pluralized entity name prefixed it with the module database prefix. For example, if you create an entity called `Order`, Shesha will create a table called `MyApp_Orders` in the database, assuming the Database prefix specified is `MyApp`.

For an entity that inherits from an existing entity, no new table will be created. Instead, the entity will be mapped to the existing table of the base entity. For example, if you create an entity called `Employee` that inherits from `Person`, Shesha will map the `Employee` entity to the `Core_Persons` table in the database.

### Property to Database Column Mapping

Shesha will automatically create a database column for each property of the entity. The column name will be derived from the property name. For example, if you create a property called `OrderNo` on the `Order` entity, Shesha will create a column called `OrderNo` in the database.

If the property is a foreign key, Shesha will create a column with the same name as the property but suffixed with `Id`. For example, if you create a property called `Customer`, Shesha will create a column called `CustomerId` in the database.

If the property is a reference list, Shesha will create a column with the same name as the property but suffixed with `Lkp`. For example, if you create a property called `Status`, Shesha will create a column called `StatusLkp` in the database.

Note that in addition to the naming rules above, if the property is being added to an existing entity, Shesha will prefix the name of the column with the module database prefix. For example, if you create a property called `EmployeeNo` as part of an `Employee` entity which inherits from the existing `Person` entity, Shesha will create a column on the `Core_Persons` table called `MyApp_EmployeeNo` in the database. This helps identify any additions to the base entity and also helps avoid any naming conflicts with other modules that may also be extending the same base entity.
                                                             |

## Module Database Prefix

The Module Database Prefix helps clearly identify all objects within a database belonging to a specific module. This is especially important when a Shesha application is composed of many modules and it useful to have visibility of source of a database object.

For example, all Tables and Columns belonging to Shesha framework are prefixed with `Frwk_` or `Core_`. Similarly, all Tables and Columns added by your application could be prefixed with `MyApp_`, clearly identifying them at the database layer.

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

## Domain Repositories

### See Also:
[//]: # "TODO:GenericEntityReferences - Ignore for now as advanced feature"
[//]: # "TODO:Json Entities - Ignore for now as advanced feature"

- [Reference Lists](/docs/back-end-basics/reference-lists)
- [Domain Class Attributes](/docs/back-end-basics/domain-classes-attributes)


