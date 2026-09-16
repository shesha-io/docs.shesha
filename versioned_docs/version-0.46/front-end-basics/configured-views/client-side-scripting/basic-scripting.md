---
sidebar_label: Basic Scripting
title: Basic Scripting
---

# Basic Scripting

Scripting is how you add behaviour to a configured view that the designer settings alone cannot express: calling an API when a button is clicked, hiding a field unless another one has a particular value, or calculating a total as the user types. All scripting is done in JavaScript, and a standard set of objects is already in scope so you never have to import anything.

---

## The Two Kinds of Script

Where a script lives determines what it has to do.

| Kind | Where you find it | What it must do |
|---|---|---|
| `Action scripts` | The Action Configuration section of clickable components such as buttons, and event handlers such as On Change | Run an action. They are asynchronous, so use `async`/`await` with `try`/`catch` |
| `Expression scripts` | Settings that take a JavaScript value, such as Visible, Interaction Mode, and Custom Validator | Return a value. Their names start with `get`, for example `getHidden` |

:::warning Expression scripts must return a value
An expression script that finishes without returning leaves the setting undefined, which usually reads as "off". Return explicitly on every path, even when returning `false`.
:::

---

## What Is Available to a Script

Every script runs with the same objects in scope. The full reference is in the [Scripting API](../../javascript-api/scripting-api.md), and the short version is:

| Object | What you use it for |
|---|---|
| `form` | The current form: its data, mode, state, and components |
| `formData` | The form's field values, the same as `form.data` |
| `actions` | Calling APIs, showing messages, opening dialogs, navigating |
| `utils` | Dates, saving files, modals, template evaluation |
| `page` | Page-scoped shared state and the browser location |
| `user` | The signed-in user and their permissions |
| `storage` | Browser local and session storage |
| `application` | Entities, settings, navigation, and application-wide state |
| `query` | Query string values from the page URL |

---

## Making API Calls

Action scripts are asynchronous, so use `async`/`await` with `try`/`catch` to handle the result.

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Create a record through a custom endpoint:**

```javascript
const executeScriptAsync = async () => {
  const bookData = {
    name: form.data.name,
    author: form.data.author,
    genre: form.data.genre
  };

  try {
    const response = await actions.callApi.post('/api/services/app/Books/Create', bookData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

:::warning Throw to trigger the fail handler
Handle Fail responds to a rejected promise, not to a successful one that happens to carry a failure flag. If your own logic decides the call failed, `throw new Error(...)` so the fail handler actually runs.
:::

:::tip Keep one API call per script
Rather than chaining requests and showing messages by hand, make a single call in the script and configure Handle Success or Handle Fail to do the follow-up. One call per script is far easier to debug, and it avoids the case where a second call finishes before the first. Where the steps need to share data, put it in `page.state`.
:::

:::tip Consider the API Call action instead
For a straightforward request you may not need a script at all. See the [API Call action](../action-configurations.md#api-call). To reshape the payload before it is submitted, use the form's [Prepared Values](../shesha-events/prepared-values.md) event.
:::

For the full HTTP client reference, see [Actions API](../../javascript-api/actions.md).

---

## Shaping Data Before Submitting

It is often useful to change the form data before it goes to the back-end, for example to submit a calculated value or to drop a property your API does not accept.

:::tip Keep working values off the form
Rather than adding a field to the form and stripping it out again before posting, bind the component to a data context instead. See [Data Contexts](../../javascript-api/data-contexts.md).
:::

### Object Destructuring

[Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring) picks out the properties you want, or removes the ones you do not.

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Send only the name fields to an API:**

```javascript
const getPreparedValues = () => {
  // Pull out the three properties the API accepts and ignore the rest.
  const { name, middlename, lastname } = form.data;
  return { name, middlename, lastname };
};
```

**Example - Send everything except one property:**

```javascript
const getPreparedValues = () => {
  // The rest operator collects everything that was not named, so organisation is dropped.
  const { organisation, ...payload } = form.data;
  return payload;
};
```

### Adding a Calculated Property

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Add a calculated tax value to the payload:**

```javascript
const getPreparedValues = () => {
  // Spread the existing values, then add the calculated one alongside them.
  return { ...form.data, tax: 0.5 * form.data.salary };
};
```

---

## Hiding and Disabling Components

Expression scripts are how a component changes based on what is happening on the form. The **Visible** setting takes a script that returns `true` to show the component.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Show a field only once a category has been chosen:**

```javascript
const getVisible = () => {
  return Boolean(form.data.category);
};
```

**Example - Hide a button after too many attempts:**

```javascript
const getVisible = () => {
  // Page state survives while the user stays on this page.
  return (page.state.numTries ?? 0) < 10;
};
```

To control whether a component can be edited rather than whether it is shown, use the **Interaction Mode** setting instead. See [Common Component Properties](../../form-components/common-component-properties.md).

---

## Seeing What a Script Has Access To

The quickest way to find out what you can reach from a particular handler is the code editor itself. Start typing and its autocomplete lists the objects available in that exact place, with inline documentation for each. Because the scripting API is typed, what the editor offers is what the script actually gets.

To inspect the values at runtime, log the object you are interested in and read the output in your browser's developer console.

```javascript
const getVisible = () => {
  console.log('LOG::getVisible:formData: ', formData);
  return true;
};
```

:::note Logging a whole object shows a proxy
Shesha wraps script variables in proxies so it can track which values a setting depends on. Logging one directly shows the proxy rather than the data. See [Output the Data Object](../../debugging-scripts/output-the-data-object.md) for how to unwrap it, and [Proxying Input Variables](./script-variables-proxy.md) for why the proxies are there.
:::

---

## Navigating to Another Page

Use the `actions` object rather than manipulating the browser location directly, so navigation stays inside the application and its routing conventions are applied.

**Example - Navigate to a URL:**

```javascript
actions.navigateToUrl('/dynamic/Membership/members-list', { status: 'active' });
```

**Example - Navigate to a form:**

```javascript
actions.navigateToForm({ name: 'member-details', module: 'Membership' }, { id: form.data.id });
```

:::warning navigateTo does not exist
There is no `navigateTo(...)` function. Use `actions.navigateToUrl` or `actions.navigateToForm`, or the Navigate action type in the designer.
:::

### Reloading the Current Page

```javascript
window.location.reload();
```
