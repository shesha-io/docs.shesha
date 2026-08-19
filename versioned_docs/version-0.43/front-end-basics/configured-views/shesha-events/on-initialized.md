---
sidebar_label: On Initialized
---

# On Initialized

`On Initialized` is a form lifecycle event that runs your JavaScript code before the form loads its data from the server. It is the earliest point at which you can run code against a form, which makes it useful for setting up initial state, reading values passed in through navigation, or preparing anything the rest of the form's script code will depend on.

:::note Naming in the Form Designer
In the Form Settings panel, this event is now labelled **On Before Data Load** (`onBeforeDataLoad`). Forms built with the older **On Initialized** setting keep working. Shesha automatically converts them to use `onBeforeDataLoad`, keeping your existing code and running `form.setFieldsValue({...form.formArguments})` first so any values passed in via navigation are applied before your code runs.
:::

Running initialization code at this point avoids race conditions where later logic depends on setup that has not happened yet, and keeps that setup code in one clearly named place rather than scattered across the form.

---

## When Does It Get Triggered?

This event runs the first time the form loads, immediately before Shesha fetches any data for it. At this stage, the form's field values only contain whatever was passed in through `form.formArguments` (for example, an ID passed in the URL) - no entity data has been loaded yet.

:::warning
Because no API call has been made yet, `data` will not yet contain the loaded entity's values. If you need a value from the URL query string at this point, use `query` instead of waiting on `data`.
:::

---

## Available Variables

`On Initialized` has access to the same set of variables as the other form lifecycle events:

| Variable | Description |
|---|---|
| `data` | Current form field values. Not yet populated with loaded entity data at this point. |
| `initialValues` | The initial values supplied to the form. |
| `parentFormValues` | Values from the parent form, when this form is nested inside another. |
| `form` | The form instance, used to read or set field values (for example `form.setFieldsValue({...})`). |
| `query` | The query string parameters from the current URL. |
| `globalState` / `setGlobalState` | Read and update global state shared across the application. |
| `http` | The HTTP client used to call backend APIs. |
| `message` | Used to show toast notifications to the user. |
| `moment` | The Moment.js instance, used for date and time manipulation. |
| `pageContext` | Context for the current page. |
| `application` | Application-level context and utilities. |

---

## Example

**Form type to use:** Edit Form - use when the user is opening an existing record and you want to react to a value passed in through the URL before the record loads.

**Example - Pre-fill a field from a query string parameter:**

```javascript
// query.source is available immediately, before the entity has loaded
if (query.source) {
  form.setFieldsValue({ source: query.source });
}
```
