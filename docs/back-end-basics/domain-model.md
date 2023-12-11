---
sidebar_label: Domain Model
sidebar_position: 1
---

# Domain Model
The heart of a Shesha application is the domain. The domain is the set of entities that represent the core business concepts of your application. 

## The Base Domain Model
 To accelerate the development of your application, Shesha provides a set of core domain entities that you can use as a starting point for your application. We refer to this as the base domain.
 The base domain includes entities such as Person, Address, Organisation and Site which are recurrent in the vast majority of business applications.

| Entity | Description |
|--------|-------------|
| Person | Represents a person in the application. This may or may not represent a User in the system but this is expanded on in [User Management Fundamentals](/docs/fundamentals/user-management). |
| Address | Represents an address. |
| Organisation | Represents an organization unit, organisation/company, team or similar. |
| Site | Sites may be used to represent point locations, areas or buildings/structures or similar. It has a hierarchical structure so may represent |
| StoredFile | Represents a file stored in the system. More details on how to manage files are provided [file storage fundamentals](/docs/fundamentals/file-storage). |
| ReferenceList | Represents a standard reference list (sometimes also known as lookup lists). |
| ReferenceListItem | Represents an item in a reference list. |
| Account | Represents a customer account, whether on behalf of a person or organisation. |
| Note | Represents a note. |

Though it is not a requirement to use the base domain, it is highly recommended to do so as it will accelerate the development of your application and you will be able to leverage other modules that also assume you use those entities.


## Extend the Domain Model


### Create a new entity

- Standard base classes to inherit from
- 
FullAuditedEntity
        bool IsDeleted
        long? DeleterUserId
        DateTime? DeletionTime




### Add a new property to an existing entity

* How to extend an existing entity
  * Add DB Migration
  * Add attributes (reference separate attributes page)
  * Explaining discriminators


### Supported Property Types
  - Primitives
  - Entities
  - Reference Lists
[//]: # (- GenericEntityReferences - Ignore for now as advanced feature)
[//]: # (- Json Entities - Ignore for now as advanced feature)


## Domain Repositories


## Shesha ORM

Though there are plans to migrate Shesha to use EFCore, Shesha currently uses NHibernate as its ORM. NHibernate is a mature ORM that has been around for many years and is used in many enterprise applications. Unlike EFCore, NHibernate does not have the ability to generate database migration classes automatically. Any changes to the domain model must therefore be accompannied by a manually created database migration class to implement the necesary changes at the database level.

Shesha apps use [Fluent Migrator](https://fluentmigrator.github.io/) for the creation of the database migrations with Shesha specific extensions. 

## Adding a new entity

``` csharp
using System;
using FluentMigrator;
using Shesha.FluentMigrator;

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
            if (!Schema.Table("entpr_Orders").Exists())
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

``` csharp
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


                this.Shesha().ReferenceListCreate("Shesha.Enterprise", "TransactionStatuses")
                .AddItem(1, "Pending", 1)
                .AddItem(2, "Finalised", 2)
                .AddItem(3, "Reversed", 3);

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

``` csharp
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

| Type of Mapping | Naming Convention | Example |
|---|---|---|
| Entity Class -> Table name | `{EntityName}` -> `{Module Prefix}_{Pulrelizsed EntityName}` | `Person` entity class will map to `Core_Persons` table in the database where that the Framework module has table prefix of `Core` |
| Entity Property -> Column name | `{PropertyName}` -> `{PropertyName}` | `Firstname` property will map to `Firstname` column in the database |
| Foreign Key Property -> Column name | `{PropertyName}` -> `{PropertyName}Id` | `AddressId` property will map to `AddressId` column in the database |
| Reference List Property -> Column name | `{PropertyName}` -> `{PropertyName}Lkp` | `GenderLkp` property will map to `GenderLkp` column in the database |
| Inheritence Property -> Column name | `{PropertyName}` -> `{module db prefix}_{PropertyName}` | `ProvinceId` property will map to `ProvinceId` column in the database |


## Adding a property to an existing entity



## Module Database Prefix

The Module Database Prefix helps clearly identify all objects within a database belonging to a specific module. This is especially important when a Shesha application is composed of many modules and it useful to have visibility of source of a database object.

For example, all Tables and Columns belonging to Shesha framework are prefixed with `Frwk_` or `Core_`. Similarly, all  Tables and Columns added by your application could be prefixed with `MyApp_`, clearly identifying them at at the database layer.

The prefix is defaulted to `App_` in the default starter project but can be changed by editing or adding the following lines to the `AssemblyInfo.cs` file on the project within which the entity is defined.
``` csharp title="/Properties/AssemblyInfo.cs"
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
* Explaining table and column naming conventions
* Table naming - `{database prefix}_{entity name pluralised}` e.g Core_Persons
* Column naming
    * Ordinary column - `{property name as-is from entity}` e.g Firstname
    * Foreign key column - `{property name as-is from entity}{Id}` e.g AddressId
    * Reference list based column - `{property name as-is from entity}{Lkp}` e.g GenderLkp
    * Inheritence column - `{module db prefix}_{column name with the above conventions}` e.g  Mem_ProvinceId,  Mem_MembershipNo, Mem_MemberTypeLkp

- Table naming conventions
  * DB table prefix
  * Entity name pluralised
  * e.g Core_Persons