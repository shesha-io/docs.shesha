# Output Data Object to Console

When debugging front-end scripts, you might notice that logging objects such as `data`, `form`, or `context` does not display the expected values. This occurs because these variables are wrapped in **proxy objects** used by the framework to track dependencies and optimize rendering.

Below are practical techniques for correctly inspecting and debugging these data objects.
## Overview
When working with front-end components, some properties - like `Hidden`, `Disabled`, or `Calculated` - can be configured using JavaScript executable functions.  
These functions often rely on variables such as `data`, `form`, and `context`.  
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

To log or inspect the actual data structure, you can use one of the following approaches depending on the system version.

### Version 0.44 and Later

Use the `test.getArguments(arguments)` function to access the input variables without proxying:

```js
console.log(test.getArguments(arguments));
```

This returns an array of unproxied input variables (`data`, `form`, `context`, etc.).  
You can destructure them for clarity:

```js
const [data, form, context] = test.getArguments(arguments);
console.log("Raw data:", data);
```

### Versions Earlier than 0.44

Access the unproxied object directly through the `_data` property:

```js
console.log(data._data);
console.log(form._data);
console.log(pageContext._data);
```

## Log Only What You Need

Avoid logging entire objects, as they may be large and slow down your console.  
Instead, focus on specific fields or computed values:

```js
console.log("First name:", data.firstName);
console.log("Hidden status:", data.description);
```

This approach keeps console output relevant and makes debugging faster.

## Using `debugger` for Inspection

You can pause execution to inspect live variable states in your browser’s DevTools:

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
