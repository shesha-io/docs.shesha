---
sidebar_label: Action Configurations
title: Action Configurations
---

# Action Configurations

Actions define what happens when a user interacts with a component - clicking a button, submitting a form, or selecting a row. Rather than writing code for every interaction, you configure actions through the designer by selecting an action type, filling in its settings, and optionally chaining a second action to run on success or failure.

When you open the action configurator on a component, you will always see three base groups: **Common**, **Configuration Items**, and **Form**. Depending on which component you are configuring, additional groups may also appear. Components such as the DataTable, Wizard, Drawer, SubForm, and DataList each register their own action group under their component name. These extra groups only appear when you are configuring an action on that component.

:::info
Every action has a **Handle Success** and **Handle Fail** toggle. Turning one on reveals an **On Success Handler** (or **On Fail Handler**) panel where you chain another action to run automatically after the first one completes. This lets you build multi-step flows - such as showing a confirmation, then navigating - without writing any script.
:::

---

## Common

Common actions are available on any component in any form.

### Show Confirmation Dialog

Show Confirmation Dialog displays a modal prompt asking the user to confirm before the next step proceeds. Configure this as the first action in a chain, with the actual operation placed in the `On Success` handler. If the user clicks confirm, the `On Success` action runs. If they cancel, nothing happens.

**Configuration fields:**
- **Title** - the heading shown inside the dialog, e.g. `Delete record?`.
- **Content** - the body text shown below the title, e.g. `This action cannot be undone.`.
- **Ok Text** - label for the confirm button. Defaults to `Yes`.
- **Cancel Text** - label for the cancel button. Defaults to `No`.
- **Danger** - a switch intended to control whether the confirm button renders in red.

![Image](./images/action6.png)

![Image](./images/action7.png)

:::warning
Show Confirmation Dialog does nothing on its own. The action to run after confirmation must be placed in the **On Success** handler. If you leave `On Success` empty, clicking confirm has no visible effect.
:::

:::note
On the current version, the confirm button always renders as a danger (red) button, regardless of the **Danger** switch's value. Do not rely on turning **Danger** off to get a non-red confirm button.
:::

---

### Show Dialog

Show Dialog opens a modal window and renders a configured form inside it. Use this when you need the user to complete a secondary task - filling in additional details, reviewing a record, or confirming information - without navigating away from the current page.

**Configuration fields:**
- **Title** - the heading displayed in the modal header.
- **Modal Form** - the form to render inside the dialog. Select from the form picker.
- **Form Mode** - `Edit` allows the user to make changes. `Read only` displays the form as a non-editable view.
- **Dialog Width** - a combo box with preset sizes: Small (40%), Medium (60%), Large (80%). You can also type any custom value directly into the box, e.g. `500px` or `70%`.
- **Arguments** - a JavaScript expression that evaluates to an object. The result is passed into the dialog form as its initial arguments. Variables from the current context (including `data`) are available.
- **Footer** - configure whether to show a footer and whether to use default buttons or custom ones.
- **Show Close Icon** - when enabled, a close button appears in the top-right corner of the modal.

<LayoutBanners url="https://app.guideflow.com/embed/lpnvw5xhjr" type={1}/>

![Image](./images/action8.png)


:::tip
Inside the dialog form, access the arguments object using the `formArguments` variable in any script or binding expression.
:::

:::note
When the dialog form is submitted, the result is available as `actionResponse` in any `On Success` action chained after Show Dialog.

```js
// On Success > Execute Script after Show Dialog:
form.setFieldsValue({ approvedBy: actionResponse?.approverName });
```
:::

---

### Close Dialog

Close Dialog closes the currently visible modal. Use this on buttons inside a dialog form - for example, a Cancel button that should dismiss the modal without submitting.

**Configuration fields:**
- **Show Dialog Result** - determines whether the dialog resolves as a success or failure when closed.
  - `Success` - the parent form's `On Success` handler fires after the dialog closes.
  - `Fail` - the parent form's `On Fail` handler fires after the dialog closes.

:::note
Close Dialog only works when triggered from inside an open modal. Using it outside a dialog has no effect.
:::

---

### Execute Script

Execute Script opens a code editor where you write JavaScript that runs when the action fires. Use this when no other action type covers what you need - for example, updating multiple fields at once, calling a utility function, or performing conditional logic before triggering something else.

**Configuration fields:**
- **Expression** - the JavaScript code to run.

:::info
The expression is evaluated asynchronously, so you can `await` calls such as `actions.callApi` requests directly in the script instead of chaining `.then(...)`. This applies to Execute Script on buttons and to scripts in other Action Configurations.
:::

The editor exposes a full list of variables available in the current context.

