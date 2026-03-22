---
sidebar_position: 1
---

# Common Properties & Events

Every component you place on a Shesha form shares a set of common properties. These control things like what the component is called, where it reads and writes its value, whether it is visible or editable, how it looks, and how it responds to user interactions. Understanding these properties once means you can configure any component in Shesha. 

---

### Common

This group contains the fundamental settings that identify the component and connect it to your form's data.

#### **Component Name** `string`

The component name is a unique identifier for this component within the form. Shesha uses it internally to reference the component in scripts and in the designer.

The name must be unique across the entire form. It can only contain letters, numbers, and underscores - no spaces or special characters. A good convention is to use camelCase (e.g. `firstNameInput`, `statusDropdown`).

:::tip
Component Name is different from Property Name. Component Name is how you refer to the component itself (in code). Property Name is the field on your data that the component reads from and writes to.
:::

#### **Property Name** `string`

The property name tells Shesha which field on the form's data object this component is bound to. When the form loads data, Shesha reads this field and fills the component. When the user saves, Shesha writes the component's value back to this field.

For example, if your form is bound to a `Person` entity and you want a text field to show the person's first name, set the Property Name to `firstName`. Use dot notation to reach nested fields, such as `address.city` to reach the `city` field inside an `address` object.

:::info
Property Name maps directly to the field name on your backend entity. Make sure the spelling and casing match exactly - Shesha is case-sensitive here.
:::

#### **Context** `object`

By default, a component reads from and writes to the form's own data object (the current record). The Context setting lets you point the component at a different data source instead - specifically an [App Context](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context) object.

Leave this blank if you want the component to work with the form's data as normal. Set it to a named App Context if you want the component to read from and write to shared application-level state instead.

#### **Label** `boolean / string`

The label is the text that appears next to a component to tell the user what the field is for. When the Label setting is enabled, a text field appears where you type the label text. If you disable it, no label is shown and the component appears without any accompanying text.

:::tip
Hiding the label is useful inside table rows, modal forms with tight layouts, or anywhere the context already makes the field's purpose obvious without a label.
:::

#### **Title** `string`

The title is a heading displayed at the top of certain components, such as panels or sub-forms. Use it when the component represents a logical group and you want to give that group a name the user can see. The **Show Title** toggle controls whether the title is visible.

#### **Description** `string`

The description is an internal note about what this component does or why it was configured a certain way. It is only visible to configurators in the form designer - it does not appear to end users at all.

Use this to leave a note for yourself or your team, such as "This field is pre-filled by the On After Data Load event" or "Required by the compliance workflow."

#### **Edit Mode** `object`

Edit Mode controls whether the user can interact with this component. There are three options:

| Option | Behaviour |
|---|---|
| **Inherited** | The component takes the edit mode of the form it belongs to. If the form is read-only, so is the component. This is the default. |
| **Editable** | The user can always interact with this component, regardless of the form's mode. |
| **Read Only** | The component is always display-only. The user can see the value but cannot change it. |

Use Inherited for most components. Switch to Read Only when you want a specific field to always be locked, even on an edit form - for example, showing a system-assigned ID or an audit timestamp.

#### **Tooltip** `string`

The tooltip is a short piece of additional information that appears when the user hovers over the component. Use it to explain what a field is for, what format is expected, or any constraints the user should know about.

Keep tooltips brief. They are a hint, not a full description.

#### **Placeholder** `string`

The placeholder is grey text that appears inside an input component when it has no value yet. It disappears as soon as the user starts typing. Use it to show an example value or a short instruction, such as "e.g. community@shesha.io" or "Enter your full address".

#### **Hide** `function`

The Hide setting controls whether the component is visible on the form. You write a small JavaScript expression that returns `true` to hide the component or `false` to show it.

This is how you create conditional visibility - showing a field only when another field has a specific value.

**Example - Show a "Spouse Name" field only when marital status is "Married":**

```js
// Assuming 2 is the integer value for 'Married' in the marital status reference list
return data.maritalStatus !== 2;
```

When this expression returns `true`, the component is hidden. When it returns `false`, the component is visible.

