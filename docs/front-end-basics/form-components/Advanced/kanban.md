# Kanban

A Kanban board is a visual project management tool that helps teams organize tasks and track their progress. It provides a clear overview of the status of each task, allowing users to move task cards between columns such as "To Do," "In Progress," and "Done."

![Image](../Advanced/images/Kanban1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Render Form** `object`  
The modal form that opens when a card is clicked. Required.

#### **Grouping Property** `string`  
Field in your data model used to categorize items into columns. Required.

#### **Readonly** `boolean`  
Disables drag-and-drop and editing capabilities.

#### **Allow Delete** `boolean`  
Toggles the ability to remove cards from the board.

#### **Show Icons** `boolean`  
Toggles icon visibility on card headers.

#### **Allow New Record** `boolean`  
Allows users to add new items to the board.

#### **Allow Edit** `boolean`  
Enables in-place card editing or modal editing.

___

### Data
#### **Reference List** `object`  
The list used to define columns on the board. Re-select if reference list items are modified.

#### **Items** `object`  
Selector for customizing which reference list items appear as columns.







