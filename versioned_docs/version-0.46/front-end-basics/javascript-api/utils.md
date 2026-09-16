---
sidebar_label: Utils
sidebar_position: 2
title: Utils API
---

# Utils API

The `utils` object holds the general-purpose helpers a form script tends to reach for: working with dates, saving a file to the user's machine, opening a modal, and filling placeholders in a template string. It is available in every Shesha script.

---

## Working With Dates

#### **utils.moment** `function`

The [Moment.js](https://momentjs.com/docs/) library, used for parsing, formatting, comparing, and doing arithmetic on dates. Shesha stores and transmits dates in ISO format, and Moment is what turns those into something you can display or calculate with.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Calculate an age from a date of birth:**

```javascript
const getAge = () => {
  if (!form.data.dateOfBirth) return null;
  // diff with 'years' truncates, which is what "age" means in practice.
  return utils.moment().diff(utils.moment(form.data.dateOfBirth), 'years');
};
```

**Example - Format a date for display:**

```javascript
const getText = () => {
  if (!form.data.startDate) return '';
  return utils.moment(form.data.startDate).format('DD MMM YYYY');
};
```

___

## Saving a File

#### **utils.saveAs(data, filename?)** `function`

Prompts the user to save data to a file on their machine. `data` is either a `Blob` (typically the body of an API response fetched with `responseType: 'blob'`) or a string.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Save an API response as a file:**

```javascript
const onClickAsync = async () => {
  const response = await actions.callApi.get(
    `/api/services/app/Reports/Export?id=${form.data.id}`,
    { responseType: 'blob' }
  );
  utils.saveAs(response.data, 'report.xlsx');
};
```

___

## Opening a Modal

#### **utils.modal** `object`

The full modal API. Where [`actions.showDialog`](./actions.md) and `actions.showConfirmation` cover the two common cases in a single call, `utils.modal` gives you the rest of the dialog types.

| Method | What it shows |
|---|---|
| `showForm(args)` | A Shesha form in a modal. Resolves with the submitted values, rejects on cancel |
| `confirm(args)` | A Yes/No question. Resolves to `true` or `false` |
| `info(args)` | An informational dialog with a single OK button |
| `success(args)` | A success dialog with a single OK button |
| `warning(args)` | A warning dialog with a single OK button |
| `error(args)` | An error dialog with a single OK button |
| `showContent(args)` | A dialog containing text or HTML you supply |

`showForm` takes the same arguments as [`actions.showDialog`](./actions.md), and `confirm` takes the same arguments as `actions.showConfirmation`.

The `info`, `success`, `warning`, and `error` methods take `title`, `content`, and an optional `okText`.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Explain a validation failure in a dialog:**

```javascript
const onClickAsync = async () => {
  if (!form.data.acceptedTerms) {
    await utils.modal.warning({
      title: 'Terms not accepted',
      content: 'You need to accept the terms and conditions before submitting.'
    });
    return;
  }
  form.submit();
};
```

#### **utils.modal.showContent(args)** `function`

Shows a dialog containing content you supply rather than a configured form.

| Argument | Type | What it does |
|---|---|---|
| `title` | `string` | The dialog title |
| `content` | `string` or `object` | The content. Pass a string for plain text, or `{ type: 'html', value: '...' }` for formatted HTML |
| `width` | `string` | `small`, `medium`, `large`, `full`, or a CSS size |
| `showCloseIcon` | `boolean` | Shows a close icon in the dialog header |
| `footer` | `string` | Custom footer content |

**Example - Show formatted HTML in a dialog:**

```javascript
const onClickAsync = async () => {
  await utils.modal.showContent({
    title: 'Policy summary',
    content: { type: 'html', value: '<p><strong>Cover:</strong> Comprehensive</p>' },
    width: '800px'
  });
};
```

:::warning Only pass HTML you control
Content passed as `{ type: 'html', ... }` is rendered as markup. Never build it from values a user typed in, or you open the page to a cross-site scripting attack. Pass a plain string instead and the content is shown literally.
:::

___

## Filling a Template

#### **utils.evaluateString(template, data, skipUnknownTags?)** `function`

Replaces [Mustache](https://mustache.github.io/) placeholders in a template string with values from a data object, and returns the result.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Build a URL from record values:**

```javascript
const getText = () => {
  return utils.evaluateString(
    'Reference {{reference}} for {{customer.name}}',
    form.data
  );
};
```

___

## Building a Form URL

#### **utils.getFormUrl(formId)** `function`

Returns the URL of a form without navigating to it. Useful when you want to render a link rather than move the user.

```javascript
const url = utils.getFormUrl({ name: 'member-details', module: 'Membership' });
```

#### **utils.prepareUrl(url)** `function`

Applies Shesha's URL conventions to a base URL, so a relative path resolves correctly wherever the application is hosted.

```javascript
const url = utils.prepareUrl('/dynamic/Membership/members-list');
```

:::note application.utils is a different object
`application.utils` also exposes `evaluateString`. The `utils` object documented here is the one available directly in scripts and covers the wider set of helpers. See [Application API](./application/application.md) for what sits under `application`.
:::
