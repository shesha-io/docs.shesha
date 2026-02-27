---
sidebar_label: Custom Configuration Items
sidebar_position: 8
---

# Custom Configuration Items

Configuration items are a core concept in the Shesha framework. They represent configurable building blocks that can be managed through the admin UI, exported as JSON, and imported across environments. The framework ships with several built-in configuration item types such as Forms, Reference Lists, Notification Types, and Notification Channels.

Applications built on Shesha can define their own custom configuration item types. For example, a leave management module might define a "Leave Type Configuration" that administrators can manage without code changes, or a performance management module might define a "Performance Management Process Configuration".

This guide walks through the full process of implementing a custom configuration item type.

## Overview

Implementing a custom configuration item involves the following steps:

1. **Define the domain entity** - Create a class that extends `ConfigurationItemBase`
2. **Create a database migration** - Add a joined table for your custom properties
3. **Implement a manager** (optional) - Handle versioning and lifecycle operations
4. **Implement export/import** (optional) - Enable configuration portability across environments
5. **Register in your module** - Wire up the manager, exporter, and importer via IoC
6. **Create admin forms** - Build Shesha forms for managing instances via the UI

Steps 3-5 are only required if you need custom versioning, copy, or import/export support beyond what the base framework provides automatically.

### Project structure and file placement

Shesha modules are typically split into two projects: a **Domain** project for entities, reference lists, domain services, and migrations, and an **Application** project for application services, distribution (import/export), and configuration migrations. The following shows where each artifact should be placed:

```
YourModule.Domain/
├── Domain/
│   └── ApprovalConfigs/                       ← Feature folder
│       ├── ApprovalConfig.cs                  ← Step 1: Entity
│       └── RefListApprovalStatus.cs           ← Related reference list enums
├── Migrations/
│   └── M20260101120000.cs                     ← Step 2: Database migration
└── YourDomainModule.cs                        ← Module class (domain)

YourModule.Application/
├── Services/
│   └── ApprovalConfigs/
│       └── ApprovalConfigAppService.cs        ← Custom app service (if needed)
├── ApprovalConfigs/
│   ├── IApprovalConfigManager.cs              ← Step 3: Manager interface
│   ├── ApprovalConfigManager.cs               ← Step 3: Manager implementation
│   └── Distribution/
│       ├── Dto/
│       │   └── DistributedApprovalConfig.cs   ← Step 4: Distribution DTO
│       ├── IApprovalConfigExport.cs           ← Step 4: Exporter interface
│       ├── ApprovalConfigExport.cs            ← Step 4: Exporter implementation
│       ├── IApprovalConfigImport.cs           ← Step 4: Importer interface
│       └── ApprovalConfigImport.cs            ← Step 4: Importer implementation
└── YourApplicationModule.cs                   ← Step 5: IoC registration
```

**Key conventions:**
- **Domain entities** go in `Domain/<Feature>/` within the Domain project, grouped by feature area.
- **Reference list enums** (e.g., `RefListApprovalStatus.cs`) are co-located with the entity that uses them.
- **Migrations** go in the `Migrations/` folder at the root of the Domain project.
- **Managers, exporters, and importers** go in the Application project because they typically depend on application-level services. They are grouped under a folder named after the configuration item type, with distribution classes in a `Distribution/` subfolder.
- **Distribution DTOs** go in a `Dto/` subfolder within `Distribution/`.

## Architecture

All configuration items in Shesha share a common base stored in the `Frwk_ConfigurationItems` table. This table uses a **Table-Per-Hierarchy (TPH)** discriminator column (`ItemType`) to distinguish between different types of configuration items. Each custom type then stores its additional properties in a separate **joined table** linked by a foreign key back to `Frwk_ConfigurationItems`.

