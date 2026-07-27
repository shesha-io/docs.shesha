---
sidebar_label: On Update
---

# On Update

The `onUpdate` event fires every time a user changes a field value on the form. Use it to react to live input - for example, recalculating totals as a user fills in values, showing a field only when another field has a specific value, or warning the user about an invalid combination before they submit.

---

## When It Fires

On Update runs immediately after each individual field change. It fires on every change, including every keystroke in a text field. It does not wait for the user to leave the field or submit the form.

:::warning
On Update fires on every keystroke in text fields. If you need to call an external API inside this event, always guard the call first - check that the field has a value or meets a minimum length before making the request. Without a guard, each keystroke sends a new request to the backend.
:::

---

## Available Variables

All On Update handlers have access to the following variables:

| Variable | Type | Description |
|---|---|---|
| `data` | `object` | Current form field values at the moment the event fires |
| `form` | `object` | Form API - use to read or set field values, or submit the form |
| `http` | `object` | HTTP client for making API requests |
| `message` | `object` | Display toast notifications to the user |
| `moment` | `function` | Moment.js library for date and time operations |
| `contexts` | `object` | All active data contexts (appContext, pageContext, formContext) |
| `globalState` | `object` | Application-wide state shared across pages |
| `setGlobalState` | `function` | Update a value in globalState |
| `initialValues` | `object` | The values the form loaded with before any edits |
| `parentFormValues` | `object` | Field values from the parent form, when this form is used as a subform |
| `selectedRow` | `object` | The currently selected row, when this form is inside a data table |
| `query` | `object` | URL query string parameters - use `query.id` on edit and details forms |
| `application` | `object` | Application-level API - user info, navigation, settings, and entity access |

---

## Examples

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Recalculate a line item subtotal when quantity or unit price changes:**

```javascript
if (data.quantity && data.unitPrice) {
  form.setFieldsValue({ subTotal: data.quantity * data.unitPrice });
}
```

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Warn the user when a discount exceeds the allowed threshold:**

```javascript
if (data.discountPercent > 50) {
  message.warning('Discounts above 50% require manager approval.');
}
```

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Load a related field value only once a linked record is selected:**

```javascript
if (!data.organisation?.id) return;

const response = await http.get(`/api/dynamic/Shesha/Organisation/Get?id=${data.organisation.id}`);
form.setFieldsValue({ region: response.data.result.region });
```

:::tip
Use `initialValues` to compare the current value against what the form originally loaded with. This lets you detect changes and conditionally apply logic only when a specific field has been modified.
:::
