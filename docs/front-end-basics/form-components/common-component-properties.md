---
sidebar_position: 1
---

# Common Properties & Events

This section describes the properties which are common to all form components.

## Component Name

Name of the component. This should be unqiue within the form, contain only alphanumeric characters and underscores and should not contain any spaces. This name is used to access the component programmatically through its parent form's context property.

## Property Name

Specifies the name of the property on the form's [Data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data) or [Context](/docs/front-end-basics/configured-views/data-types/shesha-objects/app-context) object the form component will be bound to.

## Context

Speficies where the form copmonent's value will be bound to. By default the form component will be bound to and update the [Form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data) if left empty. Otherwise it will be bound to the selected [App Context](/docs/front-end-basics/configured-views/data-types/shesha-objects/app-context).

## Label

The label to display next to the form component. This will be displayed unless the [Hide Label](#hide-label) property is set to true.

## Label Align

Positioning of label relative to the component. **Options**: 'Left', 'Right', 'Top'

## Hide Label

Controls the visibility of the component label. If turned off, the component label is not visible in View mode.

## Hidden

Controls the visibility of the component. If turned off, the component is not visible in View mode.

## Description

Additional description for the component, more for internal configurator/developer use.

## Disabled

Specifies the interactivity of the component. If turned on, the component functionality will be disabled (greyed out).

## Read Only

Specifies the interactivity of the component. If turned on, the component serves as a form of data display, and the user cannot edit the component's value.

## Hide Border

Removes the border from the styling of the component.

## Required

If checked, prohibits form submission if the component does not have a value (mandatory). Indicated by a red asterisk mark next to the component.

## Style

Allows configurators to specify custom CSS styling through code. May be used when standard styling properties are insufficient to achieve the required look and feel. 

Example:
  ```javascript
  return {
    backgroundColor: "white",
    fontSize: "10px",
  };
  ```

## Size

The size of the component. **Options**: 'Small', 'Middle', 'Large'

## Tooltip

Additional information to display to the user as a tooltip.

## Placeholder

Placeholder text to display to the user when no value is specified.

## Default Value

Specifies the default value of the component.

## Permissions

Specifies the permissions required to access the component. The component will be hidden from any user that does not have any of the specified permissions.

- **Example**: 'user:Roles'

## Selection Mode

Set mode of selection. Options: Single (Single value), Multiple (Array of values)

## Display Property

Name of the property within the bounded entity that should be displayed in the field/component. Leave empty to use the default display property defined in the backend.

## Layout

Allows the configurator to specify the width of the label and content (i.e. input) portions of the form component.
If not provided, the default settings specified at the form level will apply. 

- **Label Col** : The with of the label portion of the component (Should be a value between 0 and 24).
- **Wrapper Col** : The with of the content or input portion of the component (Should be a value between 0 and 24).

:::tip 24 Columns Grid System
Shesha uses Ant Design's 24 columns' grid system. The values of the **Label Col** and **Wrapper Col** properties should therefore total up to 24.
:::

## Entity Filter/ Query Builder

Specifies the filter to be applied when querying entities. A detailed explanation can be found [here](/docs/front-end-basics/how-to-guides/filtering).

## Padding

The padding property is used to define the space between the content of an element and its border. It is essentially the inner spacing within an element.

## Margin

The margin property, on the other hand, is used to define the space outside an element's border. It controls the spacing between elements, affecting their layout in relation to one another.
