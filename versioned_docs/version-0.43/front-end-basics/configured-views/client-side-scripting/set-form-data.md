# SetFormData

This function is used to update the [form data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) as part of [executing a script](/docs/front-end-basics/configured-views/action-configurations#execute-script-accepts-javascript-expressions).

This function signature is a `TypeScript arrow function` that takes a single parameter, which is an object with two properties: `values` and `mergeValues`. Here's an explanation of each part:

- Function Parameters:
  `{ values: object, mergeValues: boolean }`: This specifies an object parameter with two properties.
  values: It expects an object `(values: object)`, indicating that you should pass an object as the values property.
  mergeValues: It expects a boolean (mergeValues: boolean), indicating that you should pass a boolean as the mergeValues property.

- Arrow Function Return Type:
  => `void`: This part indicates that the function returns `void`, meaning it does not return any value.

Putting it all together, the `SetFormData` function is expected to be called with an object parameter having two properties:<br/>

- `values`: An object containing data that needs to be set as form data.
- `mergeValues`: A boolean flag indicating whether to merge the new values with existing form data or replace them entirely.

## Setting a single value

```javascript
setFormData({
  values: {
    emailAddress: "admin@shesha.io",
  },
  mergeValues: true,
});
```

## Setting multiple values

```javascript
setFormData({
  values: {
    emailAddress: "admin@shesha.io",
    name: "Shesha",
  },
  mergeValues: true,
});
```

## Setting nested values

```javascript
setFormData({
  values: {
    organisation: {
      emailAddress: "admin@shesha.io",
      name: "Shesha",
    },
  },
  mergeValues: true,
});
```

# See Also

- [Form Data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data)