```
┌─────────────────────────────┐
│   Frwk_ConfigurationItems   │  (shared base table)
│─────────────────────────────│
│ Id (PK)                     │
│ ItemType (discriminator)    │
│ Name                        │
│ Label                       │
│ Description                 │
│ ModuleId                    │
│ VersionNo                   │
│ VersionStatus               │
│ OriginId                    │
│ IsLast                      │
│ ...audit columns...         │
└──────────────┬──────────────┘
               │ 1:1 (joined by Id)
               │
┌──────────────┴──────────────┐
│  YourModule_YourConfigs     │  (your joined table)
│─────────────────────────────│
│ Id (PK, FK)                 │
│ YourModule_CustomProp1      │
│ YourModule_CustomProp2      │
│ ...                         │
└─────────────────────────────┘
```

The base `ConfigurationItem` class provides the following properties automatically:

| Property | Description |
|---|---|
| `Name` | Unique name within the module (max 200 chars) |
| `Label` | User-friendly display name |
| `Description` | Detailed description |
| `Module` | The Shesha module this item belongs to |
| `VersionNo` | Version number |
| `VersionStatus` | Draft, Ready, Live, Cancelled, or Retired |
| `Origin` | Points to the first version (shared across all versions of the same item) |
| `ParentVersion` | The previous version this was created from |
| `IsLast` | Whether this is the latest version |
| `Suppress` | Hide from end-users |
| `Application` | Optional front-end application scope |

### Version status lifecycle

Configuration items follow a defined version status lifecycle:

```
Draft ───→ Ready ───→ Live ───→ Retired
  │                    ↑
  └────────────────────┘   (direct promotion)

Ready ───→ Cancelled   (if rejected before going Live)
```

- **Draft** - Work in progress. Can be promoted to Ready or directly to Live.
- **Ready** - Complete and awaiting approval. Can be promoted to Live or Cancelled.
- **Live** - The currently active version. When a new version goes Live, the previous Live version is automatically **Retired**.
- **Retired** - A previously Live version that has been superseded.
- **Cancelled** - A Ready version that was rejected.

## Step 1: Define the Domain Entity

Create a class in your module's **Domain project** under the `Domain/<Feature>/` folder. The class must inherit from `ConfigurationItemBase` and apply two key attributes:

- **`[DiscriminatorValue]`** - Sets the value stored in the `ItemType` column to identify your type
- **`[JoinedProperty]`** - Specifies the name of the joined table that stores your custom properties

**File:** `YourModule.Domain/Domain/ApprovalConfigs/ApprovalConfig.cs`

```csharp
using Shesha.Domain;
using Shesha.Domain.Attributes;
using System.ComponentModel.DataAnnotations;

namespace YourModule.Domain.ApprovalConfigs
{
    /// <summary>
    /// Configuration for approval workflow rules
    /// </summary>
    [DiscriminatorValue(ItemTypeName)]
    [JoinedProperty("YourModule_ApprovalConfigs")]
    public class ApprovalConfig : ConfigurationItemBase
    {
        /// <summary>
        /// Discriminator value for this configuration item type
        /// </summary>
        public const string ItemTypeName = "approval-config";

        /// <summary>
        /// Returns the item type name (required override)
        /// </summary>
        public override string ItemType => ItemTypeName;

        // --- Your custom properties below ---

        /// <summary>
        /// Number of approval levels required
        /// </summary>
        public virtual int ApprovalLevels { get; set; }

        /// <summary>
        /// Whether to auto-approve after a timeout period
        /// </summary>
        public virtual bool AllowAutoApproval { get; set; }

        /// <summary>
        /// Timeout in hours before auto-approval triggers
        /// </summary>
        public virtual int? AutoApprovalTimeoutHours { get; set; }

        /// <summary>
        /// Custom message shown to approvers
        /// </summary>
        [StringLength(2000)]
        public virtual string ApproverInstructions { get; set; }
    }
}
```

### Key conventions

