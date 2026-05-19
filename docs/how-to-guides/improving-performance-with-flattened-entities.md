---
sidebar_label: Improving table view performance with flattened entities
---

# Improving Table View Performance with Flattened Entities

Table Views in Shesha sometimes slow down when each row needs data pulled from several related tables. This happens because the ORM fetches the main record first, then makes one extra database call for every related record it needs to display. A flattened entity solves this by mapping a single entity onto a database view that already joins all of the required data together, so the table can load everything in one database call.

The naming convention for a flattened entity is `Flattened{entity name}`, for example `FlattenedCustomer`.

:::info What is the N+1 problem?
The "N+1 selects" problem describes the situation where loading one main record (the +1) triggers one additional database query for each related record it links to (the N). With many rows on a table view, this multiplies into hundreds of small queries. You can read more about it on <a href="https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping" target="_blank">Stack Overflow</a>.
:::

:::warning Flattened entities are read-only
Because flattened entities map onto database views rather than tables, they cannot be used for create or update operations. For those operations, use the original "unflattened" version of the entity.
:::

---

## How to Implement

The implementation has three steps. Each step is described below.

| Step | What you do |
|---|---|
| `Step 1` | Create a database view that joins in all related data |
| `Step 2` | Create a flattened entity class that maps onto the view |
| `Step 3` | Bind the table view to the flattened entity |

---

### Step 1 - Create a Database View

Create a database view that joins in the related tables so the result set contains every column the table view needs to display. Wrap the view definition in a FluentMigrator migration class so it can be deployed consistently to every environment.

The recommended naming convention for the view is `vw_{Module DB Prefix}_Flattened{Entity name plural}`, for example `vw_His_FlattenedAppointments`.

**Example - Migration that creates a flattened appointments view:**

```cs
[Migration(20220306151900)]
public class M20220306151900 : Migration
{
    public override void Up()
    {
        Execute.Sql(@"
            CREATE OR ALTER VIEW [dbo].[vw_His_FlattenedAppointments]
            AS
                SELECT
                      appointment.Id                                                                              /* HINT: Always return the Id of the main entity */
                    , appointment.RefNumber
                    , appointment.[StartTime]
                    , appointment.[EndTime]
                    , appointment.StatusLkp
                    , dbo.Frwk_GetRefListItem('Booking', 'AppointmentStatus', appointment.StatusLkp) [StatusText]  /* HINT: Use Frwk_GetRefListItem to translate Reference List values. Suffix the column with 'Text' */
                    , patient.Id PatientId                                                                        /* HINT: Return the Id of every joined entity */
                    , patient.[FullName] PatientFullName
                    , patient.[IdentityNumber] PatientIdentityNumber
                    , patient.[Fhir_PermitNumber] PatientPermitNumber
                FROM
                    Fhir_Appointments appointment
                    LEFT JOIN Core_Persons patient ON patient.Id = appointment.PatientId                          /* HINT: Join in every table needed to remove the N+1 effect */
                WHERE
                    patient.Frwk_Discriminator = 'His.HisPatient'
                    AND patient.IsDeleted = 0                                                                     /* HINT: Always exclude soft-deleted records */
        ");
    }

    public override void Down()
    {
        throw new NotImplementedException();
    }
}
```

:::tip Use Frwk_GetRefListItem for reference list labels
`Frwk_GetRefListItem` is a built-in SQL function that returns the display text for a reference list value. Use it whenever a column stores a reference list integer so the table view can show the human-readable label without an extra lookup.
:::

---

### Step 2 - Create a Flattened Entity Class

Create a new entity class that maps onto the view created in Step 1. The class lives in the Domain layer alongside the other entity classes.

Follow these rules:

- Name the class `Flattened{normal entity name}`, for example `FlattenedAppointment`.
- Decorate the class with `[Table("...")]` pointing at the view name.
- Decorate the class with `[ImMutable]` so the ORM does not attempt to write back to the view.
- Make every property setter `protected` so the entity stays read-only from application code.

**Example - Flattened entity that maps onto vw_His_FlattenedAppointments:**

```cs
[Table("vw_His_FlattenedAppointments")]
[ImMutable]
public class FlattenedAppointment : Entity<Guid>
{
    public virtual string RefNumber { get; protected set; }

    public virtual DateTime StartTime { get; protected set; }

    public virtual DateTime EndTime { get; protected set; }

    [ReferenceList("AppointmentStatus")]
    public virtual long? Status { get; protected set; }

    public virtual string StatusText { get; protected set; }

    public virtual Guid PatientId { get; protected set; }

    public virtual string PatientFullName { get; protected set; }

    public virtual string PatientIdentityNumber { get; protected set; }

    public virtual string PatientPermitNumber { get; protected set; }
}
```

:::note ReferenceList attribute
The single-parameter form `[ReferenceList("AppointmentStatus")]` is the current API. The two-parameter form that accepts a namespace separately is marked obsolete.
:::

---

### Step 3 - Consume the Flattened Entity

Once the entity is in place, bind to it from a Table View in the same way as any other entity. The table view will now load all of its data through a single database call against the view, instead of one call per related record.

:::warning Read-only by design
Flattened entities are intended for display only. Do not wire them up to Create Forms or Edit Forms. For create and update operations, bind those forms to the original "unflattened" entity.
:::
