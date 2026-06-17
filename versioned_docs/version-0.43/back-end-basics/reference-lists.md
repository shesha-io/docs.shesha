---
sidebar_label: Reference Lists (List of Values)
sidebar_position: 3
---

# Reference Lists (List of Values)

A Reference List (sometimes referred to as Lookup values, or List of Values) refers to a standard list of values usually displayed to end-users as dropdown lists (e.g. **Titles**: Mr, Mrs, Miss, etc...; **Gender**: Male, Female; **Colour**: Red,Blue, etc...).

If an Entity's property is expected to only accept a standard list of values, a Reference List should be used. 

For efficiency and maintainability reasons, properties that store a selection from a Reference List, will store the selected item as an integer, rather than the text value of the items selected. That is why a Reference List Entity properties are usually either of type `enum` or `long`.

## Choosing between Code-based (enum) and Data-based Reference Lists
Reference Lists can be implemented in two ways: as **Code-based (enum)** or **Data-based**. The choice between these two approaches depends on the expected stability of the values in the reference list and how they will be used within the application.
### Key Considerations:
- Only implement a Reference List as an enum (i.e. Code-based), if values are not expected to change, for example, 'Days Of The Week' or 'Gender', or if business logic within the application is expected to reference the reference list/enum.
- In all other cases, the reference list should be implemented as a Data-based reference list to allow the user to update the values more easily through administration interface.
- Database migration classes and logic should not be added for enum / code-based reference lists as these are handled automatically by the Shesha framework.

## Implementing Code-based (enum) Reference Lists 
For reference lists that are not expected to change **ever**, for example, 'Days Of The Week' or 'Gender', an enum should be used.

### Implementation Steps:

1. Create a new enum to define the list of possible values. For consistency the enum name should be prefixed with `RefList`
1. Add the `[ReferenceList]` attribute to the property you wish to use a reference list for
1. Make sure the Reference List property's type is the newly created enum
1.If the item is alphanumeric e.g "Stage 1" instead of pulling it as "Stage1" from the backend, the [Display(Name = "Stage 1")] attribute gives the user flexibility to write these items as readable text.
#### Example
Reference List enum definition:
``` csharp
[ReferenceList("Gender")]
public enum RefListGender: long
{
    [Description("This is for a dude")]
    [Display(Name = "Male")]
    Male = 1,

    [Description("This is for a lady")]
    [Display(Name = "Female")]
    Female = 2
}
```
Using the enum in an Entity class:
``` csharp
public class Person
{
   ...
   public RefListGender Gender { get; set; } 
   ...
}
```

**Important Note:** Shesha automatically looks for all enums with the `ReferenceList` attribute and creates the equivalent values in the database during the start-up process. For this reason, it is not necessary to create the values manually through DB Migrator classes. Additionally, if you attempt to update the list of values through the administration views or directly in the database, changes will get undone by Shesha through this automated synching process.


## Implementing Data-Based Reference Lists 
If the values of a Reference List are expected to change in the future perhaps to allow future customisation for clients or evolving needs, a Data-Driven reference list should be used.

### Implementation Steps:

1. Specify the reference list values. This can be done either through:
   - Configuration Studio
   - Reference List admin screens
   - Database Migration scripts
1. Add a new property is of type `long?` (`int` and `short` will also usually do) you wish to use the reference list for
1. Add the `[ReferenceList]` attribute to the property to map the reference list to the property

#### Example
This example shows how to define a data-based reference list for locations using a database migration class. The reference list will be used in the `Person` entity to store the location of a person.

``` csharp
    [Migration(20250317111700)]
    public class M20250317111700 : Migration
    {
        public override void Up()
        {
            /* Add Locations reference list */
            this.Shesha().ReferenceListCreate("Locations")
                .SetDescription("List of Locations") // set description
                .SetNoSelectionValue(0) // set no selection value
                .AddItem(1, "New York")
                .AddItem(2, "London", 1, "Capital of England")
                .AddItem(3, "Tokyo", 2, "Capital of Japan");
        }

        public override void Down()
        {
            this.Shesha().ReferenceListDelete("Locations");
        }
    }
```

``` csharp
public class Person
{
   ...
   [ReferenceList("Locations")]
   public long? Location { get; set; } 
   ...
}
```

## Data Migration Methods
Beyond simply creating reference lists, Shesha provides a set of methods to manage data-based reference lists through database migration classes. These methods allow you to create, update, and delete reference list items programmatically as illustrated below.

``` csharp 
// Create a new reference list
this.Shesha().ReferenceListCreate("Locations")
    .SetDescription("List of Locations") // set description
    .SetNoSelectionValue(0) // set no selection value
    .AddItem(1, "New York") // add item
    .AddItem(2, "London", 1, "Capital of England") // add item with description
    .AddItem(3, "Tokyo", 2, "Capital of Japan"); // add item with description and order index

// Update an existing reference list
this.Shesha().ReferenceListUpdate("Locations")
    .SetDescription("Updated list of Locations") // update description
    .SetNoSelectionValue(0) // update no selection value
    .DeleteItem(1) // delete item
    .UpdateItem(2, i => i.SetItemText("London, UK").SetDescription("Updated description").SetOrderIndex(10)) // update item
    .AddItem(4, "Paris", 3, "Capital of France"); // add new item

// Delete all items in Location reference list
this.Shesha().ReferenceListUpdate("Locations")
    .DeleteAllItems(); // delete all items

// Delete a reference list entirely
this.Shesha().ReferenceListDelete("Locations");
```

## Multi-Value Reference Lists
A basic limitation of a regular Reference List property is that it can only store a single selection from the list at once. Sometimes, it is desirable to store more than one selected item at the same time. If the list of possible options has 64 items or less, it is possible to use **Multi-value Reference Lists** to support this requirement.
(if you are interested in understanding how multiple values can get stored as a single number <a href="https://www.alanzucconi.com/2015/07/26/enum-flags-and-bitwise-operators/" target="_blank">this article</a> may be helpful)

### Implementation Steps
To implement a Multi-value reference list:
1. Add the `MultiValueReferenceList` attribute to the entity property in question
2. Make sure that the property is of type `long?` or a `enum` (depending whether you want the list of possible values to be flexible or fixed respectively
3. Define your reference list items and ensure items are assigned values that are powers of two (e.g. 1, 2, 4, 8, 16, etc...)
4. Ensure that there are **no more than 64 items** in the list

#### Example

Reference List enum definition:
``` csharp
[ReferenceList("DaysOfTheWeek")]
[Flags]  // For multi-value ref list enums ensure the [Flags] attribute is added 
public enum RefListDaysOfTheWeek
{
    None = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 4,
    Thursday = 8,
    Friday = 16,
    Saturday = 32,
    Sunday = 64,
}
```
Property in an Entity class:
``` csharp
[MultiValueReferenceList("DaysOfTheWeek")]
public RefListDaysOfTheWeek DaysOpen { get; set; }
```

## Useful functions for working with Multi-value reference lists
If you include the `Shesha.Extensions` namespace you will have access to a couple of useful extension functions useful for working with multi-value reference lists.

``` csharp
using Shesha.Extensions

....

// Returns a comma separated list of Reference List Item referenced by the property.
var res = myEntity.GetMultiValueReferenceListItemNames("MyMultiValProperty");

// Returns a string array listing all the items selected.
var res = myEntity.GetMultiValueReferenceListItemNamesAr("MyMultiValProperty");
...
```