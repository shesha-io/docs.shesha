---
sidebar_label: Custom Configuration Items
sidebar_position: 8
title: Custom Configuration Items
---

# Custom Configuration Items

Configuration items are a core concept in the Shesha framework. They are configurable building blocks that an administrator can manage through the admin UI, export as JSON, and import into another environment. The framework ships with several built-in configuration item types such as Forms, Reference Lists, Settings, Notification Types, and Notification Channels.

Applications built on Shesha can define their own custom configuration item types. For example, a leave management module might define a "Leave Type Configuration" that administrators manage without code changes, or an approvals module might define an "Approval Configuration".

This guide walks through the full process of implementing a custom configuration item type on Shesha v0.45.

:::info What changed in v0.45
In v0.45 the configuration items engine was rebuilt around the new Configuration Studio. The base class is now `ConfigurationItem` (there is no `ConfigurationItemBase`), tables live in the `frwk` schema with snake_case names, and version history is tracked through separate **revision** records rather than the old Draft to Ready to Live status on each row. If you are migrating a custom type from an earlier version, read the Architecture and Revisions sections below before changing any code.
:::

---

## Overview

Implementing a custom configuration item involves the following steps:

1. **Define the domain entity** - Create a class that extends `ConfigurationItem`.
2. **Create a database migration** - Add a joined table for your custom properties.
3. **Implement a manager** (optional) - Handle duplication, exposing, and revision operations.
4. **Implement export and import** (optional) - Enable configuration portability across environments.
5. **Register in your module** - Wire up the manager, exporter, and importer through IoC.
6. **Create admin forms** - Build Shesha forms for managing instances through the UI.

Steps 3 to 5 are only required if you need custom duplication, exposing, or import and export support beyond what the base framework provides automatically.

### Project structure and file placement

Shesha modules are typically split into two projects: a **Domain** project for entities, reference lists, domain services, and migrations, and an **Application** project for application services and distribution (import and export). The following shows where each artifact should be placed:

```
YourModule.Domain/
├── Domain/
│   └── ApprovalConfigs/                       ← Feature folder
│       ├── ApprovalConfig.cs                  ← Step 1: Entity
│       └── RefListApprovalMode.cs             ← Related reference list enums
├── Migrations/
│   └── M20260101120000.cs                     ← Step 2: Database migration
└── YourDomainModule.cs                        ← Module class (domain)

YourModule.Application/
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

The key conventions are:

- **Domain entities** go in `Domain/<Feature>/` within the Domain project, grouped by feature area.
- **Reference list enums** are co-located with the entity that uses them.
- **Migrations** go in the `Migrations/` folder at the root of the Domain project.
- **Managers, exporters, and importers** go in the Application project because they typically depend on application-level services. They are grouped under a folder named after the configuration item type, with distribution classes in a `Distribution/` subfolder.
- **Distribution DTOs** go in a `Dto/` subfolder within `Distribution/`.

---

## Architecture

All configuration items in Shesha share a common base stored in the `frwk.configuration_items` table. This table uses a **Table-Per-Hierarchy (TPH)** discriminator column (`item_type`) to distinguish between the different types of configuration items. Each custom type then stores its additional properties in a separate **joined table** linked by a foreign key back to `frwk.configuration_items`.

```
┌─────────────────────────────┐
│   frwk.configuration_items  │  (shared base table)
│─────────────────────────────│
│ id (PK)                     │
│ item_type (discriminator)   │
│ name                        │
│ label                       │
│ description                 │
│ module_id                   │
│ application_id              │
│ folder_id                   │
│ origin_id                   │
│ latest_revision_id          │
│ exposed_from_id             │
│ surface_status_lkp          │
│ suppress                    │
│ ...audit columns...         │
└──────────────┬──────────────┘
               │ 1:1 (joined by id)
               │