- **`ItemTypeName` constant and `ItemType` override**: The constant defines the discriminator value stored in the database. The `ItemType` property override returns it. Both are required. Use **kebab-case** for the value (e.g., `"approval-config"`, `"leave-type-configs"`, `"notification-channel"`). This value is stored in the `ItemType` column in the database and is also used as the folder name within exported `.shaconfig` packages.
- **`virtual` properties**: All properties must be declared `virtual` for NHibernate proxy support.
- **`[StringLength]`**: Use `[StringLength(n)]` for bounded strings or `[StringLength(int.MaxValue)]` for large text fields.
- **Reference list properties**: Use `[ReferenceList("ListName")]` for single-value and `[MultiValueReferenceList("ListName")]` for multi-value reference list properties.
- **Foreign key relationships**: You can reference other entities (including other configuration items) as navigation properties.

### Real-world example

Here is a simplified version of `LeaveTypeConfig` from a leave management module, demonstrating common property patterns:

```csharp
[DiscriminatorValue(ItemTypeName)]
[JoinedProperty("Leave_LeaveTypeConfigs")]
public class LeaveTypeConfig : ConfigurationItemBase
{
    public const string ItemTypeName = "leave-type-configs";
    public override string ItemType => ItemTypeName;

    // Simple properties
    public virtual bool AllowBackDating { get; set; }
    public virtual int? NumBackDatingDays { get; set; }
    public virtual int? MaxConsecutiveDaysAllowed { get; set; }
    public virtual bool AllowNegativeBalance { get; set; }

    // Bounded string
    [StringLength(2000)]
    public virtual string PolicyInfo { get; set; }

    // Reference list property
    [ReferenceList("TypeOfDays")]
    public virtual RefListTypeOfDays? TypeOfDays { get; set; }

    // Reference list (cycle duration)
    [ReferenceList("CycleDurationType")]
    public virtual RefListCycleDurationType? CycleDurationType { get; set; }

    // Foreign key to another config item
    public virtual LeaveTypeConfig OverflowLeaveType { get; set; }

    // Flexible extension data
    [StringLength(int.MaxValue)]
    public virtual JsonEntity ExtensionJson { get; set; }

    // Reference to a form configuration
    [StringLength(400)]
    public virtual FormConfiguration ApplyForm { get; set; }
}
```

### Using `JsonEntity` for extensibility

If your configuration item may need additional properties in the future without schema changes, add a `JsonEntity ExtensionJson` property. This stores arbitrary JSON data in a single column and can be populated through dynamic forms on the front-end.

```csharp
[StringLength(int.MaxValue)]
public virtual JsonEntity ExtensionJson { get; set; }
```

## Step 2: Create the Database Migration

Use FluentMigrator to create the joined table. The table must have an `Id` column that serves as both primary key and foreign key to `Frwk_ConfigurationItems`.

**File:** `YourModule.Domain/Migrations/M20260101120000.cs`

```csharp
using FluentMigrator;
using Shesha.FluentMigrator;

namespace YourModule.Domain.Migrations
{
    [Migration(20260101120000)]
    public class M20260101120000 : Migration
    {
        public override void Up()
        {
            // Create the joined table for your configuration item
            Create.Table("YourModule_ApprovalConfigs")
                .WithIdAsGuid()
                .WithColumn("YourModule_ApprovalLevels").AsInt32().WithDefaultValue(1)
                .WithColumn("YourModule_AllowAutoApproval").AsBoolean().WithDefaultValue(false)
                .WithColumn("YourModule_AutoApprovalTimeoutHours").AsInt32().Nullable()
                .WithColumn("YourModule_ApproverInstructions").AsString(2000).Nullable();

            // Create the foreign key linking to the base ConfigurationItems table
            Create.ForeignKey("FK_YourModule_ApprovalConfigs_Frwk_ConfigurationItems_Id")
                .FromTable("YourModule_ApprovalConfigs")
                .ForeignColumn("Id")
                .ToTable("Frwk_ConfigurationItems")
                .PrimaryColumn("Id");
        }

        public override void Down()
        {
            throw new NotImplementedException();
        }
    }
}
```

