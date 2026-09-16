---
sidebar_label: Scripting API
sidebar_position: 0
title: Scripting API
---

# Scripting API

Every script you write in Shesha, whether it is an event handler on a component, an expression that decides if a field is visible, or an action behind a button, runs with the same set of objects already in scope. You do not import anything. You reference the object you need and the code editor offers accurate autocomplete and inline documentation for all of it.

---

## The Objects Available to a Script

| Object | What it gives you |
|---|---|
| [`form`](./form.md) | The current form: its data, its mode, its components, and the functions to read, update, and submit it |
| `formData` | The current form's field values. The same data as `form.data` |
| [`actions`](./actions.md) | Calling APIs, showing messages, opening dialogs, and navigating |
| [`utils`](./utils.md) | Helpers such as date handling, saving files, modals, and template evaluation |
| [`page`](./page.md) | Page-scoped state shared between the components on the current page, and the browser location |
| [`user`](./user.md) | The current user, their details, and their permission and role checks |
| [`storage`](./storage.md) | The browser's local and session storage |
| [`application`](./application/application.md) | Application-wide services: entities, settings, navigation, and application-scoped state |
| [`query`](./query.md) | The query string values of the current page URL |

---

## A First Example

Every object is available in every script, so a single handler can read the form, call an API, and tell the user what happened.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Approve a record and confirm the result to the user:**

```javascript
const onClickAsync = async () => {
  // Ask the user to confirm before doing anything irreversible.
  const confirmed = await actions.showConfirmation({
    title: 'Approve application',
    content: 'Approve this application? The applicant will be notified.',
    okText: 'Approve',
    cancelText: 'Cancel'
  });

  if (!confirmed) return;

  try {
    await actions.callApi.post('/api/services/app/Applications/Approve', {
      id: form.data.id
    });
    actions.showMessage.success('Application approved.');
    form.submit();
  } catch (error) {
    form.setValidationErrors(error);
  }
};
```

---

## Moving From Older Script Names

Scripts written against earlier versions of Shesha keep running. The old names still resolve at runtime, so nothing breaks the moment you upgrade. They are no longer suggested or type-checked in the editor though, so you lose autocomplete and inline documentation until you move a script across.

| Old name | Use instead |
|---|---|
| `http.get(...)`, `http.post(...)` | `actions.callApi.get(...)`, `actions.callApi.post(...)` |
| `message.success(...)` | `actions.showMessage.success(...)` |
| `modal.showForm(...)` | `actions.showDialog(...)` or `utils.modal.showForm(...)` |
| `modal.confirm(...)` | `actions.showConfirmation(...)` or `utils.modal.confirm(...)` |
| `moment(...)` | `utils.moment(...)` |
| `fileSaver(...)` | `utils.saveAs(...)` |
| `pageContext.x` | `page.state.x` |
| `contexts.appContext.x` | `application.state.x` |
| `contexts.formContext.x` | `form.state.x` |
| `contexts.webStorage` | `storage.local` and `storage.session` |
| `globalState.x`, `setGlobalState(...)` | `page.state.x`, `application.state.x`, or `form.state.x` |
| `selectedRow` | `form.components` - read the DataTable or DataList component directly |
| `form.formMode` | `form.mode` |
| `form.formSettings` | `form.settings` |
| `form.formArguments` | `form.arguments` |
| `form.context` | `form.state` |
| `form.clearFieldsValue()` | `form.clear()` |
| `form.setFieldValue(name, value)` | `form.setFieldsValue({ name: value })` |

:::tip Migrate a script when you next edit it
There is no deadline and no bulk migration to run. The practical approach is to move a script to the new names the next time you open it, so you get autocomplete and type checking on the code you are actually working in.
:::

---

## Where Scripts Run

Scripts fall into two shapes, and the shape determines what your code has to return.

| Shape | Where you find it | What it must do |
|---|---|---|
| `Action scripts` | The Action Configuration section of clickable components, and event handlers such as On Change | Run an action. These are asynchronous, so use `async`/`await` with `try`/`catch` |
| `Expression scripts` | Settings that accept a JavaScript value, such as Visible, Interaction Mode, and Custom Validator | Return a value. The name starts with `get`, for example `getHidden` |

:::warning Expression scripts must return a value
An expression script that falls through without returning leaves the setting undefined, which usually reads as "off". Always return explicitly, even when returning `false`.
:::