┌──────────────┴──────────────┐
│  myapp_approval_configs     │  (your joined table)
│─────────────────────────────│
│ id (PK, FK)                 │
│ approval_levels             │
│ allow_auto_approval         │
│ ...                         │
└─────────────────────────────┘
```

The base `ConfigurationItem` class provides the following properties automatically:

| Property | Description |
|---|---|
| `ItemType` | The discriminator value identifying the type. Read-only, max 50 characters. |
| `Name` | Unique name within the module. Max 200 characters. |
| `Label` | User-friendly display name. |
| `Description` | Detailed description. |
| `Module` | The Shesha module this item belongs to. |
| `Application` | Optional front-end application scope. |
| `Folder` | Optional folder used to organise items in the Configuration Studio tree. |
| `Origin` | Points to the first version of the item. Set automatically by `Normalize()`. |
| `LatestRevision` | The most recent revision record. See the Revisions section below. |
| `SurfaceStatus` | Whether the item is `Visible` or `Overridden` when inherited from a base module. |
| `ExposedFrom` | The base-module item this one was exposed from, if any. |
| `Suppress` | Hide the item from configuration and end users. |

---

### Revisions

In v0.45 the version history of a configuration item is stored in separate **revision** records, not as a status column on the item row. Each `ConfigurationItem` has one row, and its change history is held in the `frwk.configuration_item_revisions` table.

A `ConfigurationItemRevision` stores a point-in-time snapshot of the item:

| Property | Description |
|---|---|
| `ConfigurationItem` | The item this revision belongs to. |
| `VersionNo` | Incrementing version number, starting at 1. |
| `VersionName` | Optional friendly alias for the version. |
| `ConfigurationJson` | The serialized configuration produced by the exporter. |
| `ConfigHash` | An MD5 hash of the JSON, used to detect whether anything changed. |
| `ParentRevision` | The previous revision this one was created from. |
| `CreatedByImport` | The import session that created the revision, if it came from an import. |
| `CreationMethod` | How the revision was created. See the table below. |

The `CreationMethod` uses the `ConfigurationItemRevisionCreationMethod` enum:

| Value | Meaning |
|---|---|
| `Manual` | Created by a user editing the item. |
| `ManualImport` | Created when the item was imported from a package manually. |
| `MigrationImport` | Created when the item was imported during a migration. |
| `ManualRestore` | Created when a user restored an earlier revision. |

The item's `LatestRevision` always points to the most recent snapshot. When you save changes, the framework decides whether to update the current revision or start a new one. A new revision is created when any of the following is true:

- there is no existing revision yet,
- the last change was made more than 15 minutes ago, or
- the change is made by a different user than the one who made the previous change.

:::note
Because revisions are managed by the framework, you rarely create them yourself. The base manager and the base importer call `MakeNewRevision(...)` and `SaveToRevisionAsync(...)` for you. You only interact with revisions directly if you build custom tooling around version history.
:::

---

### Exposing and module inheritance

v0.45 introduced module inheritance. A configuration item defined in a base module can be **exposed** into a downstream module, where it can then be overridden without changing the original.

When an item is exposed, the framework creates a copy in the target module and links it back to the source through `ExposedFrom` and `ExposedFromRevision`, setting `SurfaceStatus` to `Overridden`. At runtime the framework resolves the correct item to use by walking the module hierarchy.

The `RefListSurfaceStatus` values are:

| Value | Meaning |
|---|---|
| `Visible` | The item is visible but has not been overridden. |
| `Overridden` | The item overrides one inherited from a base module. |

This behaviour is provided by the base manager (`ExposeAsync`) and resolution helpers (`ResolveItemAsync`, `GetActualInheritanceOrNullAsync`). You do not need to implement it. The only thing you must do to support it correctly is copy your custom properties in `CopyItemPropertiesAsync`, which is covered in Step 3.

---

## Step 1: Define the Domain Entity

Create a class in your module's **Domain project** under the `Domain/<Feature>/` folder. The class must inherit from `ConfigurationItem` and apply a few key attributes:

- **`[DiscriminatorValue]`** - Sets the value stored in the `item_type` column to identify your type.
- **`[JoinedProperty]`** - Specifies the name of the joined table that stores your custom properties.
- **`[SnakeCaseNaming]`** - Maps property names to snake_case column names, matching the framework convention.
- **`[Prefix(UsePrefixes = false)]`** - Prevents Shesha from adding an entity-derived prefix to your column names, so the columns match your property names directly.

**File:** `YourModule.Domain/Domain/ApprovalConfigs/ApprovalConfig.cs`

```csharp
using Shesha.Domain;
using Shesha.Domain.Attributes;

