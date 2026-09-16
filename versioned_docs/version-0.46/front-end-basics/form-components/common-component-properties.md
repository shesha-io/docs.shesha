---
sidebar_position: 1
sidebar_label: Common Properties & Events
---

# Common Properties & Events

Every component you place on a Shesha form shares a set of common properties. These control things like what the component is called, where it reads and writes its value, whether it is visible or editable, how it looks, and how it responds to user interactions. Understanding these properties once means you can configure any component in Shesha. 

:::info Configuration indicators
Shesha marks a component in the designer canvas with a coloured indicator when it needs your attention:

- **Blue** - the component still needs some configuration before it will work correctly, for example a required setting has not been set yet.
- **Yellow** - the component has a configuration error, for example an invalid script or a setting that conflicts with another property.

Hover over the indicator to see a tooltip with the specific detail.
:::

---

## How the Properties Panel Is Organised

Select a component on the canvas and its settings open in the properties panel on the right, grouped into tabs.

| Tab | What it holds |
|---|---|
| `Common` | What the component is called, what data it is bound to, whether it is visible and editable, and its validation rules |
| `Events` | The JavaScript handlers that run when the user interacts with the component |
| `Appearance` | Everything visual: font, dimensions, border, background, shadow, spacing, and custom styling |

Validation settings sit in a **Validations** panel on the Common tab, alongside the rest of the component's configuration, rather than on a tab of their own. Permissions are set per setting using the lock icon, described under [Permissions](#permissions) below, rather than on a separate Security tab.

:::note Components not yet on this layout
Most components use the three-tab layout described here. A smaller number have not been moved across yet and still show their older arrangement, including a separate Security tab and, in some cases, a Validation tab. Both work, and the settings mean the same thing in each. Check what the panel shows for the component you are configuring.
:::

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

:::warning Property Name cannot be a script
Property Name takes a static value only. There is no JS toggle on it, so you cannot calculate the bound field at runtime. Where the target field genuinely varies, place a component per field and use Visible to control which one the user sees.
:::

#### **Label** `boolean / string`

The label is the text that appears next to a component to tell the user what the field is for. When the Label setting is enabled, a text field appears where you type the label text. If you disable it, no label is shown and the component appears without any accompanying text.

:::tip
Hiding the label is useful inside table rows, modal forms with tight layouts, or anywhere the context already makes the field's purpose obvious without a label.
:::

#### **Title** `string`

The title is a heading displayed at the top of certain components, such as panels or sub-forms. Use it when the component represents a logical group and you want to give that group a name the user can see. The **Show Title** toggle controls whether the title is visible.

#### **Placeholder** `string`

The placeholder is grey text that appears inside an input component when it has no value yet. It disappears as soon as the user starts typing. Use it to show an example value or a short instruction, such as "e.g. community@shesha.io" or "Enter your full address".

#### **Tooltip** `string`

The tooltip is a short piece of additional information that appears when the user hovers over the component. Use it to explain what a field is for, what format is expected, or any constraints the user should know about.

Keep tooltips brief. They are a hint, not a full description.

#### **Visible** `boolean`

Visible controls whether the component is shown on the form. Turn it off to hide the component, or switch the setting to a script to decide at runtime.

This is how you build conditional visibility, showing a field only when another field holds a particular value. The script returns `true` to show the component and `false` to hide it.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Show a Spouse Name field only when marital status is Married:**

```js
// 2 is the integer value for 'Married' in the marital status reference list
return data.maritalStatus === 2;
```

:::warning
Always use the integer value from the reference list enum, not the string label. String labels can change; the underlying integer value is stable. Check the backend enum in your domain project to confirm the correct value.
:::

:::note Components still showing Hide
Some components show a **Hide** setting instead of Visible. Hide is the exact inverse: its script returns `true` to hide the component and `false` to show it. Check which of the two the properties panel shows before writing your condition, because moving a script between them flips the result.
:::

#### **Interaction Mode** `object`

Interaction Mode controls whether the user can interact with this component. There are three options:

| Option | Behaviour |
|---|---|
| **Inherited** | The component takes the mode of the form it belongs to. If the form is read-only, so is the component. This is the default. |
| **Editable** | The user can always interact with this component, regardless of the form's mode. |
| **Read Only** | The component is always display-only. The user can see the value but cannot change it. |

Use Inherited for most components. Switch to Read Only when you want a specific field to always be locked, even on an edit form, for example when showing a system-assigned ID or an audit timestamp.

