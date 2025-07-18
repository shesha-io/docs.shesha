# Notes

The Notes component is a collaborative and versatile feature for capturing and managing threaded notes. It supports data ownership, conditional visibility, layout adjustments, and event scripting.

![Image](../Entity-References/images/notes1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Notes Category** `string`  
This is used to group notes into categories.

#### **Show Chars Count** `boolean`
Displays a character count indicator to help track the length of a note.

#### **Auto Size** `boolean`  
Automatically resizes the text area based on content.

#### **Allow Edit** `boolean`  
Enables in-place card editing or modal editing.

#### **Allow Delete** `boolean`  
Allows users to delete notes directly from the thread.

___

### Data

#### **Owner Id** `string`  
Specifies the ID of the entity that owns the notes.

#### **Owner Type** `string`  
Defines the type of entity (e.g., project, ticket) using an autocomplete input with options from a metadata API.

___

### Appearance
#### **Buttons Layout** `object`  
Controls the position of the save button:
- **Left** *(default)*
- **Right**