namespace YourModule.Domain.ApprovalConfigs
{
    /// <summary>
    /// Configuration for approval workflow rules
    /// </summary>
    [Entity(
        FriendlyName = "Approval Configuration",
        TypeShortAlias = "YourModule.ApprovalConfig"
    )]
    [DiscriminatorValue(ItemTypeName)]
    [JoinedProperty("myapp_approval_configs")]
    [SnakeCaseNaming]
    [Prefix(UsePrefixes = false)]
    public class ApprovalConfig : ConfigurationItem
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
        /// Approval mode (reference list backed)
        /// </summary>
        [ReferenceList("ApprovalMode")]
        public virtual RefListApprovalMode? ApprovalMode { get; set; }
    }
}
```

### Key conventions

- **`ItemTypeName` constant and `ItemType` override.** The constant defines the discriminator value stored in the database. The `ItemType` property override returns it. Both are required. Use **kebab-case** for the value, for example `"approval-config"`, `"leave-type-config"`, or `"notification-channel"`. This value is stored in the `item_type` column and is also used as the folder name within exported `.shaconfig` packages.
- **`virtual` properties.** All properties must be declared `virtual` for NHibernate proxy support.
- **Reference list properties.** Use `[ReferenceList("ListName")]` for single-value and `[MultiValueReferenceList("ListName")]` for multi-value reference list properties.
- **Foreign key relationships.** You can reference other entities, including other configuration items, as navigation properties.
- **JSON properties.** To store a complex object or a list inline as JSON, apply `[SaveAsJson]` to the property. The framework serializes it into a single text column.

### Real-world example

The framework's own `NotificationChannelConfig` is a good model of a custom configuration item with reference list properties:

```csharp
[Entity(
    FriendlyName = "Notification Channel",
    TypeShortAlias = "Shesha.Domain.NotificationChannelConfig"
)]
[JoinedProperty("notification_channels", Schema = "frwk")]
[DiscriminatorValue(ItemTypeName)]
[SnakeCaseNaming]
[Prefix(UsePrefixes = false)]
public class NotificationChannelConfig : ConfigurationItem
{
    public const string ItemTypeName = "notification-channel";
    public override string ItemType => ItemTypeName;

    public virtual RefListNotificationMessageFormat? SupportedFormat { get; set; }
    public virtual int? MaxMessageSize { get; set; }

    [MultiValueReferenceList("ChannelSupportedMechanism")]
    public virtual RefListChannelSupportedMechanism? SupportedMechanism { get; set; }

    public virtual string SenderTypeName { get; set; } = string.Empty;
    public virtual RefListNotificationPriority? DefaultPriority { get; set; }
    public virtual RefListNotificationChannelStatus? Status { get; set; }
    public virtual bool SupportsAttachment { get; set; }
}
```

:::tip Storing complex data as JSON
The framework's `NotificationTypeConfig` stores a list of override channels with `[SaveAsJson]`:

```csharp
[SaveAsJson]
public virtual IList<ConfigurationItemIdentifierDto>? OverrideChannels { get; set; }
    = new List<ConfigurationItemIdentifierDto>();
```

This is the recommended way to persist a list or object without adding a separate table. The migration column for such a property is a `nvarchar(max)` text column.
:::

---

## Step 2: Create the Database Migration

Use FluentMigrator to create the joined table. The table must have an `id` column that serves as both the primary key and the foreign key back to `frwk.configuration_items`.

The framework's configuration item migrations extend `OneWayMigration`, which only requires an `Up()` method.

**File:** `YourModule.Domain/Migrations/M20260101120000.cs`

```csharp
using FluentMigrator;
using Shesha.FluentMigrator;

