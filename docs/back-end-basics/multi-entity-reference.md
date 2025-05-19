# Multi Entity Reference (Many-to-Many Reference)

Multi Entity Reference allows an entity to maintain references to multiple related entities simultaneously, as opposed to a single entity reference. Currently, this implementation is supported on both [AutoComplete](../front-end-basics/form-components/Advanced/autocomplete.md) and [Entity Picker](../front-end-basics/form-components/data-entry/entity-picker.md).

### When to use this Feature?

If an Entity has a list property of entities

```cs
public virtual IList<Employees> Employees { get; set; }
```

Then you can map this property to the database using the `[ManyToMany]` attribute.

### How to use

The attribute has several constructors that allow you to configure mapping and auto generation of tables

```cs
public ManyToManyAttribute(string table, string childColumn, string keyColumn)
public ManyToManyAttribute(string table, string childColumn, string keyColumn, bool autoGeneration)
public ManyToManyAttribute(string table, string childColumn, bool autoGeneration)
public ManyToManyAttribute(string table, bool autoGeneration)
public ManyToManyAttribute(bool autoGeneration)
```

- **table** -  This defines the name of the link that will be used for references.
- **childColumn** - This defines the name of the column that wil reference the child entity table.
- **keyColumn** - This defines the name of the column that will reference the parent entity table.
- **autoGeneration** - This indicates the table will be generated automatically based on the names defined in the attribute, or automatically generated names will be used if defined.

### Example

You have organizations and employees. Multiple employees can be linked to an organization, just as employees can be linked to multiple organizations. In this case, you will have the following classes;

```cs
public class Employee : Entity
{
    public string FullName { get; set; }
}

public class Organisation : Entity
{
    public string Name { get; set; }

    public IList<Employee> Employees { get; set; } = new List<Employee>();
}
```

To maintain this relationship, you can create a table in the database;

```sql
CREATE TABLE OrganisationEmployeeRef (
    OrganisationId int NOT NULL,
    EmployeeId int NOT NULL
);

ALTER TABLE OrganisationEmployeeRef WITH CHECK ADD CONSTRAINT [FK_OrganisationEmployeeRef_OrganisationId_Organisation_Id]
FOREIGN KEY(OrganisationId) REFERENCES Organisations (Id);

ALTER TABLE OrganisationEmployeeRef WITH CHECK ADD CONSTRAINT [FK_OrganisationEmployeeRef_EmployeeId_Employee_Id]
FOREIGN KEY(EmployeeId) REFERENCES Employees (Id);
```

And for this table, you should use;

```cs
[ManyToMany("OrganisationEmployeesRef", "EmployeeId", "OrganisationId")]
public virtual IList<Employees> Employees { get; set; }
```

If you don't want to create the table manually, you can use the `autoGeneration` parameter of `ManyToMany` attribute:

```cs
[ManyToMany("OrganisationEmployeeRef", "EmployeeId", "OrganisationId", true)]
public virtual IList<Employees> Employees { get; set; }
```

In this case, the table from the above example will be created automatically when starting the Shesha application. All automatically generated tables are created in the `auto_gen` schema by default.

Also, when using the `autoGeneration` parameter, you don't have to specify all or some of the  names for the table. In this case, the names  of the table and/or columns will be generated automatically.

The simplest way is to specify:

```cs
[ManyToMany(true)]
public virtual IList<Employees> Employees { get; set; }
```

and a table will be automatically created in the database:

```sql
CREATE TABLE auto_gen.module_prefix_organisation_employees_ref (
    organisation_id int NOT NULL,
    employee_id int NOT NULL
);
```

**Entity History Audit**

To save changes of this property in the audit trail, you can use the attributes:

```cs
[Audited]
// or
[AuditedAsManyToMany]
[ManyToMany(true)]
public virtual IList<Employees> Employees { get; set; }
```

- Audited - Saves changes only for the parent entity.

Example for organization ***Main office***


| EventName           | Description                                              |
| ------------------- | -------------------------------------------------------- |
| *Employees* updated | *Employees* updated. Added: John Doe. Removed: Jane Doe. |

- **AuditedAsManyToMany** - saves changes for the parent entity and for  child entities.

Example:
In addition to the organization's events for each  employee will also added:


| EventName                  | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| *John Doe* added to...     | *John Doe* added to *Employees* of ***Main office***     |
| *Jane Doe* removed from... | *Jane Doe* removed from *Employees* of ***Main office*** |