### Column naming conventions

- Prefix custom columns with your module prefix (e.g., `YourModule_PropertyName`) to avoid naming collisions.
- Reference list columns should be suffixed with `Lkp` (e.g., `YourModule_StatusLkp`).
- Foreign key columns should be suffixed with `Id` (e.g., `YourModule_OverflowTypeId`).
- Use `.WithIdAsGuid()` for the primary key - this is a Shesha FluentMigrator extension.
- The foreign key to `Frwk_ConfigurationItems` is essential - it establishes the joined inheritance relationship.

### Adding columns later

When you need to add new properties to your configuration item after the initial migration, create a new migration:

```csharp
[Migration(20260201120000)]
public class M20260201120000 : Migration
{
    public override void Up()
    {
        Alter.Table("YourModule_ApprovalConfigs")
            .AddColumn("YourModule_RequireComments").AsBoolean().WithDefaultValue(false);
    }

    public override void Down()
    {
        throw new NotImplementedException();
    }
}
```

## Step 3: Implement a Manager (Optional)

A configuration item manager handles lifecycle operations such as version status transitions, copying, creating new versions, and deletion. If you need these capabilities, create a manager by extending `ConfigurationItemManager<TItem>`.

The manager should be placed in your **Application project** since it typically depends on application-level services and repositories.

First, define the interface:

**File:** `YourModule.Application/ApprovalConfigs/IApprovalConfigManager.cs`

```csharp
using Shesha.ConfigurationItems;
using YourModule.Domain.ApprovalConfigs;

namespace YourModule.Application.ApprovalConfigs
{
    public interface IApprovalConfigManager : IConfigurationItemManager<ApprovalConfig>
    {
    }
}
```

Then implement it:

**File:** `YourModule.Application/ApprovalConfigs/ApprovalConfigManager.cs`

```csharp
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Shesha.ConfigurationItems;
using Shesha.ConfigurationItems.Models;
using Shesha.Domain.ConfigurationItems;
using Shesha.Dto.Interfaces;
using YourModule.Domain.ApprovalConfigs;
using System;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs
{
    public class ApprovalConfigManager
        : ConfigurationItemManager<ApprovalConfig>, IApprovalConfigManager
    {
        public ApprovalConfigManager(
            IRepository<ApprovalConfig, Guid> repository,
            IRepository<Module, Guid> moduleRepository,
            IUnitOfWorkManager unitOfWorkManager
        ) : base(repository, moduleRepository, unitOfWorkManager)
        {
        }

        public override async Task<ApprovalConfig> CopyAsync(
            ApprovalConfig item,
            CopyItemInput input)
        {
            var newItem = new ApprovalConfig
            {
                // Copy base properties
                Name = input.Name,
                Module = item.Module,
                Label = input.Label,
                Description = input.Description,
                VersionNo = 1,
                VersionStatus = ConfigurationItemVersionStatus.Draft,

                // Copy custom properties
                ApprovalLevels = item.ApprovalLevels,
                AllowAutoApproval = item.AllowAutoApproval,
                AutoApprovalTimeoutHours = item.AutoApprovalTimeoutHours,
                ApproverInstructions = item.ApproverInstructions,
            };

            // Normalize() sets the Origin property to self-reference,
            // which is required for the first version of a configuration item.
            newItem.Normalize();
            await Repository.InsertAsync(newItem);
            return newItem;
        }

        public override async Task<ApprovalConfig> CreateNewVersionAsync(
            ApprovalConfig item)
        {
            var newVersion = new ApprovalConfig
            {
                // Base versioning properties
                Origin = item.Origin,
                Name = item.Name,
                Module = item.Module,
                Label = item.Label,
                Description = item.Description,
                VersionNo = item.VersionNo + 1,
                ParentVersion = item,
                VersionStatus = ConfigurationItemVersionStatus.Draft,

                // Copy custom properties
                ApprovalLevels = item.ApprovalLevels,
                AllowAutoApproval = item.AllowAutoApproval,
                AutoApprovalTimeoutHours = item.AutoApprovalTimeoutHours,
                ApproverInstructions = item.ApproverInstructions,
            };

            await Repository.InsertAsync(newVersion);
            return newVersion;
        }

        public override Task<IConfigurationItemDto> MapToDtoAsync(
            ApprovalConfig item)
        {
            // Return a DTO representation if needed for custom API responses.
            // For basic scenarios, you can return null.
            return Task.FromResult<IConfigurationItemDto>(null);
        }
    }
}
```

