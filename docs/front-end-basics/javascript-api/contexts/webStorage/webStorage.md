---
sidebar_label: Web Storage
---

# Web Storage

**Web Storage** gives your form scripts access to the browser's storage, so you can persist small pieces of data either for the current browser tab (session storage) or across browser sessions (local storage). It's available anywhere the standard script variables are available, alongside contexts such as `formContext` and `pageContext`.

---

## Accessing Web Storage

Session storage is available at:

```javascript
contexts.webStorage.session
```

Local storage is available at:

```javascript
contexts.webStorage.local
```

Both give you an object with the same set of methods, so everything below applies equally to `session` and `local`. They wrap the browser's own `sessionStorage` and `localStorage`, but are not the native objects themselves - they add automatic JSON serialization on top.

---

## Available Methods

| Method | What it does |
|---|---|
| `setItem(key, value)` | Stores `value` under `key`. The value is automatically serialized with `JSON.stringify`, so you can store objects and arrays directly, not just strings |
| `getItem(key)` | Retrieves the value stored under `key`, automatically parsed back from JSON into its original type |
| `removeItem(key)` | Removes the value stored under `key` |
| `clear()` | Removes everything stored |
| `key(index)` | Returns the name of the key at the given position |

:::warning length is not a live item count
Unlike the browser's native `localStorage`/`sessionStorage`, `contexts.webStorage.local.length` and `contexts.webStorage.session.length` do not report how many items are stored. Reading `.length` is instead treated as looking up an item literally named `length`, so it will return `null` unless you have actually stored something under that key. If you need a count of stored items, track it yourself.
:::

You can also read and write values directly by referring to them as named properties, instead of calling `getItem`/`setItem` explicitly:

```javascript
contexts.webStorage.local.author = { name: 'Shesha' }; // same as setItem('author', { name: 'Shesha' })
const author = contexts.webStorage.local.author; // same as getItem('author')
```

---

## Example

**Form type to use:** Edit Form - or any form type, since Web Storage is available everywhere standard script variables are.

**Example - Save and read a value from local storage:**

```javascript
// values are serialized automatically, so objects and arrays are stored as-is
contexts.webStorage.local.setItem('author', { name: 'Shesha', role: 'admin' });

// getItem parses the stored JSON back into its original type
const author = contexts.webStorage.local.getItem('author');
```
