# Web storage

It provides access to browser data storages (`sessionStorage` and `localStorage`)

To access session storage:

```Javascript
contexts.webStorage.session
```

To access local storage:

```Javascript
contexts.webStorage.local
```

These variables contain methods similar to those of the `window.localStorage` and `window.sessionStorage` objects.

```Javascript
clear() => void
```

```Javascript
getItem(key: string) => string
```

```Javascript
key(index: number) => string
```

```Javascript
// length (size) of the local / session storage
length => number
```

```Javascript
removeItem(key: string) => void
```

```Javascript
setItem(key: string, value: string) => void
```

You can save and access storage fields directly by referring to them by name and assigning values.

Example

```Javascript
const getExpression = () => {
  contexts.webStorage.local.setItem('author', 'Shesha'); // write
  const authorName = contexts.webStorage.local.getItem('author'); // read
}
```