The base `ConfigurationItemManager<TItem>` already provides:

- **`UpdateStatusAsync`** - Handles version status transitions with validation (Draft -> Ready -> Live) and automatically retires previous Live versions.
- **`CancelVersionAsync`** - Marks a Ready version as Cancelled.
- **`MoveToModuleAsync`** - Moves all versions of an item to a different module.
- **`DeleteAllVersionsAsync`** - Soft-deletes all versions of the item.

:::info About `Normalize()`
The `Normalize()` method sets the `Origin` property to a self-reference if it is not already set. This is required for the first version of any configuration item, because `Origin` is how the framework groups all versions of the same logical item together. Always call `Normalize()` when creating the first version of a new item (in `CopyAsync` and in importers). When creating subsequent versions (in `CreateNewVersionAsync`), set `Origin = item.Origin` instead.
:::

## Step 4: Implement Export and Import (Optional)

To enable your configuration item to be exported as JSON and imported into other environments, you need three classes:

1. A **distribution DTO** - The serializable representation of your item
2. An **exporter** - Converts from entity to DTO and writes JSON
3. An **importer** - Reads JSON and creates/updates entities

All three go in the **Application project** under a `Distribution/` subfolder within your configuration item's folder.

### Distribution DTO

Create a class extending `DistributedConfigurableItemBase` that includes your custom properties:

**File:** `YourModule.Application/ApprovalConfigs/Distribution/Dto/DistributedApprovalConfig.cs`

```csharp
using Shesha.ConfigurationItems.Distribution;

namespace YourModule.Application.ApprovalConfigs.Distribution.Dto
{
    /// <summary>
    /// Serializable representation of ApprovalConfig for export/import
    /// </summary>
    public class DistributedApprovalConfig : DistributedConfigurableItemBase
    {
        public int ApprovalLevels { get; set; }
        public bool AllowAutoApproval { get; set; }
        public int? AutoApprovalTimeoutHours { get; set; }
        public string ApproverInstructions { get; set; }
    }
}
```

The base `DistributedConfigurableItemBase` already includes: `Id`, `OriginId`, `Name`, `Label`, `ItemType`, `Description`, `ModuleName`, `FrontEndApplication`, `VersionNo`, `VersionStatus`, `ParentVersionId`, `Suppress`, and `BaseItem`.

### Exporter

Define the interface and implementation:

**File:** `YourModule.Application/ApprovalConfigs/Distribution/IApprovalConfigExport.cs`

```csharp
using Shesha.ConfigurationItems.Distribution;
using YourModule.Domain.ApprovalConfigs;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public interface IApprovalConfigExport : IConfigurableItemExport<ApprovalConfig>
    {
    }
}
```

**File:** `YourModule.Application/ApprovalConfigs/Distribution/ApprovalConfigExport.cs`