:::warning
Always use the integer value from the reference list enum, not the string label. String labels can change; the underlying integer value is stable. Check the backend enum in your domain project to confirm the correct value.
:::

#### **Collapsible** `boolean`

When enabled, this adds a collapse/expand toggle to the component, allowing the user to hide the component's content to save space. This is most commonly used on panel and sub-form components.

___

### Data

Some components, such as dropdowns and entity pickers, need to fetch a list of options or records from somewhere. The Data Source Type setting controls where that data comes from.

#### **Data Source Type** `object`

This setting defines where the component fetches its list of data from. The available options depend on the component, but common choices are:

| Option | Description |
|---|---|
| **Entity Type** | Fetches records from a Shesha entity using the standard API. This is the default for most list-based components. |
| **URL** | Fetches data from a custom API endpoint you specify. |
| **Form** | Uses data already present on the form rather than calling an API. |

___

### Validation

These settings control what the user must enter before the form can be submitted.

#### **Required** `boolean`

When Required is checked, Shesha will not allow the form to be submitted if this component has no value. A red asterisk (<span style={{ color: 'red' }}>*</span>) appears next to the component's label to signal to the user that the field is mandatory.

:::note
Required validation runs when the user clicks Submit. It does not block the user from navigating the form while the field is empty.
:::

#### **Min Length / Max Length** `number`

These settings constrain how long a text value can be. Set **Min Length** to enforce a minimum number of characters, and **Max Length** to cap the input at a certain length.

For example, a password field might require at least 8 characters (Min Length = 8). A short code field might be exactly 6 characters (Min Length = 6, Max Length = 6).

___

### Appearance

These settings control how the component looks - its size, colours, borders, fonts, spacing, and any custom CSS.

#### **Font** `object`

The Font settings let you customise the typography of the component's label and content. You can set the font family, size, weight, and colour.

#### **Dimensions** `object`

The Dimensions settings define how much space the component takes up. You can set the width and height as fixed values or percentages, and also set minimum and maximum constraints for each. The Overflow setting controls what happens when the content is larger than the component's boundaries.

#### **Border** `object`

The Border settings control the line drawn around the component. You can set the border style (solid, dashed, dotted), width, colour, and the corner radius. Use a higher radius value to get rounded corners.

#### **Background** `object`

The Background settings let you fill the component's background with a colour, a gradient, or an image. When choosing Image, you can provide the image as a URL, a base64-encoded string, or a stored file ID from Shesha's file storage.

You can also control how the background image is sized (contain or cover), positioned, and whether it repeats.

#### **Shadow** `object`

The Shadow settings add a drop shadow behind the component to give it visual depth. You can control the horizontal and vertical offset, the blur radius, the spread, and the colour of the shadow.

#### **Style** `function`

The Style setting lets you write a JavaScript expression that returns a CSS style object. Use this when the standard styling controls are not enough to achieve the look you need, or when you want the appearance to change based on the form's data.

The expression must return a plain JavaScript object where the keys are camelCase CSS property names.

**Example - Change the background colour based on a status value:**

```js
return {
  backgroundColor: data.status === 1 ? '#e6f7e6' : '#fde8e8',
  borderRadius: '4px',
  padding: '8px',
};
```

**Example - Apply a fixed style:**

```js
return {
  backgroundColor: 'white',
  fontSize: '14px',
  fontWeight: '600',
};
```

#### **Size** `object`

Controls the overall size of the component. The options are:

| Value | Description |
|---|---|
| **Small** | A compact version, suitable for dense layouts. |
| **Middle** | The default size for most forms. |
| **Large** | An enlarged version, useful for prominent or accessibility-focused inputs. |

#### **Margin and Padding** `object`

Margin and Padding let you control the spacing around and inside the component.

**Padding** is the space between the component's content and its own border. Increasing padding makes the component feel more spacious internally.

**Margin** is the space between the component's outer edge and the surrounding components. Use margin to push components apart on the form.

:::tip
Use the visual margin/padding editor in the designer to set values for each side independently (top, right, bottom, left) using standard CSS shorthand values such as `8px 16px`.
:::

___

### Security

#### **Permissions** `object`

The Permissions setting restricts who can see this component. You specify one or more permission names, and Shesha will hide the component from any user who does not hold at least one of those permissions.

