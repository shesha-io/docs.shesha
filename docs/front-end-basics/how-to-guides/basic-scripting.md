# Basic Scripting

Scripting can be added to your configured views to add more advanced functionality to your application. Scripts are typically added to the various events exposed by the form or form components. All scripting is done using JavaScript and a number of standard objects and functions are available to the script to facilitate the need to respond to various scenarios.

The sections below provides sample code for common use cases where scripting is typically required:

## Calling an API using the GET method to retrieve data from the back-end

```javascript
(function () {
  const PATH = `/api/dynamic/Shesha/Person/GetAll`;
  http.get(`${PATH}`).then(onSuccess).catch(onError);
})();

function onSuccess(resp) {
  message.success(`Successfully retrived all the people`, 10); // A toast message indicating success of API call
}

function onError(_e) {
  message.error(`Error: ${_e.response.data.error.message}`); // Catches the error message from the backend and displays in a `toast` message popup
}
```

## Calling an API using the POST method to submit [form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data.md) to the back-end

```javascript
(function () {
  const PATH = `/api/dynamic/Shesha/Person/Create`;
  http.post(`${PATH}`, data).then(onSuccess).catch(onError);
})();

function onSuccess(resp) {
  message.success(`Person created:`, resp.data.result.fullName); // Will display the full name of the person created.
}

function onError(_e) {
  message.error(`Error: ${_e.response.data.error.message}`); // Catches the error message from the backend and displays in a `toast` message popup
}
```

## Modifying the [form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data) before calling an API using the POST method to submit the modified form data to the back-end

It is sometimes useful to modify the form data before submitting it to the back-end, for example to submit calculated values. This can be achieved in the following ways.

:::tip Use AppContexts
To avoid adding uncessary data to the form that you then remove programmatically before posting to the back-end, you can also bind your form components to [appContexts](/docs/front-end-basics/configured-views/data-types/shesha-objects/app-context) instead.
:::

```javascript
(function () {
  const PATH = `/api/dynamic/Shesha/Person/Create`;

  //   constructing your payload can be achieved in the following ways:
  //   1. Delete your unwanted properties from the form data E.g.
       delete data.isSingle // This deletes the `isSingle` property from the form data if it was just used as a form of manipulating the data entry.

  //   2. Adding additional properties to the form data based on some condition E.g. 
       if (data.title == 1) {
          data.gender = 'male';
       } else {
          data.gender = 'female';
       }
         // This adds the `gender` property to the form data based on the value of `data.title`

  http
    .post(`${PATH}`, data)  // You pass in your already constructed form data object as the request body
    .then(onSuccess)
    .catch(onError); 
})();

function onSuccess(resp) {
  message.success(`Person created:`, resp.data.result.fullName); // Will display the full name of the person created.
}

function onError(_e) {
  message.error(`Error: ${_e.response.data.error.message}`); // Catches the error message from the backend and displays in a `toast` message popup
}
```

## Call an API using the POST method and a custom payload

This is an example of making a custom API call using the POST method. In this example, the payload is constructed using a combination of the form data and the selected row from the index table.

_Read also: [SelectedRow](/docs/front-end-basics/configured-views/data-types/shesha-objects/selectedRow)_

```javascript
(function () {
  const PATH = `/api/dynamic/Shesha/Person/Create`;

  http
    .post(`${PATH}`, {
      status: 2, // hard-coded status
      parent: contexts.indexTable.selectedRow.id, // sources the parent from the selected row value
      startDate: data.startDate, // sources the start date from the form data
    })
    .then(onSuccess)
    .catch(onError); // You pass in your already constructed form data object as the request body
})();

function onSuccess(resp) {
  message.success(`Person created:`, resp.data.result.fullName); // Will display the full name of the person created.
}

function onError(_e) {
  message.error(`Error: ${_e.response.data.error.message}`); // Catches the error message from the backend and displays in a `toast` message popup
}
```

## Navigate to another page

### Using window.location.href

The `window.location` object provides information about the current URL and allows you to navigate to a new URL by setting the `href` property.

 ```javascript
window.location.href = "https://www.shesha.io";
```

### Using window.location.replace

This method is similar to setting window.location.href, but it does not create a new entry in the browser's navigation history. Instead, it replaces the current history entry.

```javascript
window.location.replace("https://www.shesha.io");
```

### Using window.location.assign

This method is also used for navigation and is similar to window.location.href. It loads a new document.

```javascript
window.location.assign("https://www.shesha.io");
```

## Reloading the current page

```javascript
window.location.reload();
```