namespace YourModule.Domain.Migrations
{
    [Migration(20260101120000)]
    public class M20260101120000 : OneWayMigration
    {
        public override void Up()
        {
            // Create the joined table for your configuration item
            Create.Table("myapp_approval_configs")
                .WithIdAsGuid("id")
                .WithColumn("approval_levels").AsInt32().NotNullable().WithDefaultValue(1)
                .WithColumn("allow_auto_approval").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn("auto_approval_timeout_hours").AsInt32().Nullable()
                .WithColumn("approval_mode_lkp").AsInt64().Nullable();

            // Link the joined table to the base configuration_items table
            Create.ForeignKey("fk_myapp_approval_configs_ci_id")
                .FromTable("myapp_approval_configs")
                .ForeignColumn("id")
                .ToTable("configuration_items").InSchema("frwk")
                .PrimaryColumn("id");
        }
    }
}
```

### Column naming conventions

- Use **snake_case** for table and column names to match the framework convention enforced by `[SnakeCaseNaming]`.
- Reference list columns are suffixed with `_lkp` and stored as `AsInt64()`, for example `approval_mode_lkp`.
- Foreign key columns are suffixed with `_id`, for example `overflow_type_id`.
- Use `.WithIdAsGuid("id")` for the primary key. This is a Shesha FluentMigrator extension.
- Use `.AsStringMax()` for large text columns, including columns backing `[SaveAsJson]` properties.
- The foreign key to `frwk.configuration_items` is essential. It establishes the joined inheritance relationship.

:::note Where your joined table lives
The framework places its joined tables in the `frwk` schema, for example `[JoinedProperty("notification_channels", Schema = "frwk")]`. For a custom module you can leave your table in the default schema (as shown above) or put it in your own schema. Whichever you choose, the `[JoinedProperty]` attribute on the entity and the table created in the migration must match, and the foreign key must always point to `configuration_items` in the `frwk` schema.
:::

### Adding columns later

When you need to add new properties to your configuration item after the initial migration, create a new migration:

```csharp
[Migration(20260201120000)]
public class M20260201120000 : OneWayMigration
{
    public override void Up()
    {
        Alter.Table("myapp_approval_configs")
            .AddColumn("require_comments").AsBoolean().NotNullable()
            .SetExistingRowsTo(false).WithDefaultValue(false);
    }
}
```

---

## Step 3: Implement a Manager (Optional)

A configuration item manager handles operations such as duplicating an item, exposing it into another module, and copying custom property values. If you need these capabilities, create a manager by extending `ConfigurationItemManager<TItem>`.

The manager belongs in your **Application project** because it typically depends on application-level services and repositories.

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

Then implement it. The base `ConfigurationItemManager<TItem>` uses property injection for its dependencies, so the simplest manager needs no constructor at all. The one method you should override is `CopyItemPropertiesAsync`, which copies your custom properties whenever an item is duplicated or exposed.

**File:** `YourModule.Application/ApprovalConfigs/ApprovalConfigManager.cs`

```csharp
using Abp.Dependency;
using Shesha.ConfigurationItems;
using YourModule.Domain.ApprovalConfigs;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs
{
    public class ApprovalConfigManager
        : ConfigurationItemManager<ApprovalConfig>, IApprovalConfigManager, ITransientDependency
    {
        /// <summary>
        /// Copy custom properties from the source item to the destination.
        /// Called by the framework during Duplicate and Expose operations.
        /// </summary>
        protected override async Task CopyItemPropertiesAsync(
            ApprovalConfig source, ApprovalConfig destination)
        {
            // Always copy the base properties first
            await base.CopyItemPropertiesAsync(source, destination);

            // Copy your custom properties
            destination.ApprovalLevels = source.ApprovalLevels;
            destination.AllowAutoApproval = source.AllowAutoApproval;
            destination.AutoApprovalTimeoutHours = source.AutoApprovalTimeoutHours;
            destination.ApprovalMode = source.ApprovalMode;
        }
    }
}
```

If your manager needs extra dependencies for business logic, add a constructor that calls the parameterless base constructor and accepts your own repositories:

```csharp
public ApprovalConfigManager(IRepository<SomeRelatedEntity, Guid> relatedRepo) : base()
{
    _relatedRepo = relatedRepo;
}
```

The base `ConfigurationItemManager<TItem>` already provides:

- **`DuplicateAsync`** - Creates a copy of an item with an automatically generated unique name and calls `CopyItemPropertiesAsync`.
- **`ExposeAsync`** - Exposes an item into another module for inheritance and calls `CopyItemPropertiesAsync`.
- **`CreateItemAsync`** - Creates a new item from a `CreateItemInput`.
- **`SaveToRevisionAsync`** - Dumps the current state of an item into a revision.
- **`RestoreRevisionAsync`** - Restores an item from a previous revision.
- **`GetAsync`**, **`ResolveItemAsync`**, **`ItemExistsAsync`** - Lookup helpers.

You can also override `MapToDtoAsync`, `BeforeCreateAsync`, `AfterItemDuplicatedAsync`, and `AfterItemExposedAsync` when you need to customise those steps.

:::info About `Normalize()`
The `Normalize()` method on `ConfigurationItem` sets the `Origin` property to a self-reference if it is not already set. This is required for the first version of any configuration item, because `Origin` is how the framework groups everything that belongs to the same logical item together. The base manager and base importer call `Normalize()` for you, so you do not normally call it directly.
:::

---

## Step 4: Implement Export and Import (Optional)

To enable your configuration item to be exported as JSON and imported into other environments, you need three classes:

1. A **distribution DTO** - The serializable representation of your item.
2. An **exporter** - Converts the entity to the DTO.
3. An **importer** - Reads the DTO and creates or updates the entity.

All three go in the **Application project** under a `Distribution/` subfolder within your configuration item's folder.

### Distribution DTO

Create a class extending `DistributedConfigurableItemBase` that adds your custom properties:

**File:** `YourModule.Application/ApprovalConfigs/Distribution/Dto/DistributedApprovalConfig.cs`

```csharp
using Shesha.ConfigurationItems.Distribution;
using YourModule.Domain.ApprovalConfigs;

