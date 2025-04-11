# Columns

The **Columns** component allows you to display child components in multiple columns—perfect for building cleaner and more responsive forms. Whether you're organizing inputs side by side or arranging form sections elegantly, this component ensures your layout stays structured and user-friendly.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=747834b4-9ef8-4088-a951-e976776b19ec" title="Columns Component" ></iframe>'

## Current Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Property Name
This is the name of the form property. It allows binding the component to a specific property on an entity or DTO. The "show binding option" gives flexibility to configure binding context and parameters manually.

### Label
Sets the label displayed for the component. It’s auto-populated if bound to a property name but can be customized as needed.

### Hide Label
Gives you the power to declutter your UI by hiding the component label entirely. Great when the layout is self-explanatory.

### Label Alignment
Offers options to align your label to the left or right side of the component. Comes with intuitive icon buttons for quick toggling.

### Tooltip
Hovering over the label will reveal the tooltip text configured here—super handy for providing extra guidance.

### Edit Mode
Choose between `Editable`, ``Inherited``, or ``Read Only`` modes:

- **Editable**: Users can interact and change data.

- **Inherited**: Follows the parent form’s edit mode.

- **Read Only**: Display-only mode, no edits allowed.

### Hide
Allows toggling the visibility of the entire component. Sometimes less is more.

### Number of Columns
This setting controls how many columns the children should be split into. It ranges from 1 to 4. Handy for designing multi-column layouts in your forms—no flexbox needed!