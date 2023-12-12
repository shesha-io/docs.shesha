# Basic Scripting

## GET Http Request

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

## POST Http Request with [form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data.md)

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

## POST Http Request with some values removed from [form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/data)

> NOTE: You can also manipulate what gets added onto your form data by using [appContexts](/docs/front-end-basics/configured-views/data-types/shesha-objects/app-context)

```javascript
(function () {
  const PATH = `/api/dynamic/Shesha/Person/Create`;

  //   constructing your payload can be achieved in the following ways:
  //   1. Delete your unwanted properties from the form data
       E.g. delete data.isSingle // This deletes the `isSingle` property from the form data if it was just used as a form of manipulating the data entry.

  //   2. Adding additional properties to the form data
       E.g. if (data.title == 1) {
          data.gender = 'male';
       } else {
          data.gender = 'female';
       }
         // This adds the `gender` property to the form data based on the value of `data.title`

  http.post(`${PATH}`, data).then(onSuccess).catch(onError); // You pass in your already constructed form data object as the request body
})();

function onSuccess(resp) {
  message.success(`Person created:`, resp.data.result.fullName); // Will display the full name of the person created.
}

function onError(_e) {
  message.error(`Error: ${_e.response.data.error.message}`); // Catches the error message from the backend and displays in a `toast` message popup
}
```

## Deconstructing the request body payload

This allows you to deconstruct your payload and source data required for your payload from different objects or hard-code certain values.

_Read also: [form data](/docs/front-end-basics/configured-views/data-types/shesha-objects/selectedRow)_

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

## Navigating to another page

### Using window.location.href

The `window.location` object provides information about the current URL and allows you to navigate to a new URL by setting the `href` property.

E.g.

```javascript
window.location.href = "https://www.shesha.io";
```

### Using window.location.replace

This method is similar to setting window.location.href, but it does not create a new entry in the browser's navigation history. Instead, it replaces the current history entry.

E.g.

```javascript
window.location.replace("https://www.shesha.io");
```

### Using window.location.assign

This method is also used for navigation and is similar to window.location.href. It loads a new document.

E.g.

```javascript
window.location.assign("https://www.shesha.io");
```

## Reloading the current page

```javascript
window.location.reload();
```
