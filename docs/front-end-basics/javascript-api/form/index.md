# Form instance API

`form` object provides access to the form instance. It has object and function properties that can be used to interact with the form.

## `form.addDelayedUpdateData`

This function is used to add data to the form that will be updated after a delay.

The function takes the following parameters:

- `data`: model data object for updating.

```typescript
form.addDelayedUpdateData(data: any) => IDelayedUpdateGroup[]
```

## `form.clearFieldsValue`

This function is used to clear the value of the fields in the form.

```typescript
form.clearFieldsValue() => void
```

## `form.data`

This object provides access to the form data. It is the same object as the top-level `data` object. You can read the form data using this object as shown below:

```typescript
const formData = form.data;
```

## `form.defaultApiEndpoints`

Default API endpoints (create, read, update, delete). Note: available only when `Model type` of the form is an existing `entity`.

The object has the following properties:
- create: The API endpoint for creating a new record in the entity.  
- read: The API endpoint for reading a record from the entity.
- update: The API endpoint for updating a record in the entity.
- delete: The API endpoint for deleting a record from the entity.
- list: The API endpoint for listing records from the entity.

Example: When the `Model type` of the form is an existing `Shesha.Domain.Person`, the `defaultApiEndpoints` object will have the following properties:

![Model binding](./images/model-binding.png)


```typescript
console.log(form.defaultApiEndpoints);
```  

which will be logged as:

```json
{
    "read": {
        "httpVerb": "GET",
        "url": "api/dynamic/Shesha/Person/Crud/Get"
    },
    "list": {
        "httpVerb": "GET",
        "url": "api/dynamic/Shesha/Person/Crud/GetAll"
    },
    "create": {
        "httpVerb": "POST",
        "url": "api/dynamic/Shesha/Person/Crud/Create"
    },
    "update": {
        "httpVerb": "PUT",
        "url": "api/dynamic/Shesha/Person/Crud/Update"
    },
    "delete": {
        "httpVerb": "DELETE",
        "url": "api/dynamic/Shesha/Person/Crud/Delete"
    }
}
```

## `form.formInstance`

This object provides access to the form instance. This is the internal AndDesign form instance that renders the form, with it come utility functions that can be used to interact with the form.

Please see the [Ant Design Form documentation](https://ant.design/components/form) for more information.

## `form.formMode` 

This property returns the form mode. It can be one of the following values:
- `edit`
- `designer`

## `form.formSettings`

This object provides access to the configurable form settings. You will notice that these are the same sentence where in we configured the `Model Type` of the form earlier on this page.

For example, in connection to the `Shesha.Domain.Person` model, the `formSettings` object above will have the following properties:

```typescript
console.log(form.formSettings);
```

which will be logged as:

```json
{
    "_formFields": [
        "modelType",
        "layout",
        "size",
        "colon",
        "labelCol.span",
        "wrapperCol.span",
        "excludeFormFieldsInPayload",
        "fieldsToFetch",
        "formKeysToPersist",
        "uniqueFormId",
        "initialValues",
        "preparedValues",
        "onInitialized",
        "onDataLoaded",
        "onUpdate"
    ],
    "layout": "horizontal",
    "colon": true,
    "labelCol": {
        "span": 6
    },
    "wrapperCol": {
        "span": 18
    },
    "modelType": "Shesha.Core.Person",
    "uniqueFormId": "",
    "access": 3,
    "permissions": [],
    "version": 7,
    "dataLoaderType": "none",
    "dataSubmitterType": "none",
    "onBeforeDataLoad": null,
    "onAfterDataLoad": null,
    "onPrepareSubmitData": null,
    "onBeforeSubmit": null,
    "onSubmitSuccess": null,
    "onSubmitFailed": null,
    "dataSubmittersSettings": {
        "gql": {
            "endpointType": "default",
            "dynamicEndpoint": "    return data?.id ? form.defaultApiEndpoints.update : form.defaultApiEndpoints.create"
        }
    },
    "dataLoadersSettings": {
        "gql": {
            "endpointType": "default"
        },
        "custom": {}
    }
}
```

## `form.setFieldValue`  

This function is used to set the value of a field in the form.

```typescript
form.setFieldValue(name: string, value: any) => void
```

For example, say we have a text field with the name `firstName` and we want to set the value to `John`, we can do it as shown below:

```typescript
form.setFieldValue("firstName", "John");
```

## `form.setFieldsValue`

Shesha allows you to set the value of multiple fields in the form at once.

```typescript
form.setFieldsValue(values: any) => void
```

For example, say we have a form with the following text fields: 
- `organization`
- `product`

If we want to set organisation to `Shesha` and product to `Shesha Framework`, we can do it as shown below:

```typescript
form.setFieldsValue({
    organization: "Shesha",
    product: "Shesha Framework"
});
```

## `form.submit`

This function is used to submit the form.

```typescript
form.submit() => void
```

## `form.formArguments`

Form arguments passed by caller. This object is used to read the arguments passed by the caller to the form.