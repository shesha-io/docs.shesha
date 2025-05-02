# DataTable

A Datatable component is a versatile tool used to manage and configure the columns in a table, often within the context of a low-code or no-code platform. This component allows users to define, organize, and manipulate the structure and appearance of columns in a table-based display.

[//]: # (<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=552accec-84dc-4841-962f-ff263b5ade73" title="Columns Component" ></iframe>)

This can be used within a child table, which comes with default table pager, filtering, and sorting capabilities, or can be used in isolation to create your desired view. It is fully customizable using stand-alone components that can be integrated into a datatable context.

There is also a 'Datatable (Full)' component that comes pre-populated with most of the components for a more comprehensive user experience, which are also available separately, should you want to construct your own layout. It is important to note that these components need to be used within a datatable context, so as to source data from the same context.

## Customize Button Group

A customizable button group on a child table refers to a set of interactive buttons within a nested or child table component that can be tailored or configured to perform specific actions related to the data displayed within the child table. This exposes the standard set of button styling and actions as previously discussed.

## Column Type

All columns come with a standard set of properties used to configure look and feel, visibility, captions, and even additional information about the information in the column.

- **Data:**

  - This is for when you only want your column to act as a data display in the table.

- **Action:**

  - This is for when you want your column to execute some type of actions. This exposes the ‘Action Configurations’ exposed on each button, as discussed previously.

- **CRUD Operations:**
  - This is for when Inline actions are enabled. This column will be used to trigger the different CRUD operations that the user has enabled on the table. Namely: ADD, EDIT, and DELETE. This topic will be discussed more in-depth later on in the section.

## Table container style

The style that will be applied to the table container/wrapper.

## Table style

The style that will be applied to the table.
