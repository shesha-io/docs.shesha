---
sidebar_label: JavaScript API Plugins
---

# JavaScript API Plugins

Shesha lets you extend the JavaScript API available in scripts by registering custom plugins. A plugin adds a named object to the `application` context that your scripts can call just like the built-in APIs. Use this when your application has shared logic - such as business rules, utility functions, or stateful services - that you want to access from any form script.

---

## How It Works

You register a plugin using the `useApplicationPlugin` hook from `@shesha-io/reactjs`. The hook takes a name, a metadata builder function, and a data object. Once registered, the plugin is available in scripts as `application.[pluginName]`.

The plugin is automatically unregistered when the component that registered it unmounts.

---

## useApplicationPlugin

```typescript
import { useApplicationPlugin } from '@shesha-io/reactjs';
```

The hook accepts a single `ApplicationPluginRegistration` object:

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | The key used to access the plugin on `application` - e.g. `'myPlugin'` makes it available as `application.myPlugin` |
| `buildMetadata` | `function` | Yes | Defines the plugin's shape for script editor autocomplete. Receives `apiBuilder` and `metadataBuilder` |
| `data` | `any` | Yes | The runtime object exposed as the plugin - typically a class instance or object with methods |

---

## Registering a Plugin

Wrap your plugin in a React component that calls `useApplicationPlugin`. Place this component high in your component tree so the plugin is available to all forms.

**Example - Register a plugin that exposes a custom calculation service:**

```typescript
import React, { FC, PropsWithChildren, useState } from 'react';
import { useApplicationPlugin } from '@shesha-io/reactjs';

interface IMyPluginApi {
  calculateTax: (amount: number, rate: number) => number;
}

class MyPluginApi implements IMyPluginApi {
  calculateTax(amount: number, rate: number): number {
    return amount * (rate / 100);
  }
}

export const MyApplicationPlugin: FC<PropsWithChildren> = ({ children }) => {
  const [pluginApi] = useState<IMyPluginApi>(() => new MyPluginApi());

  useApplicationPlugin({
    name: 'myPlugin',
    buildMetadata: (apiBuilder) => {
      apiBuilder.addObject('myPlugin', 'My Plugin API', (builder) => {
        // Define the shape of the plugin for autocomplete
      });
    },
    data: pluginApi,
  });

  return <>{children}</>;
};
```

---

## Using the Plugin in Scripts

Once registered, call the plugin from any form script using `application.[pluginName]`:

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Call the custom tax calculation from a form script:**

```javascript
const tax = application.myPlugin.calculateTax(data.subTotal, 15);
form.setFieldsValue({ taxAmount: tax });
```

---

## buildMetadata

The `buildMetadata` function receives two arguments: `apiBuilder` (an `IObjectMetadataBuilder`) and `metadataBuilder` (an `IMetadataBuilder`). Use these to describe the plugin's structure so the script editor can provide autocomplete suggestions.

| Builder Method | What it defines |
|---|---|
| `apiBuilder.addObject(path, label, builder)` | Adds a nested object with its own properties |

:::info
The `buildMetadata` function only affects autocomplete in the script editor. It does not affect runtime behaviour. If you skip it or leave it empty, the plugin still works - the editor just will not suggest its methods.
:::
