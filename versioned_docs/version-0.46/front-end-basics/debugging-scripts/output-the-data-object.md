---
sidebar_label: Output the Data Object
---

# Output Data Object to Console

When debugging front-end scripts, you might notice that logging objects such as `data` or `form` does not display the expected values. This occurs because these variables are wrapped in **proxy objects** used by the framework to track dependencies and optimize rendering.

Below are practical techniques for correctly inspecting and debugging these data objects.

## Overview

When working with front-end components, some properties - like `Hidden`, `Disabled`, or `Calculated` - can be configured using JavaScript executable functions.
These functions often rely on variables such as `data` and `form`, and can also reach data shared elsewhere on the page or application (through `page.state` and `application.state`).
To improve performance, the framework uses *proxying* to monitor dependencies and avoid unnecessary re-rendering.

However, because of this proxy mechanism, directly logging these variables to the console does not show their actual values.
This guide outlines how to correctly inspect these objects for debugging purposes.

## Understanding Proxy Objects

Proxy objects are used to detect which fields your JavaScript property functions depend on. This ensures that only components affected by a data change are re-rendered.

For example:

```js
return data.firstName?.length > 3;
```

In this case, only changes to the `firstName` field will trigger re-rendering for the dependent component, not other fields like `lastName`.

However, when logging proxied variables, for example:

```js
console.log(data);
console.log(JSON.stringify(data));
```

the console output will show the **proxy wrapper** instead of the real field values.
This is expected behavior and not an error.

## Accessing the Real Data Object

To log or inspect the actual data structure, you can use one of the following approaches.

### Using `test.getArguments(context)`

Every property function (`Hidden`, `Disabled`, `Calculated`, and similar scripted settings) runs inside an implicit `context` object that holds all the values available to the script - `data`, `form`, `page`, `application`, `actions`, `utils`, and more. A `test.getArguments(...)` helper is exposed on this object specifically for unwrapping it during debugging.

:::warning Pass `context`, not `arguments`
Passing the JavaScript built-in `arguments` object, as in `test.getArguments(arguments)`, does **not** return the individual `data`/`form` values - it returns a single-element array containing the whole, still-wrapped `context` object, which is not useful for inspection. Pass the `context` identifier itself instead.
:::

```js
console.log(test.getArguments(context));
```

This returns an array with one small object per exposed value (`{ data: {...} }`, `{ form: {...} }`, `{ page: {...} }`, and so on), each already unwrapped from its proxy. Log the whole array to see everything at once, or pull out a specific one:

```js
const args = test.getArguments(context);
const dataEntry = args.find((a) => 'data' in a);
console.log('Raw data:', dataEntry?.data);
```

### Using the `_data` property

For property-level scripts (`Hidden`, `Disabled`, `Calculated`), the `data` and `form` objects passed into the script also expose their real, unwrapped value directly through a `_data` field:

```js
console.log(data._data);
console.log(form._data);
```

:::note
This works because these particular objects are backed by the framework's `TouchableProperty` wrapper, which stores the real value on `_data`. It is not guaranteed to work on every proxied object you might encounter elsewhere in the framework - if `_data` comes back `undefined`, use `test.getArguments(context)` instead.
:::

## Log Only What You Need

Avoid logging entire objects, as they may be large and slow down your console.
Instead, focus on specific fields or computed values:

```js
console.log("First name:", data.firstName);
console.log("Hidden status:", data.description);
```

This approach keeps console output relevant and makes debugging faster.

## Using `debugger` for Inspection

You can pause execution to inspect live variable states in your browser's DevTools:

```js
debugger;
return data.firstName?.length > 3;
```
When the code pauses, hover over variables like `data` or `context` to explore their properties interactively.

This method allows you to examine proxy structures and confirm which data points are triggering re-renders.

## Common Pitfalls

- **Do not use** `JSON.stringify(data)` on proxies - the output will not reflect the actual data.
- Avoid logging deeply nested structures to prevent circular reference errors.
- Avoid mutating deeply nested proxy objects directly, as it may not trigger proper re-rendering.
- Be careful when copying proxy objects - cloning or serializing them may cause unexpected behavior.
