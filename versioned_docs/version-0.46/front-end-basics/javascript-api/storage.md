---
sidebar_label: Storage
sidebar_position: 4
title: Storage API
---

# Storage API

The `storage` object gives your scripts access to the browser's own storage, so you can keep small pieces of data either for the current browser tab or across browser sessions. Use it for things that belong to the user's browser rather than to your data, such as a remembered filter choice or a dismissed banner.

---

## Choosing Local or Session Storage

`storage` exposes two stores with the same set of methods.

| Store | How long the data lasts |
|---|---|
| `storage.local` | Across browser sessions. The data survives closing and reopening the browser |
| `storage.session` | For the current browser tab only. Closing the tab clears it |

Both wrap the browser's native `localStorage` and `sessionStorage`, but they are not the native objects. They add automatic JSON serialization, so you can store objects and arrays directly rather than stringifying them yourself.

---

## Methods

#### **setItem(key, value)** `function`

Stores `value` under `key`. The value is serialized with `JSON.stringify` automatically.

#### **getItem(key)** `function`

Retrieves the value stored under `key`, parsed back from JSON into its original type.

#### **removeItem(key)** `function`

Removes the value stored under `key`.

#### **clear()** `function`

Removes everything from that store.

#### **key(index)** `function`

Returns the name of the key at the given position.

---

## Reading and Writing

**Form type to use:** Edit Form - or any form type, since `storage` is available in every script.

**Example - Save and read a value from local storage:**

```javascript
// Values are serialized automatically, so objects and arrays are stored as they are.
storage.local.setItem('preferredView', { layout: 'cards', pageSize: 25 });

// getItem parses the stored JSON back into its original type.
const preferences = storage.local.getItem('preferredView');
```

You can also read and write values as named properties instead of calling the methods.

```javascript
storage.local.preferredView = { layout: 'cards' }; // same as setItem
const preferences = storage.local.preferredView;   // same as getItem
```

:::warning length is not a count of stored items
`storage.local.length` and `storage.session.length` do not report how many items are stored. Reading `.length` is treated as looking up an item literally named `length`, so it returns `null` unless you stored something under that key. Track a count yourself if you need one.
:::

:::note Storage is per browser, not per user
Anything in `storage` lives in the browser on the machine in front of the user. It does not follow them to another device, and it is not sent to the back-end. For data that has to persist properly, save it against a record or a user setting instead. See [Settings](./application/settings/settings.md).
:::

---

## Moving From contexts.webStorage

Scripts written against earlier versions of Shesha reached this through `contexts.webStorage`. That still resolves at runtime, so existing scripts keep working, but it is no longer suggested or type-checked in the editor.

| Old | Use instead |
|---|---|
| `contexts.webStorage.local` | `storage.local` |
| `contexts.webStorage.session` | `storage.session` |
