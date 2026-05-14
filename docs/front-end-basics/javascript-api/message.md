---
sidebar_label: Message
---

# Message

The `message` object lets you show brief toast notifications to the user from inside any Shesha script. Use it to confirm that an action succeeded, alert the user to a problem, or surface useful information without blocking the page with a modal.

It is based on the [Ant Design message API](https://ant.design/components/message).

:::info
Toast notifications appear at the top of the screen and disappear automatically after a few seconds. They are not blocking - the user can continue interacting with the form while a message is visible.
:::

---

## Methods

| Method | When to use |
|---|---|
| `message.success(content, duration?, onClose?)` | Confirm that an operation completed successfully |
| `message.error(content, duration?, onClose?)` | Tell the user something went wrong |
| `message.info(content, duration?, onClose?)` | Provide neutral information that does not require action |
| `message.warning(content, duration?, onClose?)` | Alert the user to something that needs their attention |

---

## Parameters

Each method accepts the same three parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | Yes | The text to display in the toast |
| `duration` | `number` or `function` | No | How long the toast stays visible, in seconds. Defaults to 3 seconds. Pass `0` to keep it visible until dismissed. Pass a function to run when the toast closes. |
| `onClose` | `function` | No | A callback that runs when the toast is dismissed |

---

## message.success

Use `success` to confirm that a user action completed without errors.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Show a confirmation for 5 seconds:**

```javascript
message.success('Invoice submitted for approval.', 5);
```

---

## message.error

Use `error` to tell the user that something went wrong. This is the most prominent message type.

**Form type to use:** Any form that calls an API and needs to handle failures.

**Example - Show an error when an API call fails:**

```javascript
try {
  await http.post('/api/services/app/Orders/Submit', { id: data.id });
  message.success('Order submitted.');
} catch (e) {
  message.error('Failed to submit the order. Please try again.');
}
```

---

## message.info

Use `info` for neutral context that helps the user understand what is happening.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Inform the user why a field is disabled:**

```javascript
message.info('This record is locked because it has already been approved.');
```

---

## message.warning

Use `warning` to alert the user to something that needs their attention but is not a hard error.

**Form type to use:** Create Form - use when the user is creating a new record.

**Example - Warn about a value that may cause issues downstream:**

```javascript
if (data.discountPercent > 50) {
  message.warning('Discounts above 50% require manager approval before submission.');
}
```

:::tip
Use `message.success` and `message.error` as a pair around any `try/catch` block that calls an API. This gives users clear feedback on whether their action worked.
:::