This is a display-level restriction - the component simply does not appear for users without the required permissions. For sensitive data, always combine this with server-side permission checks as well.

**Example:** To restrict a component to users with the `User:Roles` permission, enter `User:Roles` in the permissions field.

:::warning
Hiding a component via Permissions only removes it from the UI. A determined user could still attempt to submit values directly to the API. Always enforce access rules on the server side for sensitive operations.
:::

___

### Events

Events are JavaScript functions that run automatically when the user interacts with a component. Every component supports a set of event handlers. You write your own code in each handler to respond to what the user is doing.

All event handlers have access to the same set of variables:

| Variable | What it gives you |
|---|---|
| `data` | The current values of all fields on the form. See [Form Data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data). |
| `form` | The form instance. Use `form.setFieldsValue({ fieldName: value })` to update field values. |
| `http` | An Axios instance for making HTTP requests to the server. |
| `message` | Functions to show toast notifications: `message.success(...)`, `message.error(...)`, `message.warning(...)`. |
| `moment` | The Moment.js library for working with dates and times. |
| `mode` | The current form mode: `'edit'`, `'readonly'`, or `'designer'`. |
| `initialValues` | The values the form had when it first loaded. |
| `parentFormValues` | The field values of the parent form, if this component is inside a sub-form. |
| `event` | The raw browser event object (available on input events like onChange and onFocus). |

#### **On Change** `function`

This event fires every time the component's value changes - when the user types into a text field, selects a new option, checks a checkbox, or clears a value.

Use it to react to a field change in real time, such as computing a derived value, triggering a lookup, or updating a related field.

**Example - Automatically build a full name when first or last name changes:**

```js
const fullName = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();
if (fullName !== data.fullName) {
  form.setFieldsValue({ fullName });
}
```

:::warning Avoid infinite loops
If your onChange code calls `form.setFieldsValue`, that can trigger onChange on the updated field. Always guard your updates with a condition so you only set a value when it actually needs to change.
:::

#### **On Focus** `function`

This event fires when the user clicks into or tabs into the component. It is useful for highlighting content, showing contextual help, or loading data just before the user is about to interact with a field.

#### **On Blur** `function`

This event fires when the user leaves the component - clicking or tabbing away after having interacted with it. Use it for field-level validation or to trigger a lookup after the user has finished entering a value.

**Example - Validate an email address format when the user leaves the field:**

```js
const email = data.emailAddress1;
if (email && !email.includes('@')) {
  message.warning('This does not look like a valid email address.');
}
```

#### **On Select** `function`

This event fires when an item is selected from a list-based component - for example, when the user picks an address from an autocomplete dropdown or chooses a record from an entity picker.

Use it to populate related fields after the user makes a selection.

**Example - Fill in address fields after the user selects an address:**

```js
if (data.selectedAddress) {
  form.setFieldsValue({
    streetLine1: data.selectedAddress.addressLine1,
    suburb: data.selectedAddress.suburb,
    postalCode: data.selectedAddress.postalCode,
  });
}
```

#### **On Click** `function`

This event fires when the user clicks the component. It is most commonly used on buttons or icon components to trigger a custom action.

#### **On File List Changed** `function`

This event fires when files are added to or removed from a file upload component. Use it to react to file uploads, such as validating the number of files or updating a status field.

#### **On Create** `function`

This event fires when a new item is created inside the component - for example, when a new row is added to an editable data table. Use it to set default values on the new row.

#### **On Update** `function`

This event fires when an existing item inside the component is updated - for example, when a row in an editable table is edited. Use it to react to changes at the row level.

#### **On Delete** `function`

This event fires when an item inside the component is deleted. Use it to run cleanup logic or prompt the user before the deletion completes.

#### **On Double-Click** `function`

This event fires when the user double-clicks on an item inside the component, such as a row in a data table. A common use is to open the clicked record in a detail view.

#### **On Row Save Success** `function`

This event fires after a row inside an inline-editable component is saved successfully. Use it to show a confirmation message or refresh related data.

#### **On Row Delete Success** `function`

This event fires after a row inside an inline-editable component is deleted successfully. Use it to show a confirmation or update any running totals.