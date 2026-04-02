# Modal API

The `modal` object provides methods for displaying various types of dialogs and modals to the user. This API is built on top of Ant Design's Modal component and provides Promise-based methods for handling user interactions.

## Available Methods

### `modal.showForm`

Displays a Shesha form inside a modal dialog. The method returns a Promise that resolves when the form is submitted successfully or rejects when the modal is cancelled.

```typescript
modal.showForm<T = any>(args: ShowFormModalArgs) => Promise<T>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `formId` | `string \| FormIdentifier` | The identifier of the form to display. Can be a string path or an object with `name` and `module` properties. | Yes |
| `title` | `string` | The title displayed in the modal header. | No |
| `width` | `ModalWidth` | The modal width. Can be `'small'` (40%), `'medium'` (60%), `'large'` (80%), `'full'` (100%), or a custom value like `'800px'` or `'60%'`. | No |
| `mode` | `FormMode` | The form mode. Can be `'edit'` or `'readonly'`. Defaults to `'edit'`. | No |
| `formArguments` | `any` | Arguments to pass to the form. | No |
| `initialValues` | `any` | Initial values for the form fields. | No |
| `showCloseIcon` | `boolean` | Whether to show the close icon in the modal header. Defaults to `true`. | No |
| `footerButtons` | `string` | Footer buttons configuration. Can be `'default'`, `'custom'`, or `'none'`. Defaults to `'default'`. | No |

**Example:**

```typescript
// Show a form and wait for the result
try {
  const result = await modal.showForm({
    formId: { name: 'person-details', module: 'my-app' },
    title: 'Edit Person',
    width: 'large',
    mode: 'edit',
    initialValues: { firstName: 'John', lastName: 'Doe' }
  });
  console.log('Form submitted with:', result);
} catch (error) {
  console.log('Form was cancelled');
}
```

---

### `modal.confirm`

Displays a confirmation dialog with Yes/No buttons. Returns a Promise that resolves to `true` if the user clicks "Yes", or `false` if they click "No" or close the dialog.

```typescript
modal.confirm(args: ConfirmModalArgs) => Promise<boolean>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The dialog title. Defaults to `'Confirm'`. | No |
| `content` | `string` | The message content to display. | Yes |
| `okText` | `string` | Text for the OK/Yes button. Defaults to `'Yes'`. | No |
| `cancelText` | `string` | Text for the Cancel/No button. Defaults to `'No'`. | No |
| `okType` | `string` | Type of the OK button. Can be `'primary'`, `'default'`, `'dashed'`, `'link'`, or `'text'`. Defaults to `'primary'`. | No |

**Example:**

```typescript
const confirmed = await modal.confirm({
  title: 'Delete Record',
  content: 'Are you sure you want to delete this record? This action cannot be undone.',
  okText: 'Delete',
  cancelText: 'Cancel',
  okType: 'primary'
});

if (confirmed) {
  // Proceed with deletion
  await deleteRecord();
} else {
  // User cancelled
  console.log('Deletion cancelled');
}
```

---

### `modal.success`

Displays a success message dialog with an OK button.

```typescript
modal.success(args: AlertModalArgs) => Promise<void>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The dialog title. Defaults to `'Success'`. | No |
| `content` | `string` | The message content to display. | Yes |
| `okText` | `string` | Text for the OK button. Defaults to `'OK'`. | No |

**Example:**

```typescript
await modal.success({
  title: 'Operation Complete',
  content: 'The record has been successfully saved.'
});
```

---

### `modal.error`

Displays an error message dialog with an OK button.

```typescript
modal.error(args: AlertModalArgs) => Promise<void>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The dialog title. Defaults to `'Error'`. | No |
| `content` | `string` | The error message to display. | Yes |
| `okText` | `string` | Text for the OK button. Defaults to `'OK'`. | No |

**Example:**

```typescript
await modal.error({
  title: 'Operation Failed',
  content: 'Unable to save the record. Please try again later.'
});
```

---

### `modal.warning`

Displays a warning message dialog with an OK button.

```typescript
modal.warning(args: AlertModalArgs) => Promise<void>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The dialog title. Defaults to `'Warning'`. | No |
| `content` | `string` | The warning message to display. | Yes |
| `okText` | `string` | Text for the OK button. Defaults to `'OK'`. | No |

**Example:**

```typescript
await modal.warning({
  title: 'Unsaved Changes',
  content: 'You have unsaved changes that will be lost if you navigate away.'
});
```

---

### `modal.info`

Displays an informational message dialog with an OK button.

```typescript
modal.info(args: AlertModalArgs) => Promise<void>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The dialog title. Defaults to `'Information'`. | No |
| `content` | `string` | The informational message to display. | Yes |
| `okText` | `string` | Text for the OK button. Defaults to `'OK'`. | No |

**Example:**

```typescript
await modal.info({
  title: 'Update Available',
  content: 'A new version of the application is available. Please refresh to update.'
});
```

---

### `modal.showContent`

Displays a modal with custom content (HTML or React elements). The method returns a Promise that resolves when the modal is closed with a positive result or rejects when cancelled.

```typescript
modal.showContent<T = any>(args: ShowContentModalArgs) => Promise<T>
```

**Arguments:**

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | `string` | The modal title. | No |
| `content` | `string` | The custom content to display. Can be an HTML string or React elements. | Yes |
| `width` | `ModalWidth` | The modal width. Can be `'small'`, `'medium'`, `'large'`, `'full'`, or a custom value. | No |
| `showCloseIcon` | `boolean` | Whether to show the close icon in the modal header. Defaults to `true`. | No |
| `footer` | `string` | Custom footer content. | No |

**Example:**

```typescript
const result = await modal.showContent({
  title: 'Custom Dialog',
  content: '<div style="padding: 20px;"><h3>Hello World</h3><p>This is custom HTML content.</p></div>',
  width: 'medium'
});
```
---

## Common Patterns

### Sequential Dialogs

You can chain multiple modal calls together:

```typescript
const confirmed = await modal.confirm({
  title: 'Submit Form',
  content: 'Are you ready to submit?'
});

if (confirmed) {
  try {
    await submitData();
    await modal.success({
      title: 'Success',
      content: 'Your submission has been received.'
    });
  } catch (error) {
    await modal.error({
      title: 'Failed',
      content: 'Submission failed. Please try again.'
    });
  }
}
```

### Form Result Handling

When using `showForm`, the promise resolves with the form's submitted values:

```typescript
try {
  const result = await modal.showForm({
    formId: 'create-user',
    title: 'Create New User'
  });
  
  // result contains the form data
  console.log('New user created:', result);
  
  await modal.success({
    title: 'User Created',
    content: `User ${result.firstName} ${result.lastName} has been created successfully.`
  });
} catch {
  console.log('User creation cancelled');
}
```

### Error Handling with Modals

```typescript
try {
  await performRiskyOperation();
} catch (error) {
  await modal.error({
    title: 'Operation Failed',
    content: error.message || 'An unexpected error occurred.'
  });
}
```