```csharp
using Abp.Dependency;
using Abp.Domain.Repositories;
using Newtonsoft.Json;
using Shesha.ConfigurationItems.Distribution;
using Shesha.Domain;
using YourModule.Domain.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs.Distribution.Dto;
using System;
using System.IO;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public class ApprovalConfigExport : IApprovalConfigExport, ITransientDependency
    {
        private readonly IRepository<ApprovalConfig, Guid> _repository;

        public ApprovalConfigExport(IRepository<ApprovalConfig, Guid> repository)
        {
            _repository = repository;
        }

        public string ItemType => ApprovalConfig.ItemTypeName;

        public async Task<DistributedConfigurableItemBase> ExportItemAsync(Guid id)
        {
            var item = await _repository.GetAsync(id);
            return await ExportItemAsync(item);
        }

        public Task<DistributedConfigurableItemBase> ExportItemAsync(
            ConfigurationItemBase item)
        {
            if (item is not ApprovalConfig config)
                throw new ArgumentException(
                    $"Expected {nameof(ApprovalConfig)}, got {item.GetType().FullName}");

            var result = new DistributedApprovalConfig
            {
                // Base properties
                Id = config.Id,
                Name = config.Name,
                ModuleName = config.Module?.Name,
                FrontEndApplication = config.Application?.AppKey,
                ItemType = config.ItemType,
                Label = config.Label,
                Description = config.Description,
                OriginId = config.Origin?.Id,
                BaseItem = config.BaseItem?.Id,
                VersionNo = config.VersionNo,
                VersionStatus = config.VersionStatus,
                ParentVersionId = config.ParentVersion?.Id,
                Suppress = config.Suppress,

                // Custom properties
                ApprovalLevels = config.ApprovalLevels,
                AllowAutoApproval = config.AllowAutoApproval,
                AutoApprovalTimeoutHours = config.AutoApprovalTimeoutHours,
                ApproverInstructions = config.ApproverInstructions,
            };

            return Task.FromResult<DistributedConfigurableItemBase>(result);
        }

        public async Task WriteToJsonAsync(
            DistributedConfigurableItemBase item, Stream jsonStream)
        {
            var json = JsonConvert.SerializeObject(item, Formatting.Indented);
            using var writer = new StreamWriter(jsonStream);
            await writer.WriteAsync(json);
        }
    }
}
```

### Importer

**File:** `YourModule.Application/ApprovalConfigs/Distribution/IApprovalConfigImport.cs`

```csharp
using Shesha.ConfigurationItems.Distribution;
using YourModule.Domain.ApprovalConfigs;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public interface IApprovalConfigImport : IConfigurableItemImport<ApprovalConfig>
    {
    }
}
```

**File:** `YourModule.Application/ApprovalConfigs/Distribution/ApprovalConfigImport.cs`

