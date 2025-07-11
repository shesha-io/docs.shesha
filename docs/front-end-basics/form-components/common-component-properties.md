---
sidebar_position: 1
---

# Common Properties & Events

This section describes the properties which are common to all form components.

### Common
#### Component Name `string`
This name must be unique within the form, contain only alphanumeric characters and underscores (no spaces), and is used to access the component programmatically through its parent form's context property.

#### Property Name `string`
 This specifies the name of the property on the form's [Data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) or [Context](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context) object the form component will be bound to.

#### Context `object`
 This speficies where the form copmonent's value will be bound to. By default the form component will be bound to and update the [Form data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) if left empty, otherwise it will be bound to the selected [App Context](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context).

 
#### **Title** `string`

The heading displayed at the top of the component.

#### **Show Title** `boolean`  
Toggles visibility of the component title.

#### Label `boolean\string`
Toggles the display of the label. When enabled, a text field appears to enter the label name.

#### Hide `boolean`
 Controls the visibility of the component.
  - `return true` if you want to hide the component
  - `return false` if you want to show the component

:::tip
`return data.gender != 2` - This shows the component if the gender is 2
:::

#### Description `string`
 Additional description for the component, more for internal configurator/developer use.

#### Edit Mode `object`
Set the component’s interaction behavior:
- **Inherited** - Takes the edit mode of the parent form that the component belongs to.
- **Editable** - Enables the user to edit the component's value or perform operations on the component.
- **Read Only** - The component serves as a form of data display, and the user cannot edit the component's value or the component functionality will be disabled (greyed out).

#### Tooltip `string`
 Additional information to display to the user as a tooltip.

#### Placeholder `string`
 Placeholder text to display to the user when no value is specified.
___

### Data
#### Default Value `string`
 Specifies the default value of the component.

 **Data Source Type** `object`  
Defines the source from which data is pulled:
- **Entity Type** *(default)*
- **URL**
- **Form**

 ___

### Validation

#### Required `boolean`
 If checked, prohibits form submission if the component does not have a value (mandatory). Indicated by a red asterisk mark next to the component.

 ___

### Appearance

#### **Font** ``object`` 

Customize how your component labels look. Choose the font family, size, weight, and color.

#### **Dimensions** ``object`` 

Specify the size of your component:
- Width, Height
- Min/Max Width and Height
- Overflow behavior

#### **Border** ``object`` 
Controls card border styling, with the following options:

  - **Border Type**: Defines the type or style of the border.

  - **Radius Type**: Defines the shape or roundness of the corners.

#### **Background** ``object``

Select a type of background. The options are:

- **Color**
- **Gradient**
- **Image URL**
- **Uploaded Image**
- **Stored File**

Also tweak background size, position, and repeat behavior.

#### **Shadow** ``object`` 

Give depth with adjustable shadows:

- Offset, Blur, Spread, Color

#### Style `function`
 Allows configurators to specify custom CSS styling through code. May be used when standard styling properties are insufficient to achieve the required look and feel.

Example:

```javascript
return {
  backgroundColor: "white",
  fontSize: "10px",
};
```

#### Size `object`
 The size of the component, the options are :
  - **Small**
  - **Middle**
  - **Large**

#### Margin and Padding `object`
The padding property defines the space between an element’s content and its border, creating inner spacing within the element. In contrast, the margin property controls the space outside an element’s border, determining the distance between the element and surrounding elements. Together, they help adjust spacing and layout for a more precise and visually appealing design.

___

### Security

#### Permissions `object`
 Specifies the permissions required to access the component. The component will be hidden from any user that does not have any of the specified permissions.

 **Example**: `user:Roles`
 ___

### Events
 Event handlers are functions that get triggered on on specific events in a component lifecycle.

All form components have a set of event handlers that can be used to respond to specific triggers as the user interacts with the application. These include the following:

#### on Change `function`

Triggered on change of the component's value such as on input changes or change of selection in the case of selected based components such as radio buttons, check boxes or drop down list.

#### on Focus `function`

Triggered on the component receives the focus.

#### on Blur `function`

Triggered when a previously selected component loses focus.

#### on Select `function`

An event which is triggered every time an [address](/front-end-basics/form-components/Advanced/address.md) is selected.

#### on Click `function`

An event triggered when the component is clicked.

#### On File List Changed `function`

Triggered when files are added to or removed from the [file list](/front-end-basics/form-components/Entity-References/files.md).

#### On Create `function`

Triggered when a new component is created.

#### On Update `function`

Triggered when an existing component is updated.

#### On Delete `function`

Triggered when a component is deleted.

#### On Double-Click `function`

Triggered when a row is double-clicked by the user.

#### On Row Save Success `function`

Triggered after a row is successfully saved.

#### On Row Delete Success`function` 

Triggered after a row is successfully deleted.



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
