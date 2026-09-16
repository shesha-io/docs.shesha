---
sidebar_label: On Update
title: On Values Update
---

# On Values Update

:::note Also known as On Update
`On Update` is the legacy name for this event. In the current Form Designer, the same lifecycle point is labelled **On Values Update** (`onValuesUpdate`) on the form's Data tab, with the tooltip "This action will be executed whenever the form updates". If you're maintaining an older form that still uses `onUpdate`, it is automatically migrated to `onValuesUpdate` the next time the form is opened, and behaves the same way.
:::

The `onValuesUpdate` event fires every time a user changes a field value on the form. Use it to react to live input - for example, recalculating totals as a user fills in values, showing a field only when another field has a specific value, or warning the user about an invalid combination before they submit.

---

## When It Fires

On Values Update runs immediately after each individual field change, via Ant Design's own `onValuesChange` callback. It fires on every change, including every keystroke in a text field. It does not wait for the user to leave the field or submit the form.

:::warning
On Values Update fires on every keystroke in text fields. If you need to call an external API inside this event, always guard the call first - check that the field has a value or meets a minimum length before making the request. Without a guard, each keystroke sends a new request to the backend.
:::

---

## Available Variables

All On Values Update handlers have access to the following variables:

| Variable | Type | Description |
|---|---|---|
| `data` | `object` | Current form field values at the moment the event fires |
| `form` | `object` | Form API - use to read or set field values, or submit the form |
| `actions.callApi` | `object` | HTTP client for calling APIs. Exposes `get`, `post`, `put`, `patch`, and `delete` |
| `actions.showMessage` | `object` | Shows a toast notification: `success`, `error`, `warning`, `info`, `loading` |
| `utils.moment` | `function` | The Moment.js library, for working with dates and times |
| `application.state` | `object` | Data shared across the whole application |
| `page.state` | `object` | Data shared by every component on the current page |
| `initialValues` | `object` | The values the form loaded with before any edits |
| `parentFormValues` | `object` | Field values from the parent form, when this form is used as a subform |
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
  actions.showMessage.warning('Discounts above 50% require manager approval.');
}
```

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Load a related field value only once a linked record is selected:**

```javascript
if (!data.organisation?.id) return;

const response = await actions.callApi.get(`/api/dynamic/Shesha/Organisation/Get?id=${data.organisation.id}`);
form.setFieldsValue({ region: response.data.result.region });
```

:::tip
Use `initialValues` to compare the current value against what the form originally loaded with. This lets you detect changes and conditionally apply logic only when a specific field has been modified.
:::
