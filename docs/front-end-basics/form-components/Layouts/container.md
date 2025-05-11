# Container

The Container component is used to group components together. It is a wrapper component that can contain other components apply styling to the group as a whole.

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=21208187-d0bf-40e8-a749-fa9def96f5ec" title="Container Component" ></iframe>'

### No Default Styling

- If checked, the component will not have any predefined styling, and its visual presentation will have to be fully defined by the configurator.

### Display

- Specifies the display behavior (the type of rendering a container or box) of an element. It consists of 4 options:

  - **Flex:** Displays an element as a block-level flex container.
  - **Grid:** Displays an element as a block-level grid container.
  - **Block:** Displays an element as a block element (like `<p>`). It starts on a new line and takes up the whole width.
  - **Inline-Grid:** Displays an element as an inline-level grid container.

### Flex-Direction

- Sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed). It consists of 6 options:

  - **Row:** The flexible items are displayed horizontally, as a row.
  - **Row-Reverse:** Same as row, but in reverse order.
  - **Column:** The flexible items are displayed vertically, as a column.
  - **Column-Reverse:** Same as column, but in reverse order.
  - **Initial:** Sets this property to its default value.
  - **Inherit:** Inherits this property from its parent element.

### Flex-Wrap

- Is used to control the wrapping behavior of flex items within the flex container.

### Align-Items

- Specifies the default alignment for items inside a flexbox or grid container. It consists of 6 options:

  - **Normal:** Default. Behaves like 'stretch' for flexbox and grid items, or 'start' for grid items with a defined block size.
  - **Stretch:** Items are stretched to fit the container.
  - **Center:** Items are positioned at the center of the container.
  - **Start:** Items are positioned at the beginning of their individual grid cells, in the block direction.
  - **End:** Items are positioned at the end of their individual grid cells, in the block direction.

### Justify Content

- Property aligns the flexible container's items when the items do not use all available space on the main-axis (horizontally). It consists of several options:

  - **Flex-Start:** Default value. Items are positioned at the beginning of the container.
  - **Flex-End:** Items are positioned at the end of the container.
  - **Centre:** Items are positioned in the centre of the container.
  - **Space-Between:** Items will have space between them.
  - **Space-Around:** Items will have space before, between, and after them.
  - **Space-Evenly:** Items will have equal space around them.
  - **Initial:** Sets this property to its default value.
  - **Inherit:** Inherits this property from its parent element.

### Custom CSS Class

- It's like a label for your webpage parts, allowing you to easily customize their appearance using your own design preferences.
