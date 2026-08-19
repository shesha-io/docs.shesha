---
sidebar_label: Web Storage
---

# Web Storage

`contexts.webStorage` gives your form's script code access to the browser's storage, `sessionStorage` and `localStorage`. This lets a form remember small pieces of information between page reloads, or share a value between forms open in the same browser tab, without needing a round trip to the server.

---

## Accessing Web Storage

Session storage is cleared when the browser tab is closed, which makes it useful for values that should only last for the current visit.

```Javascript
contexts.webStorage.session
```

Local storage persists until it is explicitly cleared, which makes it useful for values that should survive across visits, such as a user's display preferences.

```Javascript
contexts.webStorage.local
```

---

## Available Methods

Both `contexts.webStorage.session` and `contexts.webStorage.local` expose methods similar to the standard `window.sessionStorage` and `window.localStorage` objects:

| Method | Description |
|---|---|
| `getItem(key: string)` | Returns the stored value for the given key, as a string. |
| `setItem(key: string, value: string)` | Stores a value under the given key. |
| `removeItem(key: string)` | Removes the value stored under the given key. |
| `clear()` | Removes all values from the storage. |
| `key(index: number)` | Intended to return the key at the given index. |
| `length` | Intended to return the number of items currently in the storage. |

:::warning
`key(index)` and `length` do not behave the same way as the native `Storage` API in the current version. `key(index)` always returns `undefined`, and reading `length` does not return the real item count. Avoid relying on either of these when working out how many items are stored or iterating over keys - use `getItem`/`setItem`/`removeItem` with keys you already know instead.
:::

You can also read and write values directly by referring to them as named properties, instead of calling `getItem`/`setItem` explicitly:

```Javascript
contexts.webStorage.local.author = 'Shesha'; // same as setItem('author', 'Shesha')
const author = contexts.webStorage.local.author; // same as getItem('author')
```

---

## Example

**Form type to use:** Edit Form - or any form type, since Web Storage is available everywhere standard script variables are.

**Example - Save and read back a value in local storage:**

```Javascript
contexts.webStorage.local.setItem('author', 'Shesha'); // write
const author = contexts.webStorage.local.getItem('author'); // read
```