```csharp
using Abp.Dependency;
using Abp.Domain.Repositories;
using Newtonsoft.Json;
using Shesha.ConfigurationItems.Distribution;
using Shesha.Domain;
using Shesha.Domain.ConfigurationItems;
using Shesha.Services.ConfigurationItems;
using YourModule.Domain.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs.Distribution.Dto;
using System;
using System.IO;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public class ApprovalConfigImport : ConfigurationItemImportBase,
        IApprovalConfigImport, ITransientDependency
    {
        private readonly IRepository<ApprovalConfig, Guid> _repository;

        public ApprovalConfigImport(
            IRepository<Module, Guid> moduleRepo,
            IRepository<FrontEndApp, Guid> frontEndAppRepo,
            IRepository<ApprovalConfig, Guid> repository
        ) : base(moduleRepo, frontEndAppRepo)
        {
            _repository = repository;
        }

        public string ItemType => ApprovalConfig.ItemTypeName;

        public async Task<ConfigurationItemBase> ImportItemAsync(
            DistributedConfigurableItemBase item,
            IConfigurationItemsImportContext context)
        {
            if (item is not DistributedApprovalConfig distributed)
                throw new NotSupportedException(
                    $"Expected {nameof(DistributedApprovalConfig)}, " +
                    $"got {item.GetType().FullName}");

            var statusToImport = context.ImportStatusAs ?? item.VersionStatus;

            // Check if the item already exists (match by name + module)
            var dbItem = await _repository.FirstOrDefaultAsync(x =>
                x.Name == item.Name
                && (x.Module == null && item.ModuleName == null
                    || x.Module != null && x.Module.Name == item.ModuleName)
                && x.IsLast);

            if (dbItem != null)
            {
                // Update existing item
                await MapPropertiesAsync(distributed, dbItem, context);
                await _repository.UpdateAsync(dbItem);
            }
            else
            {
                // Create new item
                dbItem = new ApprovalConfig();
                await MapPropertiesAsync(distributed, dbItem, context);

                dbItem.VersionNo = 1;
                dbItem.Module = await GetModuleAsync(item.ModuleName, context);
                dbItem.VersionStatus = statusToImport;
                dbItem.CreatedByImport = context.ImportResult;

                // Normalize() sets Origin to self-reference for the first version
                dbItem.Normalize();
                await _repository.InsertAsync(dbItem);
            }

            return dbItem;
        }

        private async Task MapPropertiesAsync(
            DistributedApprovalConfig source,
            ApprovalConfig target,
            IConfigurationItemsImportContext context)
        {
            // Base properties
            target.Name = source.Name;
            target.Module = await GetModuleAsync(source.ModuleName, context);
            target.Application = await GetFrontEndAppAsync(
                source.FrontEndApplication, context);
            target.Label = source.Label;
            target.Description = source.Description;
            target.VersionNo = source.VersionNo;
            target.VersionStatus = source.VersionStatus;
            target.Suppress = source.Suppress;

            // Custom properties
            target.ApprovalLevels = source.ApprovalLevels;
            target.AllowAutoApproval = source.AllowAutoApproval;
            target.AutoApprovalTimeoutHours = source.AutoApprovalTimeoutHours;
            target.ApproverInstructions = source.ApproverInstructions;
        }

        public async Task<DistributedConfigurableItemBase> ReadFromJsonAsync(
            Stream jsonStream)
        {
            using var reader = new StreamReader(jsonStream);
            var json = await reader.ReadToEndAsync();

            var result = JsonConvert.DeserializeObject<DistributedApprovalConfig>(json)
                ?? throw new Exception(
                    $"Failed to deserialize {nameof(ApprovalConfig)} from JSON");

            return result;
        }
    }
}
```

The base class `ConfigurationItemImportBase` provides helper methods:
- **`GetModuleAsync`** - Resolves a module by name, optionally creating it if missing.
- **`GetFrontEndAppAsync`** - Resolves a front-end application by app key.
- **`SortItemsAsync`** - Override if your items have dependencies that require a specific import order.

### Exported package structure

When configuration items are exported, they are packaged into a `.shaconfig` zip file. Each item is stored as a JSON file organized by module and item type. Your `ItemTypeName` determines the folder name:

```
your-module-name/
  approval-config/                ← matches your ItemTypeName
    my-approval-workflow.json     ← one JSON file per item (named after the item's Name)
    manager-approval.json
```

This structure is handled automatically by the framework's `ConfigurationPackageManager` - you only need to implement the exporter and importer classes shown above.

## Step 5: Register in Your Module

In your **Application module's** `PreInitialize` method, register the manager, exporter, and importer using the IoC extension methods. Registration must happen in the Application module (not the Domain module) because the manager, exporter, and importer classes live in the Application project.

**File:** `YourModule.Application/YourApplicationModule.cs`

```csharp
using Abp.Modules;
using Shesha;
using Shesha.ConfigurationItems;
using YourModule.Domain.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs.Distribution;

namespace YourModule.Application
{
    [DependsOn(typeof(SheshaCoreModule), typeof(SheshaApplicationModule))]
    public class YourApplicationModule : SheshaModule
    {
        public override void PreInitialize()
        {
            // Register configuration item manager
            IocManager
                .RegisterConfigurableItemManager<ApprovalConfig,
                    IApprovalConfigManager, ApprovalConfigManager>()

            // Register export support
                .RegisterConfigurableItemExport<ApprovalConfig,
                    IApprovalConfigExport, ApprovalConfigExport>()

            // Register import support
                .RegisterConfigurableItemImport<ApprovalConfig,
                    IApprovalConfigImport, ApprovalConfigImport>();
        }
    }
}
```

