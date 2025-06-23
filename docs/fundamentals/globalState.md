---
sidebar_label: GlobalState
---

# GlobalState

GlobalState in Shesha allows you to store and access shared state across your application.

### Overview

GlobalState can be set or consumed by opening any codeEditor or js.
![Image](./images/globalstate1.png)

#### Setting GlobalState

To set a global state variable:

```js
setGlobalState({ key: "hidden", data: true });
```

This uses key-value pairs — in this case, the key `"hidden"` is assigned the value `true`.  
The `data` value can be of any type, including booleans, objects, arrays, strings, and more.

#### Consuming GlobalState

To access a global state value:

```js
globalState?.hidden;
```

By referencing the key on `globalState`, you can retrieve the value that was previously set.

### Benefits of GlobalState

1. **Simplicity** – Easily set and access shared state across different components.
2. **Reusability** – Use a single state variable in multiple places without prop drilling.
3. **Flexibility** – Can store any type of value, including complex objects.
4. **Dynamic UI Control** – Useful for controlling UI behavior, such as conditionally hiding or showing sub-forms based on state.

---

### Tables

GlobalState can be used to access data from tables, such as `indexTable -> tableData`.

#### Use Cases

1. **Calculations** – Summing total values for specific columns.
2. **Index Access** – Accessing values at specific indexes from table data.
3. **Selected Row** – Accessing the selected row’s ID or data through global state.

`Please note whe the page is refershed the global state is empty`
