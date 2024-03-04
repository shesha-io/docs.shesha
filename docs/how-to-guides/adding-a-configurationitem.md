---
sidebar_label: Adding a ConfigurationItem
title: Adding a ConfigurationItem
---

**Step 1**

The entity(configuration item) must inherit from ConfigurationItemBase

**Step 2**

The entity must use class attributes, `[JoinedProperty("Test_DocumentTemplates")]` and `[DiscriminatorValue(ItemTypeName)]`

**Step 3**

Add `ItemTypeName` as a public property of type `const` and initialize it with a string name for the name of your entity which is "document-templates"  in the given example.

**Step 4**

Create a public property ItemType whose value is determined by the value of the ItemTypeName `public override string ItemType => ItemTypeName;`


Below is an example of how you would implement configuration items.

**1. Example - Entity**

```csharp
using Boxfusion.Projectmanagement.Domain.Enums;
using Shesha.Domain;
using Shesha.Domain.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Boxfusion.Projectmanagement.Domain.ProgressReports
{

    [DiscriminatorValue(ItemTypeName)]
    [JoinedProperty("Test_DocumentTemplates")]
    public class DocumentTemplate : ConfigurationItemBase
    {
       public const string ItemTypeName = "document-templates";
    
        public override string ItemType => ItemTypeName;

        [StringLength(200)]
        public virtual string Name { get; set; }
     
        [StringLength(2000)]
        public virtual string Description { get; set; }

        public virtual int BusDaysToComplete { get; set; }

        [StringLength(200)]
        public virtual string ReportingForm { get; set; }

        [StringLength(200)]
        public virtual string DetailsForm { get; set; }

        [ReferenceList("Boxfusion.Projectmanagement", "PeriodType")]
        public virtual RefListPeriodType? ReportingCycle { get; set; }
    }
}
```

**2. Example - Migration**

```csharp
using FluentMigrator;
using Shesha.FluentMigrator;
namespace Boxfusion.Projectmanagement.Domain.Migrations
{
    [Migration(20240213101500)]
    public class M20240213101500 : OneWayMigration
    {
        public override void Up()
        {
            Create.Table("Test_DocumentTemplates")
                .WithIdAsGuid()
                .WithColumn("PM_Name").AsString(200).Nullable()
                .WithColumn("PM_Description").AsString(2000).Nullable()
                .WithColumn("PM_BusDaysToComplete").AsInt32().Nullable()
                .WithColumn("PM_ReportingForm").AsString(200).Nullable()
                .WithColumn("PM_DetailsForm").AsString(200).Nullable()
                .WithColumn("PM_ReportingCycleLkp").AsBoolean().Nullable();

          Create.ForeignKey("FK_Test_DocumentTemplates_Frwk_ConfigurationItems_Id")
                .FromTable("Test_DocumentTemplates")
                .ForeignColumn("Id")
                .ToTable("Frwk_ConfigurationItems")
                .PrimaryColumn("Id");
        }
    }
}

```

### See Also:

-[Configuration](/docs/fundamentals/configuration)