| Variable | Type | Description |
|---|---|---|
| `data` | `object` | Current form field values |
| `form` | `FormApi` | The current form: `form.data`, `form.mode`, `form.state`, `form.components`, and `form.setFieldsValue({ ... })` |
| `formData` | `object` | The same field values as `data` |
| `page.state` | `object` | Data shared by every component on the current page |
| `actions.callApi` | `object` | HTTP client for calling APIs. Exposes `get`, `post`, `put`, `patch`, and `delete` |
| `actions.showMessage` | `object` | Shows a toast notification: `success`, `error`, `warning`, `info`, `loading` |
| `actions.showDialog` | `function` | Opens a form in a modal and resolves with its values |
| `actions.showConfirmation` | `function` | Asks a Yes/No question and resolves to `true` or `false` |
| `utils.modal` | `object` | The full modal API, for info, warning, error, and custom-content dialogs |
| `utils.moment` | `function` | The Moment.js library, for working with dates and times |
| `utils.saveAs` | `function` | Saves a file on the client |
| `user` | `object` | The signed-in user and their permission checks |
| `storage` | `object` | Browser local and session storage |
| `query` | `object` | Query string values from the page URL |
| `application.state` | `object` | Data shared across the whole application |
| `actionResponse` | `object` | The result of the previous action in a chain (on success path) |
| `actionError` | `object` | The error from the previous action in a chain (on fail path) |

![Image](./images/updatedaction3.png)

![Image](./images/action4.png)

:::warning formMode is not a top-level variable
There is no bare `formMode` in the script context. Read the form mode with `form.mode`.
:::

:::warning setFormData is deprecated
To update form fields from a script, use `form.setFieldsValue({ fieldName: value })`.
:::

**Example - Build a full name from first and last name:**
```js
const first = data.firstName ?? '';
const last = data.lastName ?? '';
form.setFieldsValue({ fullName: `${first} ${last}`.trim() });
```

**Example - Fetch a related record and populate a field:**
```js
if (!data.organisationId) return;

const response = await actions.callApi.get(`/api/dynamic/Shesha/Organisation/Get`, {
  params: { id: data.organisationId }
});

form.setFieldsValue({
  organisationName: response.data.result.name
});
```

**Example - Show a message and record progress in page state:**
```js
page.state.stepOneComplete = true;
actions.showMessage.success("Step 1 completed.");
```

:::note
`actionResponse` and `actionError` are only populated when Execute Script is used as an `On Success` or `On Fail` handler after another action. They are `undefined` when Execute Script runs as a standalone action.
:::

_Read more about client-side scripting [here](./client-side-scripting/basic-scripting.md)_

---

### Show Message

Show Message displays a toast notification. Use this to give users feedback after an action completes - confirming a save, warning about a missing step, or reporting an error.

**Configuration fields:**
- **Message** - the text to display in the notification.
- **Type** - controls the appearance and icon of the toast: `info`, `success`, `error`, `warning`, or `loading`.

:::tip
Show Message works well as an `On Success` or `On Fail` handler after an API Call or Submit action. Chain it after the primary action to give users immediate feedback.
:::

---

### Sign In

Sign In triggers the Shesha authentication flow using the values currently entered in the form. It reads `username` and `password` (and optionally `rememberMe`) from the form data by property name, validates the form's fields, and then calls the login endpoint.

This action has no configuration fields. Place it on the submit button of a login form.

:::warning
Sign In reads credentials directly from the form. The form must have fields bound to `username` and `password` for this action to work correctly.
:::

---

### API Call

API Call triggers a backend endpoint without requiring custom JavaScript. Use this when you need to fire a specific API operation - such as running a server-side process, posting data, or fetching a value - and you want to keep the configuration visual.

**Configuration fields:**
- **HTTP Verb** - the request method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, or others.
- **URL** - the endpoint path. Use the autocomplete to pick from registered Shesha endpoints, or type a custom path.
- **Request Configuration** - opens a modal where you configure the request in detail:
  - **Params** - key-value pairs sent as query string (for GET/DELETE), or merged into the request body for other verbs - unless a Body is also configured below, in which case the params are added to the query string instead so they don't conflict with the body.
  - **Headers** - additional headers to include in the request.
  - **Body** - the request body type: `None`, `JSON`, `Form Data`, `x-www-form-urlencoded`, or `Raw` (with a text, JSON, XML, HTML, or executable JavaScript sub-type). A JSON or raw body can reference the current script context using Mustache syntax, e.g. `{{data.firstName}}`.
  - **Response Transformation** - an optional script that runs after the response comes back, with the raw response available as `response`, letting you reshape the result before it becomes `actionResponse` for chained actions.
- **Send Standard Headers** - when enabled, Shesha adds its standard authentication and content-type headers automatically. Leave this on unless you have a reason to override headers manually.

![Image](./images/action5.png)

:::tip
The result of an API Call is available as `actionResponse` in any `On Success` Execute Script action chained after it.

```js
// In an On Success > Execute Script action chained after API Call:
const result = actionResponse?.result;
form.setFieldsValue({ confirmationCode: result?.code });
```
:::

:::warning
For GET and DELETE requests, Shesha encodes the parameters as query string values. For other verbs, parameters are merged into the request body alongside anything set in the Body tab. Make sure your verb matches how your endpoint expects to receive data.
:::

---

### Navigate

