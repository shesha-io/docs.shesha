---
sidebar_position: 1
---

# Common Properties & Events

This section describes the properties which are common to all form components.

## Display

### Component Name
 Name of the component. This should be unique within the form, contain only alphanumeric characters and underscores and should not contain any spaces. This name is used to access the component programmatically through its parent form's context property.

### Property Name
 Specifies the name of the property on the form's [Data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) or [Context](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context) object the form component will be bound to.

### Context
 Speficies where the form copmonent's value will be bound to. By default the form component will be bound to and update the [Form data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) if left empty. Otherwise it will be bound to the selected [App Context](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context).

### Label
 The label to display next to the form component. This will be displayed unless the [Hide Label](#hide-label) property is set to true.

### Label Align
 Positioning of label relative to the component. **Options**: 'Left', 'Right', 'Top'

### Hide Label
 Controls the visibility of the component label. If turned off, the component label is not visible in View mode.

### Hidden
 Controls the visibility of the component.
  - `return true` if you want to hide the component
  - `return false` if you want to show the component

:::tip
`return data.gender != 2` - This shows the component if the gender is 2
:::

### Description
 Additional description for the component, more for internal configurator/developer use.

### Edit Mode

Options:

- **Inherited** - Takes the edit mode of the parent form that the component belongs to.
- **Editable** - Enables the user to edit the component's value or perform operations on the component.
- **Read Only** - The component serves as a form of data display, and the user cannot edit the component's value or the component functionality will be disabled (greyed out).

### Hide Border
 Removes the border from the styling of the component.

### Tooltip
 Additional information to display to the user as a tooltip.

### Placeholder
 Placeholder text to display to the user when no value is specified.

### Default Value
 Specifies the default value of the component.

## Validation

### Required
 If checked, prohibits form submission if the component does not have a value (mandatory). Indicated by a red asterisk mark next to the component.

### Style
 Allows configurators to specify custom CSS styling through code. May be used when standard styling properties are insufficient to achieve the required look and feel.

Example:

```javascript
return {
  backgroundColor: "white",
  fontSize: "10px",
};
```

### Size
 The size of the component. **Options**: 'Small', 'Middle', 'Large'

### Layout
 Allows the configurator to specify the width of the label and content (i.e. input) portions of the form component.
  If not provided, the default settings specified at the form level will apply.

  - **Label Col** : The with of the label portion of the component (Should be a value between 0 and 24).
  - **Wrapper Col** : The with of the content or input portion of the component (Should be a value between 0 and 24).

:::tip 24 Columns Grid System
Shesha uses Ant Design's 24 columns' grid system. The values of the **Label Col** and **Wrapper Col** properties should therefore total up to 24.
:::

### Padding
 The padding property is used to define the space between the content of an element and its border. It is essentially the inner spacing within an element.

### Margin
 The margin property, on the other hand, is used to define the space outside an element's border. It controls the spacing between elements, affecting their layout in relation to one another.

## Permissions
 Specifies the permissions required to access the component. The component will be hidden from any user that does not have any of the specified permissions.

 **Example**: 'user:Roles'

## Events
 Event handlers are functions that get triggered on specific events in a component lifecycle.

All form components have a set of event handlers that can be used to respond to specific triggers as the user interacts with the application. These include the following:

### onChange

Triggered on change of the component's value such as on input changes or change of selection in the case of selected based components such as radio buttons, check boxes or drop down list.

### onFocus

Triggered on the component receives the focus.

### onBlur

Triggered when a previously selected component loses focus.

### onSelect

An event which is triggered every time an address is selected.

These events contain a standard list of variables that give the user access to certain variables and functions facilitating the need to respond to various scenarios. Namely:

- [formData](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data)
- `event` callback when an input is made
- current `mode` of the form (_readonly, designer, edit_)
- A function used to [setFormData](/docs/front-end-basics/configured-views/client-side-scripting/set-form-data)
- `moment` function for DateTime operations
- `ParentFormValues`
- [initialValues](/docs/how-to-guides/initialize-dialog-from-parent)
- [toast message](/docs/front-end-basics/configured-views/client-side-scripting/basic-scripting#calling-an-api-using-the-get-method-to-retrieve-data-from-the-back-end) functionality
- `form instance`
- axios instance used to make [http](/docs/front-end-basics/configured-views/client-side-scripting/basic-scripting#calling-an-api-using-the-get-method-to-retrieve-data-from-the-back-end) requests
