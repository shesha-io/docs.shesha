# Kanban

A Kanban board is a visual project management tool that helps teams organize tasks and track their progress. It provides a clear overview of the status of each task, allowing users to move task cards between columns such as "To Do," "In Progress," and "Done."

![Image](../Advanced/images/Kanban1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Component Name** `string`
A unique identifier used to register this Kanban on the form.

#### **Render Form** `object`  
The modal form that opens when a card is clicked. Required.

#### **Grouping Property** `string`  
Field in your data model used to categorize items into columns. Required.

#### **Collapsible** `boolean`  
Allow users to collapse and expand columns.

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

___

### Appearance

#### Header Styles

**Font**  ``object`` 
Customize:
- Family
- Size
- Weight
- Color

**Background** ``object`` 
Choose from:
- Color *(default)*
- Gradient
- Image
- URL
- Stored File

**Shadow** ``object`` 
Apply shadow with:
- Offset X/Y
- Blur/Spread Radius
- Color

**Border** ``object`` 
Customize with:
- Visibility toggle
- Radius
- Width
- Color

#### Custom Styles

**Style** `string`  
Raw CSS string for styling header.

**Style** `string`  
Raw CSS string for custom column style.

#### Column Styles

**Dimensions**  ``object`` 

Set fixed or max/min height and width.

**Background** ``object`` 

Same options as header.

**Shadow** ``object``

Same options as header.

**Border** ``object``

Same options as header.

**Margin & Padding**  ``object``

Control spacing within and around columns.