Navigate sends the user to a different page. You choose the destination either by selecting a configured form from the form picker, or by entering a URL directly.

**Configuration fields:**
- **Navigation Type** - choose `Form` to pick a form by name, or `URL` to enter a path directly.
- **Form** - appears when type is `Form`. Select the target form from the autocomplete.
- **Target URL** - appears when type is `URL`. Enter the path, e.g. `/persons/details`.
- **Query String Parameters** - a list of parameters appended to the URL as query string values. Each row has a Key and a Value. The Value is written in the expression editor, so it offers autocomplete over the objects available to the action, for example `data.id`.

![Image](./images/action1.png)

:::note
Dynamic values can be used to construct the navigation path dynamically. Variables such as `data`, `page.state`, and, on a table row action, `selectedRow` are available depending on where the action is configured.
:::

![Image](./images/action2.png)

:::warning
Do not use `navigateTo(...)` in any Execute Script action. This function does not exist in Shesha. To navigate from a script, use `actions.navigateToUrl` or `actions.navigateToForm`, or use the Navigate action type instead.
:::

_Read more about Shesha objects [here](/docs/0.46/category/shesha-objects)_

---

## Configuration Items

The Configuration Items group contains actions for working with Shesha configuration items, such as forms and reference lists, from within a form.

:::info
Configuration items are now versioned automatically in the [Configuration Studio](../../fundamentals/configuration-studio/index.md). The older draft, ready, and publish workflow has been removed, so there are no longer actions to create a new version, mark an item as ready, publish a version, or cancel a version.
:::

### Download as JSON

Download as JSON exports a single configuration item directly as a JSON file. Use this to back up an item or transfer it manually between environments.

**Configuration fields:**
- **Item ID** - the unique identifier of the configuration item to download.

---

### Export items

Export items opens a modal for building and downloading a configuration package containing multiple configuration items. Use this to bundle several items together, for example when moving a set of forms and reference lists between environments.

This action has no configuration fields - it opens the export dialog, where you choose the items to include.

---

### Import items

Import items opens a modal for uploading and applying a configuration package that was previously exported. Use this to bring a bundle of configuration items into the current environment.

This action has no configuration fields - it opens the import dialog, where you choose the package to apply.

---

## Form

Form actions control the state and data of the form the user is currently on. They are only available when configuring a component inside a form.

### Start Edit

Start Edit switches the form from read-only mode into edit mode. Use this on an Edit button in a details view where users should be able to view a record first and only edit it when they choose to.

This action has no configuration fields. It stores the current form data internally so that Cancel Edit can restore it if the user changes their mind.

---

### Cancel Edit

Cancel Edit discards all unsaved changes, restores the field values to what they were when Start Edit was clicked, and returns the form to read-only mode.

This action has no configuration fields.

:::warning
Cancel Edit does not call any API. It only resets the in-memory form state. Any data the user typed is lost. Do not use Cancel Edit as a substitute for Reset - they behave differently. Reset clears the form to its initial values; Cancel Edit restores the values captured when Start Edit last ran.
:::

---

### Submit

Submit validates the form and sends the current field values to the backend using the form's configured submit settings.

This action has no configuration fields.

:::note
Submit triggers full form validation before sending. If any required field is empty or any validation rule fails, the submit is blocked and errors are shown inline. Use Validate if you want to check validity without submitting.
:::

:::tip
Chain an `On Success` action after Submit to navigate the user to a details view, show a confirmation message, or close a dialog.
:::

---

### Reset

Reset clears all field values and returns the form to its initial values. Use this on a Clear or Start Over button.

This action has no configuration fields.

:::warning
Reset removes all unsaved input on the form. This is not the same as Cancel Edit. Use Cancel Edit on an edit form if you want to restore the previously saved values. Use Reset only when you genuinely want to clear the form back to its initial values.
:::

---

### Refresh

Refresh re-fetches the current record from the backend and reloads all field values from the server response. Use this when the underlying data may have changed since the form was opened.

This action has no configuration fields.

:::warning
Refresh overwrites whatever the user has typed with the server's current values. Any unsaved input is lost. Only trigger this when you are certain the user's changes should be discarded.
:::

---

### Validate

Validate runs the form's validation rules and displays any errors inline - without submitting the form to the backend. Use this to check whether the form is in a valid state before enabling a next step or proceeding in a wizard.

This action has no configuration fields. If validation passes, the `On Success` handler runs. If it fails, the `On Fail` handler runs.

:::tip
Chain Validate before a multi-step operation when you want to confirm data integrity before committing. For example: Validate → On Success → Submit.
:::

---

### Set validation errors

Set validation errors reads the error from the previous action in a chain and displays it on the Validation Errors component attached to the form. Use this as an `On Fail` handler after Submit or API Call to surface a server-side error in a consistent location on the form.

This action has no configuration fields. It must be used in an `On Fail` chain - it has no effect as a standalone action.

---

### Reset validation errors

Reset validation errors clears any errors currently shown on the Validation Errors component. Use this to clean up error state when the user corrects their input and tries again.

This action has no configuration fields.
