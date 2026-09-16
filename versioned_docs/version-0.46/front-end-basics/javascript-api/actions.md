---
sidebar_label: Actions
sidebar_position: 1
title: Actions API
---

# Actions API

The `actions` object is how a script reaches out beyond the form. Use it to call an API, show a toast message, open a form in a dialog, ask the user a Yes/No question, or send the user to another page. It is available in every Shesha script.

---

## Calling an API

#### **actions.callApi** `object`

An HTTP client that already knows your application's base URL and sends the current user's authentication token, so you do not have to build either yourself.

It exposes one method per HTTP verb.

| Method | Signature |
|---|---|
| `get` | `get(url, config?)` |
| `post` | `post(url, data?, config?)` |
| `put` | `put(url, data?, config?)` |
| `patch` | `patch(url, data?, config?)` |
| `delete` | `delete(url, config?)` |
| `head` | `head(url, config?)` |
| `options` | `options(url, config?)` |

Every method returns a promise resolving to a response object with `data`, `status`, `statusText`, and `headers`. The body your API returned is on `response.data`.

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Create a record through a custom endpoint:**

```javascript
const executeScriptAsync = async () => {
  const payload = {
    name: form.data.name,
    author: form.data.author
  };

  try {
    const response = await actions.callApi.post('/api/services/app/Books/Create', payload);
    // The API's own response body sits on response.data.
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

The optional `config` argument tunes a single request.

| Option | Type | What it does |
|---|---|---|
| `headers` | `object` | Extra request headers |
| `omitStandardHeaders` | `boolean` | Sends the request without Shesha's standard headers |
| `timeout` | `number` | Request timeout in milliseconds |
| `responseType` | `string` | One of `arraybuffer`, `blob`, `document`, `json`, `text`, `stream`, `formdata` |
| `signal` | `AbortSignal` | Lets you cancel the request |

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Download a generated document as a file:**

```javascript
const onClickAsync = async () => {
  try {
    // responseType 'blob' keeps the binary intact instead of parsing it as JSON.
    const response = await actions.callApi.get(
      `/api/services/app/Statements/Download?id=${form.data.id}`,
      { responseType: 'blob' }
    );
    utils.saveAs(response.data, 'statement.pdf');
  } catch (error) {
    actions.showMessage.error('Could not download the statement.');
  }
};
```

:::tip Keep one API call per script
A script that makes a single call is far easier to debug than one that chains several. Where you need a follow-up step, make the call in the script and configure Handle Success or Handle Fail on the action to do the rest. See [Action Configurations](../configured-views/action-configurations.md).
:::

___

## Showing a Message

#### **actions.showMessage** `object`

Shows a short toast message at the top of the screen. It disappears on its own, so use it for feedback the user does not need to dismiss.

| Method | When to use |
|---|---|
| `success` | The action completed |
| `error` | The action failed |
| `warning` | The action completed but something needs attention |
| `info` | Neutral information |
| `loading` | A long-running action is in progress |

Each method takes the message text, an optional duration in seconds, and an optional callback that runs when the message closes.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Confirm a save to the user:**

```javascript
const onSubmitSuccess = () => {
  actions.showMessage.success('Your changes have been saved.');
};
```

___

## Opening a Dialog

#### **actions.showDialog(args)** `function`

Opens a Shesha form inside a modal dialog and returns a promise. The promise resolves with the form's values when the user submits, and rejects when the user cancels.

| Argument | Type | What it does |
|---|---|---|
| `formId` | `string` or `object` | The form to open, either its id or `{ name, module }` |
| `title` | `string` | The dialog title |
| `width` | `string` | `small`, `medium`, `large`, `full`, or a CSS size such as `60%` or `800px` |
| `mode` | `string` | `edit`, `readonly`, or `designer`. Defaults to `edit` |
| `formArguments` | `object` | Arguments passed through to the opened form |
| `initialValues` | `object` | Values the opened form starts with |
| `showCloseIcon` | `boolean` | Shows a close icon in the dialog header |
| `footerButtons` | `string` | `default`, `custom`, or `none` |

**Form type to use:** Table / List View - use when showing multiple records.

**Example - Capture a reason in a dialog before continuing:**

```javascript
const onClickAsync = async () => {
  try {
    const result = await actions.showDialog({
      formId: { name: 'rejection-reason', module: 'Membership' },
      title: 'Reason for rejection',
      width: '60%'
    });

    // result holds the values the user submitted in the dialog.
    await actions.callApi.post('/api/services/app/Applications/Reject', {
      id: form.data.id,
      reason: result.reason
    });
    actions.showMessage.success('Application rejected.');
  } catch {
    // The promise rejects when the user cancels the dialog, so there is nothing to do.
  }
};
```

#### **actions.showConfirmation(args)** `function`

Asks the user a Yes/No question and returns a promise resolving to `true` if they confirm and `false` if they cancel.

| Argument | Type | What it does |
|---|---|---|
| `title` | `string` | The dialog title |
| `content` | `string` | The question. This one is required |
| `okText` | `string` | Text on the confirm button. Defaults to `Yes` |
| `cancelText` | `string` | Text on the cancel button. Defaults to `No` |
| `okType` | `string` | `primary`, `default`, `dashed`, `link`, or `text`. Defaults to `primary` |

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Confirm before deleting:**

```javascript
const onClickAsync = async () => {
  const confirmed = await actions.showConfirmation({
    title: 'Delete record',
    content: 'Are you sure you want to delete this record? This cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel'
  });

  if (!confirmed) return;

  await actions.callApi.delete(`/api/services/app/Books/Delete?id=${form.data.id}`);
  actions.showMessage.success('Record deleted.');
};
```

:::danger Confirm before destructive actions
A confirmation dialog is the last thing standing between a user and a delete they cannot undo. Use one for any action that removes or overwrites data.
:::

___

## Navigating

#### **actions.navigateToUrl(url, queryParameters?)** `function`

Sends the user to a URL, with optional query string parameters supplied as an object.

```javascript
actions.navigateToUrl('/dynamic/Membership/members-list', { status: 'active' });
```

#### **actions.navigateToForm(formId, args?)** `function`

Sends the user to a Shesha form by its identifier, with optional arguments passed as query parameters.

```javascript
actions.navigateToForm({ name: 'member-details', module: 'Membership' }, { id: form.data.id });
```

:::warning navigateTo does not exist
There is no `navigateTo(...)` function in Shesha. Use `actions.navigateToUrl` or `actions.navigateToForm`, or the Navigate action type in the designer.
:::
