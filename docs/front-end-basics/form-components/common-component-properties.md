---
sidebar_position: 1
---

# Common Component Properties

## Component Name

Component Identifier

## Property Name

Allows to assign component to some field of stored object

## Context

Allows to choose storage where assigned data will be stored. [Form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data) is used if empty, else [App Context](/docs/front-end-basics/configured-views/data-types/shesha-objects/app-context)

## Label

Component Label

## Label Align

Positioning of label in context of the input field

## Hide Label

Controls the visibility of the component label. If turned off, the component label is not visible in View mode.

## Hidden

Controls the visibility of the component. If turned off, the component is not visible in View mode.

## Description

Additional description for the component. Often displayed as a tooltip providing additional information.

## Disabled

Controls the interactivity of the component. If turned on, the component functionality will be disabled (greyed out).

## Read Only

Controls the interactivity of the component. If turned on, the component serves as a form of data display, and the user cannot alter information.

## Hide Border

Removes the border from the styling of the component.

## Required

If checked, prohibits form submission if the component does not have an entered value (mandatory). Indicated by a red asterisk mark next to the component.

## Style

Code editor for entering custom CSS styling. Returns the style of the element as an object.

- Example:
  ```javascript
  return {
    backgroundColor: "white",
    fontSize: "10px",
  };
  ```

## Size

The size of the component. **Options**: 'Small', 'Middle', 'Large'

## Tooltip

Additional description for the component on hover.

## Placeholder

The placeholder of the input.

## Default Value

Sets the default value of the component.

## Permissions

Authorization settings using roles and permissions. Users without the specified permission won't have access to the specific component or page.

- **Example**: 'user:Roles'

## Selection Mode

Set mode of selection. Options: Single (Single value), Multiple (Array of values)

## Display Property

Name of the property within the bounded entity that should be displayed in the field/component. Leave empty to use the default display property defined in the backend.

## Layout

Use the configurations under this section to override the layout settings of a component. If not provided, the default settings will be used. This uses the Ant Design's 24 columns' grid system.

- **Label Col** : The columns span
- **Wrapper Col** : The component's column's span

## Entity Filter/ Query Builder

The JavaScript Query Builder is a rich and responsive UI for filtering large amounts of data by creating or editing conditions. Outputs structured JSON filters that can be easily parsed to create SQL queries. Allows creating conditions and grouping them using AND/OR logic. Supports executing `{{mustache templating}}` to tap into dynamic values on the designer form. Implementation can be found [here](/docs/front-end-basics/how-to-guides/filtering).

## Padding

- The padding property is used to define the space between the content of an element and its border. It is essentially the inner spacing within an element.

## Margin

- The margin property, on the other hand, is used to define the space outside an element's border. It controls the spacing between elements, affecting their layout in relation to one another.
