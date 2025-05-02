# DataList

The `DataList` component should be placed inside the `DatatableContext` component. This component is intended to get a list of data (similar to using it with the Datatable component). It shows data from the DatatableContext as a list of sub-forms. Note that other DatatableContext-specific components (Pager, Quick Search, Table view selector) can also affect the `DataList`, similar to the [`Datatable`](/docs/front-end-basics/form-components/tables-lists/datatable.md).

[//]: # (<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=cf652775-9c95-44e4-8152-8c52f174d830" title="Columns Component" ></iframe>)

## On Double Click

This is triggered when there is a type of user interaction that occurs when a user rapidly clicks a mouse button twice in quick succession. It includes a list of ‘Action Configurations’ as discussed previously. In cases where the user is trying to perform an action on a specific row, the content of the currently selected row will be saved in the ‘selectedRow’ object and can be accessed like this (Action Configuration - Navigate). <br/>
E.g. `/dynamic/Boxfusion.SheshaFunctionalTests.Common/test-details-view?id={{selectedRow.id}}`.

## Selection Mode

Allows choosing a mode of selecting list items.

- None: Select item disabled.
- Single: Allows selecting only one item from the list. This value is saved in the Datatable Contexts ‘selectedRow’ property.
- Multiple: Allows selecting multiple items from the list. This value is saved in the Datatable Contexts ‘selectedIds’ property as an array.

## Form Selection

- Named Form: User selects a specific form to drill down into.
- View Type: User selects the form type. These forms are specified in the ‘Entity Configurations’ view, which provides a centralized repository of the different types of views and which form should be rendered based on the scenario. This takes the entity specified on the datatable context component.

## Form Identifier Expression

This provides a JavaScript Code Editor that allows the user to enter code to get the form identifier. You must return `{name: string; module: string; version: number}` object.

## Orientation

The layout of the list. Options: Vertical, Horizontal.