namespace YourModule.Application.ApprovalConfigs.Distribution.Dto
{
    /// <summary>
    /// Serializable representation of ApprovalConfig for export and import
    /// </summary>
    public class DistributedApprovalConfig : DistributedConfigurableItemBase
    {
        public int ApprovalLevels { get; set; }
        public bool AllowAutoApproval { get; set; }
        public int? AutoApprovalTimeoutHours { get; set; }
        public RefListApprovalMode? ApprovalMode { get; set; }
    }
}
```

The base `DistributedConfigurableItemBase` already includes `Id`, `OriginId`, `Name`, `Label`, `ItemType`, `Description`, `ModuleName`, `FrontEndApplication`, and `Suppress`, plus the package metadata fields `DateUpdated`, `BaseModules`, `Comments`, and `ConfigHash`.

:::note
The base distribution DTO no longer carries `VersionNo`, `VersionStatus`, `ParentVersionId`, or `BaseItem`. Version history travels with the package through revisions, not through fields on the item DTO.
:::

#### Handling references to other configuration items

When your configuration item has a property that references **another configuration item** (for example another custom config item, a notification type, or a form), the distribution DTO must use **Name and Module identifiers** instead of Guid IDs. The framework provides `ConfigurationItemIdentifierDto` (which holds a `Name` and a `Module`) for exactly this purpose:

```csharp
// CORRECT: portable across environments
public ConfigurationItemIdentifierDto? RelatedConfig { get; set; }

// WRONG: GUIDs differ between environments, making packages non-portable
// public Guid? RelatedConfigId { get; set; }
```

GUIDs are environment-specific. The same configuration item has different IDs in development, staging, and production databases. Name and Module pairs are stable identifiers that keep exported `.shaconfig` packages portable.

For references to **regular (non-configuration-item) entities**, use `Guid?` because those entities do not follow the Name and Module convention.

### Exporter

The exporter extends `ConfigurableItemExportBase<TItem, TDistributedItem>`. The base class fills in all the standard properties for you through `GetBaseDistributedItem`, so you only override `MapCustomPropsAsync` to copy your custom properties. The `Repository` is property-injected.

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
using Shesha.ConfigurationItems.Distribution;
using YourModule.Domain.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs.Distribution.Dto;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public class ApprovalConfigExport
        : ConfigurableItemExportBase<ApprovalConfig, DistributedApprovalConfig>,
          IApprovalConfigExport, ITransientDependency
    {
        public string ItemType => ApprovalConfig.ItemTypeName;

        protected override Task MapCustomPropsAsync(
            ApprovalConfig item, DistributedApprovalConfig result)
        {
            result.ApprovalLevels = item.ApprovalLevels;
            result.AllowAutoApproval = item.AllowAutoApproval;
            result.AutoApprovalTimeoutHours = item.AutoApprovalTimeoutHours;
            result.ApprovalMode = item.ApprovalMode;

            return Task.CompletedTask;
        }
    }
}
```

