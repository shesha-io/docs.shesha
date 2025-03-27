# Autocomplete examples

The Autocomplete component can work with two types of list sources - standard Entities endpoints (`Entities List` Data Source Type) and custom endpoints (`URL` Data Source Type). Custom endpoints sohuld support `string term` parameter for filtering data. The responses from the endpoints should be either a standard response with a list of entities

```ts
export interface ITableDataResponse {
    readonly totalCount: number;
    readonly items: object[];
}
```

or an array.

## • `Entities List` Data Source Type

If the standard entities endpoint is used, the backend returns list of entities with items in the forllowing format

```js
{
    "id": "d519b92f-86e9-4f0f-8df4-00aae8a43158",
    "_className": "Shesha.Domain.Person",
    "_displayName": "Alex Stephens"
}
```

If you specify a value for **Display Property**, the received data will contain an additional field that will be used as name of items. For example **Display Property** = `firstName`

```js
{
    "id": "d519b92f-86e9-4f0f-8df4-00aae8a43158",
    "_className": "Shesha.Domain.Person",
    "_displayName": "Alex Stephens",
    "firstName": "Alex"
}
```

### • `Entity reference` Value format

If you will use `Entity reference` Value format then the selected value will be stored in the model as

```js
{
    "autocomplete": {
        "id": "d519b92f-86e9-4f0f-8df4-00aae8a43158",
        "_className": "Shesha.Domain.Person",
        "_displayName": "Alex Stephens"
    }
}
```

### • `Simple Id` Value format

If you will use `Simple Id` Value format then the selected value will be stored in the model as

```js
{
    "autocomplete": "d519b92f-86e9-4f0f-8df4-00aae8a43158"
}
```

If you specify a value for **KeyProperty**, the received data will contain an additional field that will be used as selected value. For example **Display Property** = `firstName`, **Key Property** = `lastName`

```js
// Received item
{
    "id": "d519b92f-86e9-4f0f-8df4-00aae8a43158",
    "_className": "Shesha.Domain.Person",
    "_displayName": "Alex Stephens",
    "firstName": "Alex",
    "lastName": "Stephens"
}

// Selected value
{
    "autocomplete": "Stephens"
}
```

## • `URL` Data Source Type

### • `Simple Id` Value format

Standard format of response from custom endpoints

```js
// Received item
{
    "value": 1,
    "displayText": "First option"
}

// Selected value
{
    "autocomplete": 1
}
```

But you can use source with any other format of items. To do this, you need to specify in **Display Property** the field that will be used as the name of items and in **Key Property** the field that will be used as the value.

## • General Display value Function

Regardless of the selected value of **Data Source type** you can use **Display value Function**. This is a script to get the displayed name of items. In this script, you can use any field from the received data. For`Entities list` mode, you can request additional fields using the  `Fields to fetch` setting. For `URL` mode you can use only fields provided by the endpoint.

![1742846723881](images/1742846723881.png)

![1742846752828](images/1742846752828.png)

## • General `Custom` Value format

Regardless of the selected value of **Data Source type** you can use `Custom` **Value format**.

Without additional settings or with only **Display Property** and **Key Property** settings, this mode is similar to `SimpleId` **Value format**.

**To** **set** up a **custom** **mode**, you **can** **use** the following **methods**:

**Value Function** - uses Item value received from the backend to return value in custom format.

**Key value Function** - uses value in custom format to return key value. Used with **Key Property Name** to create filter for request data

**Display value Function** - gets the display name of items. You can use **Display Property** instead or leave they empty to use standard display properties

### Example

Configure Autocomplete to get additional fields (`firstName`, `gender`, `dateOfBirth`). Use `firstName` as Key property.

![1743100665658](images/examples/1743100665658.png)

Configure **Value function** to return value in custom format

```ts
const outcomeValueFunc = () => {
    return `${item.firstName}|${item.gender}|${item.dateOfBirth}`
};
```

Now, when selecting a list item, the value will have a custom format.

```js
{
  "autocomplete": "Alex|1|2088-06-06T00:00:00"
}
```

Configure **Key value function** to get correct Key value (needed to get correct item from the backend). Take first element from splitted value as this is `firstName`

```ts
const keyValueFunc = () => {
    return value?.split('|')[0];
};
```

### Advanced filtering

In the example above, we use only one `firstName` field. However, one field may not be enough to uniquely identify an item. For more accurate identification, you can use **Filter selected Function**. This method returns a filter in [JsonLogic](https://jsonlogic.com/) format for more accurate selection of an element on the backend.

```ts
const filterSelectedFunc = () => {
    //debugger;
    const parts = value?.split('|');
    if (parts.length < 2)
        return null;
    return {
        and: [
            {"==":[{"var":"firstName"}, parts[0]]},
            {"==":[{"var":"gender"}, Number(parts[1])]}
        ]
    };
};
```

This script use two fields as a key
