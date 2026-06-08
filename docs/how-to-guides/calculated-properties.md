---
sidebar_label: Calculated Properties
title: Calculated Properties
---

# Calculated Properties

A **calculated property** is a property whose value is derived from other data rather than stored as a column in the database. There are two main ways to implement one in a Shesha application: do the calculation **in the entity** (in C#) or do it **in the database** (with a computed column). The right choice depends on how much data the calculation needs and where that data lives.

This guide explains both approaches, when to pick each one, and what to watch out for.

---

## Properties Calculated in the Entity

When the calculation is straightforward and only depends on the entity's own state, the simplest approach is to put it directly into the C# property's `get` accessor. The property is decorated with `[NotMapped]` so NHibernate does not try to persist it.

**Example - Compute whether a person is under-age from their stored Age:**

```cs
public int Age { get; set; }

/// <summary>
/// True when the person is under the legal age (18).
/// </summary>
[NotMapped]
public bool IsUnderAge
{
    get
    {
        return Age < 18;
    }
}
```

Two things to watch out for:

1. Add the `[NotMapped]` attribute so the property is not mapped to a database column.
2. The setter (if any) should be `protected`, so callers cannot accidentally assign a value to a property that should always be derived.

:::tip
This approach is best when the calculation is cheap and only depends on values already loaded on the entity. As soon as the calculation needs to count or aggregate rows from related tables, prefer the database approach below.
:::

---

## Properties Calculated in the Database

When the calculation depends on data that is expensive (or impossible) to load through NHibernate - typically because it aggregates over related rows - move the calculation into the database as a **computed column**. See this [overview of computed columns](https://database.guide/create-a-computed-column-that-uses-data-from-another-table-in-sql-server/) for the underlying SQL concept.

This approach has clear advantages:

- **Performance** - the database calculates the value as part of the query, so you do not have to round-trip rows to the application.
- **Single source of truth** - the rule is defined once, in the database, and applied everywhere.
- **Reusable in reports** - reporting tools that query the database directly see the same value.

It also has trade-offs:

- The value is calculated by the database, so the in-memory entity can become stale after edits. You may need to re-query to see the latest value.
- It places logic in the database, which makes it harder to port the application to a different database platform later.

:::warning Computed columns can be slow on writes
Every insert or update to the underlying tables forces the column to be recalculated. Test write performance on representative volumes - especially when the function aggregates over a large child table.
:::

### Step 1 - Declare the Property as Read-Only

 1. On the entity, declare the property and mark it with `[ReadonlyProperty]` attribute 
 1.  Make the setter `protected` so callers cannot try to assign to it.

**Example - A RemainingCapacity property backed by a calculated column:**

```cs
/// <summary>
/// Remaining capacity. Calculated column = Capacity minus the sum of all Active appointments.
/// </summary>
[ReadonlyProperty]
public virtual int? RemainingCapacity { get; protected set; }
```

### Step 2 - Add the Calculated Column With a Migration

Create a FluentMigrator migration that:

1. Defines a SQL function performing the calculation.
2. Adds a calculated column to the table that uses the function.

**Example - Migration that adds a RemainingCapacity computed column to Fhir_Slots:**

```cs
[Migration(20220303180801)]
public class M20220303180801 : Migration
{
    public override void Up()
    {
        Execute.Sql(@"
            CREATE FUNCTION [dbo].[fn_Book_GetNumValidAppointmentsForSlot] (@SlotId uniqueidentifier)
                RETURNS int
            AS
            BEGIN
                DECLARE @AppointmentCount int;

                SELECT @AppointmentCount = COUNT(Id)
                FROM Fhir_Appointments app
                WHERE app.SlotId = @SlotId
                  AND app.StatusLkp NOT IN (6 /* cancelled */, 8 /* enteredInError */);

                RETURN @AppointmentCount;
            END;
            GO

            ALTER TABLE Fhir_Slots
                ADD RemainingCapacity AS Capacity - dbo.fn_Book_GetNumValidAppointmentsForSlot(Id);
            GO
        ");
    }

    public override void Down()
    {
        throw new NotImplementedException();
    }
}
```

After the migration runs:

- `RemainingCapacity` is a real column on `Fhir_Slots`, calculated on the fly by SQL Server.
- The C# entity reads it like any other property - except that writes are rejected by the `[ReadonlyProperty]` attribute.

:::note Database portability
The example uses T-SQL syntax. If you need to support PostgreSQL as well, write the equivalent migration for that database too.
:::