Each registration method follows the pattern:
```
Register...<TEntity, TInterface, TImplementation>()
```

The methods return `IIocManager`, so they can be chained fluently as shown above.

:::note
You only need to register the components you implemented. If you only implemented export/import (Step 4) but not a custom manager (Step 3), you can omit the `RegisterConfigurableItemManager` call. Conversely, if you only need versioning but not export/import, you can register just the manager.
:::

## Step 6: Create Admin Forms

Once the backend is in place, create Shesha forms that allow administrators to manage instances of your configuration item. Since custom configuration items are standard Shesha entities, you create forms using the Shesha Form Designer the same way you would for any other entity.

### What to create

Typically you will need:

1. **A table/list view** - Displays all instances of your configuration item. Configure it to use your entity type (e.g., `ApprovalConfig`) as the data source. Consider filtering by `IsLast = true` to show only the latest version of each item.
2. **A create form** - Allows administrators to create new instances.
3. **A details/edit form** - Allows administrators to view and update existing instances.

### Important fields to include

When designing your forms, the base `ConfigurationItemBase` properties are available alongside your custom properties. The following base fields are particularly important for configuration items:

| Field | Why it matters |
|---|---|
| `Name` | The unique identifier within a module. Required for import/export matching. |
| `Label` | The user-friendly display name shown in lists. |
| `Module` | Determines which module the item belongs to. Required for proper packaging. |
| `Description` | Helps administrators understand the purpose of this configuration. |
| `VersionStatus` | Shows the current lifecycle state (Draft, Ready, Live, etc.). |

For detailed guidance on building forms, refer to the [Form Components](/docs/front-end-basics/form-components/common-component-properties) documentation.

## What You Get Automatically

Once the above steps are complete, your custom configuration item benefits from:

- **CRUD API** - Shesha auto-generates REST endpoints for your entity (via dynamic API controllers).
- **Versioning** - Built-in version status lifecycle (Draft -> Ready -> Live -> Retired) managed through the base `ConfigurationItem` infrastructure.
- **Module scoping** - Items are organized under Shesha modules.
- **Audit trail** - Full audit columns (CreatedBy, CreationTime, LastModifiedBy, etc.) are inherited from the base class.
- **Multi-tenancy** - Tenant isolation is built into the base class.
- **Soft delete** - Items are soft-deleted by default.
- **Export/Import** - If you implemented Step 4 (exporter and importer), your items will appear in the configuration export/import UI and can be packaged into `.shaconfig` files for migration across environments. Without Step 4, your items will not be available for export/import.
- **Version management** - If you implemented Step 3 (manager), operations like copy, create new version, move to module, and cancel version will be available through the framework's `ConfigurationItemAppService` API.

## Summary

| Step | Required? | Project | What you create |
|---|---|---|---|
| 1. Domain entity | Yes | Domain | Class extending `ConfigurationItemBase` with `[DiscriminatorValue]` and `[JoinedProperty]` |
| 2. Database migration | Yes | Domain | FluentMigrator migration creating the joined table with FK to `Frwk_ConfigurationItems` |
| 3. Manager | Optional | Application | Interface and class extending `ConfigurationItemManager<T>` for versioning and lifecycle |
| 4. Export/Import | Optional | Application | Distribution DTO, exporter, and importer classes |
| 5. Module registration | If step 3 or 4 | Application | IoC registration calls in your Application module's `PreInitialize` |
| 6. Admin forms | Recommended | (configured via UI) | Shesha forms for list view, create, and edit |
