---
sidebar_label: On Initialized
---

# On Initialized

**On Initialized** is a form lifecycle event that runs a piece of JavaScript automatically, at the very start of the form's life, before Shesha has fetched any data for it. Use it to prepare things the rest of the form depends on, such as reading a value from the URL, seeding global state, or setting up other conditions the form needs before it starts loading.

:::note Also known as On Before Data Load
`On Initialized` is the legacy name for this event. In the current Form Designer, the same lifecycle point is labelled **On Before Data Load** on the form's Data tab. If you're maintaining an older form that still uses `onInitialized`, it behaves the same way and there is no need to rename it, but any new configuration should use On Before Data Load.
:::

---

## When It Fires

This event fires once, the first time the form loads, immediately after the form's settings have been applied and before Shesha makes the API call to load the record's data. Because it runs before that data load, the form's `data` object is generally empty at this point.

:::warning
Don't rely on `data.id` inside this event to get the current record's id, since the record hasn't loaded yet. If you need the id from the URL, use `query.id` instead.
:::

---

## Available Variables

The On Initialized script has access to the same set of standard variables available throughout the form:

| Variable | Description |
|---|---|
| `data` | The form's current data (generally empty at this point) |
| `form` | The form instance, including `form.formMode`, `form.formArguments`, and `form.setFieldsValue` |
| `query` | The query string parameters from the current URL |
| `initialValues` | The initial values passed into the form, if any |
| `parentFormValues` | The data of the parent form, when the current form is a sub form |
| `globalState` / `setGlobalState` | Read and update global state shared across the application |
| `contexts` | Access to Form, Page, App, and Web Storage contexts |
| `pageContext` | The current page's context |
| `selectedRow` | The selected row, when the form is used inside a table |
| `http` | The HTTP client used to make API requests |
| `message` | Toast/notification messages shown to the user |
| `moment` | The Moment.js library, for working with dates and times |
| `fileSaver` | Helper for saving files from the browser |
| `application` | Access to application-level objects such as the current user and settings |

---

## Example

**Form type to use:** Edit Form - use when you need to capture the record's id from the URL before the form's own data has loaded.

**Example - Store the record id in global state before data loads:**

```javascript
// query.id is already available here, even though the record's data has not loaded yet
setGlobalState({ currentRecordId: query?.id });
```