If you need to read related entities while exporting (the framework's `NotificationTypeExport` loads its templates this way), inject the relevant repository through the constructor and make `MapCustomPropsAsync` asynchronous.

### Importer

The importer extends `ConfigurationItemImportBase<TItem, TDistributedItem>`. The base class handles finding an existing item by name and module, creating a new item when needed, creating the revision, linking it to the import session, and calling `Normalize()`. You override three members:

- **`ItemType`** - Returns your discriminator value.
- **`MapCustomPropsToItemAsync`** - Copies your custom properties from the DTO onto the entity.
- **`CustomPropsAreEqualAsync`** - Compares custom properties so the framework can skip the import when nothing changed.

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
using Shesha.Domain;
using Shesha.Services.ConfigurationItems;
using YourModule.Domain.ApprovalConfigs;
using YourModule.Application.ApprovalConfigs.Distribution.Dto;
using System;
using System.Threading.Tasks;

namespace YourModule.Application.ApprovalConfigs.Distribution
{
    public class ApprovalConfigImport
        : ConfigurationItemImportBase<ApprovalConfig, DistributedApprovalConfig>,
          IApprovalConfigImport, ITransientDependency
    {
        public ApprovalConfigImport(
            IRepository<Module, Guid> moduleRepo,
            IRepository<FrontEndApp, Guid> frontEndAppRepo,
            IRepository<ApprovalConfig, Guid> repository
        ) : base(repository, moduleRepo, frontEndAppRepo)
        {
        }

        public override string ItemType => ApprovalConfig.ItemTypeName;

        protected override Task MapCustomPropsToItemAsync(
            ApprovalConfig item, DistributedApprovalConfig distributedItem)
        {
            item.ApprovalLevels = distributedItem.ApprovalLevels;
            item.AllowAutoApproval = distributedItem.AllowAutoApproval;
            item.AutoApprovalTimeoutHours = distributedItem.AutoApprovalTimeoutHours;
            item.ApprovalMode = distributedItem.ApprovalMode;

            return Task.CompletedTask;
        }

        protected override Task<bool> CustomPropsAreEqualAsync(
            ApprovalConfig item, DistributedApprovalConfig distributedItem)
        {
            var equals =
                item.ApprovalLevels == distributedItem.ApprovalLevels &&
                item.AllowAutoApproval == distributedItem.AllowAutoApproval &&
                item.AutoApprovalTimeoutHours == distributedItem.AutoApprovalTimeoutHours &&
                item.ApprovalMode == distributedItem.ApprovalMode;

            return Task.FromResult(equals);
        }
    }
}
```

:::warning Constructor argument order
The base constructor of `ConfigurationItemImportBase<TItem, TDistributedItem>` takes the item repository **first**, then the module repository, then the front-end app repository: `base(repository, moduleRepo, frontEndAppRepo)`. Passing them in the wrong order will not compile if the repository types differ, but it is an easy mistake to make when copying code, so check the order.
:::

The base importer also exposes optional hooks:

- **`AfterImportAsync`** - Override to import related entities after the main item is saved. The framework's `NotificationTypeImport` imports its templates here.
- **`CreateNew`** - Override to control how a new entity instance is constructed.
- **`SortItemsAsync`** - Override if your items have dependencies that require a specific import order.

The import is driven by an `IConfigurationItemsImportContext`, which exposes `CreateModules`, `CreateFrontEndApplications`, `ImportResult`, `RevisionCreationMethod`, and a `CancellationToken`. You normally do not read these yourself because the base class uses them, but they are available if you override the lower-level hooks.

### Exported package structure

When configuration items are exported, they are packaged into a `.shaconfig` zip file. Each item is stored as a JSON file organized by module and item type. Your `ItemTypeName` determines the folder name:

```
your-module-name/
  approval-config/                ← matches your ItemTypeName
    my-approval-workflow.json     ← one JSON file per item (named after the item's Name)
    manager-approval.json
```

This structure is handled automatically by the framework's package manager. You only need to implement the exporter and importer classes shown above.

---

## Step 5: Register in Your Module

In your **Application module's** `PreInitialize` method, register the manager, exporter, and importer using the IoC extension methods. Registration must happen in the Application module, not the Domain module, because the manager, exporter, and importer classes live in the Application project.

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

The methods register the components as transient and return `IIocManager`, so they can be chained fluently as shown above.

:::note
You only need to register the components you implemented. If you only implemented export and import (Step 4) but not a custom manager (Step 3), you can omit the `RegisterConfigurableItemManager` call. Conversely, if you only need a manager but not export and import, you can register just the manager.
:::

---

## Step 6: Create Admin Forms

Once the backend is in place, create Shesha forms that let administrators manage instances of your configuration item. Because custom configuration items are standard Shesha entities, you create forms with the Shesha Form Designer the same way you would for any other entity.

### What to create

Typically you will need:

1. **A table or list view** - Displays all instances of your configuration item. Configure it to use your entity type (for example `ApprovalConfig`) as the data source.
2. **A create form** - Lets administrators create new instances.
3. **A details or edit form** - Lets administrators view and update existing instances.

### Important fields to include

When designing your forms, the base `ConfigurationItem` properties are available alongside your custom properties. The following base fields are particularly important for configuration items:

| Field | Why it matters |
|---|---|
| `Name` | The unique identifier within a module. Required for import and export matching. |
| `Label` | The user-friendly display name shown in lists. |
| `Module` | Determines which module the item belongs to. Required for proper packaging. |
| `Description` | Helps administrators understand the purpose of this configuration. |
| `Folder` | Organises items within the Configuration Studio tree. |

For detailed guidance on building forms, refer to the [Form Components](/docs/front-end-basics/form-components/common-component-properties) documentation.

---

## What You Get Automatically

Once the above steps are complete, your custom configuration item benefits from:

- **CRUD API** - Shesha auto-generates REST endpoints for your entity through its dynamic API controllers.
- **Revision history** - Every change is captured as a revision in `frwk.configuration_item_revisions`, managed by the base infrastructure.
- **Module inheritance** - Items can be exposed from a base module into downstream modules and overridden there.
- **Module scoping** - Items are organized under Shesha modules and folders.
- **Audit trail** - Full audit columns (CreatedBy, CreationTime, LastModifiedBy, and so on) are inherited from the base class.
- **Multi-tenancy** - Tenant isolation is built into the base class.
- **Soft delete** - Items are soft-deleted by default.
- **Export and Import** - If you implemented Step 4, your items appear in the configuration export and import UI and can be packaged into `.shaconfig` files for migration across environments. Without Step 4, your items are not available for export or import.
- **Duplicate and Expose** - If you implemented Step 3, the framework's configuration API can duplicate your items and expose them into other modules.

---

## Summary

| Step | Required? | Project | What you create |
|---|---|---|---|
| 1. Domain entity | Yes | Domain | Class extending `ConfigurationItem` with `[DiscriminatorValue]`, `[JoinedProperty]`, `[SnakeCaseNaming]`, and `[Prefix(UsePrefixes = false)]` |
| 2. Database migration | Yes | Domain | `OneWayMigration` that creates the joined table with a foreign key to `frwk.configuration_items` |
| 3. Manager | Optional | Application | Interface and class extending `ConfigurationItemManager<T>`, overriding `CopyItemPropertiesAsync` |
| 4. Export and Import | Optional | Application | Distribution DTO, exporter extending `ConfigurableItemExportBase<T, TD>`, importer extending `ConfigurationItemImportBase<T, TD>` |
| 5. Module registration | If step 3 or 4 | Application | IoC registration calls in your Application module's `PreInitialize` |
| 6. Admin forms | Recommended | (configured through UI) | Shesha forms for list view, create, and edit |