Like Visible, Interaction Mode can be set from a script, and it carries its own permissions through the lock icon beside it. See [Permissions](#permissions).

:::note
This setting was called Edit Mode in earlier versions.
:::

___

### Data Source

Some components, such as dropdowns and autocompletes, need to fetch a list of options or records from somewhere. The Data Source Type setting controls where that data comes from. It sits on the Common tab, often inside a labelled **Data** panel.

:::note
Entity Picker does not use this generic Data Source Type switcher. It always searches a specific Entity Type. See its own page for details.
:::

#### **Data Source Type** `object`

This setting defines where the component fetches its list of data from. The exact option labels and the additional settings that appear depend on the component - for example, the Autocomplete component labels its entity-backed option `Entities list` rather than `Entity Type`. Common choices across list-based components are:

| Option | Description |
|---|---|
| **Entities list** | Fetches records from a Shesha entity using the standard API. This is the default for most list-based components. |
| **URL** | Fetches data from a custom API endpoint you specify. |
| **Form** | Uses data already present on the form rather than calling an API. |

___

### Validations

These settings control what the user must enter before the form can be submitted. They sit in a collapsible **Validations** panel at the bottom of the Common tab.

Which validations a component offers depends on what it accepts. Every component has Required. Text-based components add length limits, a regular expression, and a custom validator; numeric components add minimum and maximum values.

| Setting | What it checks |
|---|---|
| `Required` | The component has a value |
| `Min Length` / `Max Length` | The number of characters entered, on text components |
| `Regular expression` | The value matches the pattern you supply |
| `Message` | The text shown when validation fails, in place of the default message |
| `Custom Validator` | Your own rule, written as a script that returns a promise |

#### **Required** `boolean`

When Required is checked, Shesha will not allow the form to be submitted if this component has no value. A red asterisk (<span style={{ color: 'red' }}>*</span>) appears next to the component's label to signal to the user that the field is mandatory.

:::note
Required validation runs when the user clicks Submit. It does not block the user from navigating the form while the field is empty.
:::

___

### Appearance

These settings control how the component looks - its size, colours, borders, fonts, spacing, and any custom CSS.

Each component chooses which of these panels it shows and in what order, so the Appearance tab does not look identical on every component. Use the panel names below to find the setting rather than its position on the page.

#### **Font** `object`

The Font settings let you customise the typography of the component's label and content. You can set the font family, size, weight, and colour.

#### **Layout** `object`

The Layout settings control how a component arranges the components placed inside it. Layout Type chooses the CSS display mode, such as block, flex or grid. Choosing flex or grid reveals the matching controls, including Flex Direction, Flex Wrap, and the alignment and justification settings.

These settings appear on components that hold other components, such as the Container. They have no effect on a simple input component, which has no children to arrange.

#### **Dimensions** `object`

The Dimensions settings define how much space the component takes up. The panel holds six values across two rows: Width, Min Width and Max Width on the first row, then Height, Min Height and Max Height on the second.

Width and height apply to the component's own outer dimensions. For example, setting a container to 50% width changes the width of the container itself, while the components placed inside it keep their full available space within that container.

Every value accepts any CSS unit, such as `%`, `px` or `em`. A value with no unit is treated as pixels. You can also use a calc expression, for example `calc(50% - 10px)`.

#### **Grid Size** `object`

A component placed inside a container whose Layout Type is `Grid` or `Inline grid` shows an extra **Grid Size** panel inside Dimensions, holding **Width (Columns)** and **Height (Rows)**. These size the component in grid tracks rather than in CSS units, so a component with a Width of `2` spans two columns of its parent grid.

The panel appears on the child, not on the grid. Select the component you want to size and set its span there, rather than looking for the setting on the container. It is only shown when the parent actually uses a grid layout and has a column count set, so if you cannot see it, check the parent's Layout Type first.

Max Height is also what turns a component into a scrolling area. A component with no height cap grows to fit its content, so the box and the content are always the same height and there is nothing to scroll. Setting Max Height caps the box, and any content taller than that cap becomes scrollable. This matters most for components that show a variable number of records, such as a DataList, where the height depends on how many records were loaded.

:::note
There is no Overflow property to set. Components that scroll, such as the Container and the DataList, handle the scrolling for you. Max Height is the only setting you need.
:::

:::tip
Use `px` or `vh` for Max Height. A `%` value only works when the parent element has a definite height of its own, which form containers usually do not, so a percentage often behaves as though no cap was set at all.
:::

:::warning
Some components expose more than one Dimensions group, one for the component itself and another for an inner container. Setting Max Height on the wrong group resizes the wrong element and the component still will not scroll. Check which group you are editing before setting a value.
:::

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

#### **Margin and Padding** `object`

Margin and Padding let you control the spacing around and inside the component.

**Padding** is the space between the component's content and its own border. Increasing padding makes the component feel more spacious internally.

**Margin** is the space between the component's outer edge and the surrounding components. Use margin to push components apart on the form.

:::tip
Use the visual margin/padding editor in the designer to set values for each side independently (top, right, bottom, left) using standard CSS shorthand values such as `8px 16px`.
:::

___

### Permissions

Permissions restrict a component to users holding a named permission. Rather than applying to the component as a whole, they are set on an individual setting, so visibility and editability can be restricted independently.

#### Setting permissions on a setting

A small lock icon sits next to each setting that supports permissions, which in practice means **Visible** and **Interaction Mode**. Click it to choose one or more permissions.

The icon shows you the current state at a glance: it is drawn as an outline when no permissions are set, and filled in when some are.

| Setting | What restricting it does |
|---|---|
| `Visible` | Users without one of the named permissions do not see the component at all |
| `Interaction Mode` | Users without one of the named permissions see the component but cannot edit it |

Setting them separately is the point. Permissioning Interaction Mode alone shows a field to everyone while allowing only certain roles to change it, which a single component-level permission cannot express.

**Example:** To let everyone see a salary field but allow only payroll staff to change it, leave Visible unrestricted and add the `Payroll:Edit` permission to Interaction Mode.

:::warning Hiding a component is not access control
Permissions here only affect what the browser renders. A determined user can still call the API directly. Anything that genuinely must be protected needs the rule enforced on the server as well. See [Endpoint Permissions](../../fundamentals/security/endpoint-permissions.md).
:::

:::note Components not yet on this layout
Components that have not been reworked still carry a **Security** tab with a single component-level Permissions setting, which hides the whole component from users without the permission. Existing permission values were carried across automatically when a component moved to the per-setting model, so nothing you configured previously needs redoing.
:::

___

### Events

Events are JavaScript functions that run automatically when the user interacts with a component. Every component supports a set of event handlers. You write your own code in each handler to respond to what the user is doing.

All event handlers have access to the same set of variables:

| Variable | What it gives you |
|---|---|
| `data` | The current values of all fields on the form. See [Form Data](../configured-views/client-side-scripting/shesha-objects/data.md). |
| `formData` | The same field values as `data`. |
| `form` | The form instance: `form.data`, `form.mode`, `form.state`, `form.components`, and `form.setFieldsValue({ ... })`. See [Form Instance API](../javascript-api/form.md). |
| `actions` | Calling APIs, showing messages, opening dialogs, and navigating. See [Actions API](../javascript-api/actions.md). |
| `utils` | Dates, saving files, modals, and template evaluation. See [Utils API](../javascript-api/utils.md). |
| `page` | Page-scoped shared state and the browser location. See [Page API](../javascript-api/page.md). |
| `user` | The signed-in user and their permission checks. See [User API](../javascript-api/user.md). |
| `storage` | Browser local and session storage. See [Storage API](../javascript-api/storage.md). |
| `application` | Entities, settings, navigation, and application-wide state. See [Application API](../javascript-api/application/application.md). |
| `query` | Query string values from the page URL. See [Query API](../javascript-api/query.md). |
| `initialValues` | The values the form had when it first loaded. |
| `parentFormValues` | The field values of the parent form, if this component is inside a sub-form. |
| `event` | The raw browser event object, on input events such as onChange and onFocus. |
| `value` | The component's value at the moment the event fired. |

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
  actions.showMessage.warning('This does not look like a valid email address.');
}
```

#### **On Click** `function`

This event fires when the user clicks the component. It is most commonly used on buttons or icon components to trigger a custom action.

#### **On Double Click** `function`

This event fires when the user double-clicks on an item inside the component, such as a row in a data table. A common use is to open the clicked record in a detail view.

#### **On Mouse Enter** `function`

This event fires when the pointer moves onto the component. Use it for hover effects, or to load extra detail only when the user shows interest in an item.

#### **On Mouse Move** `function`

This event fires repeatedly while the pointer moves across the component. It fires often, so keep the handler light and avoid server calls inside it.

#### **On Mouse Leave** `function`

This event fires when the pointer moves off the component. Use it to undo whatever On Mouse Enter started.

#### **On Key Down** `function`

This event fires when the user presses a key while the component has focus. Use it to react to a specific key, such as running a search when the user presses Enter.

#### **On Key Up** `function`

This event fires when the user releases a key while the component has focus. Use it when you need the value after the keystroke has been applied rather than before.
