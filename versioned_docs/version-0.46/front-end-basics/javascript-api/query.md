---
sidebar_label: Query
sidebar_position: 6
title: Query API
---

# Query API

The `query` object holds the query string values from the current page URL, already parsed into a plain object. Use it to read a value that was passed to the page, most commonly the `id` of the record a form is meant to load.

---

## Reading a Query String Value

Each query string parameter appears as a property named after it. For the URL:

```
/dynamic/Membership/member-details?id=8f14e45f&mode=review
```

`query.id` is `"8f14e45f"` and `query.mode` is `"review"`.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Load a record by the id in the URL:**

```javascript
const getFetchedData = async () => {
  // In a Custom Loader the form data has not been fetched yet, so read the id from query.
  const response = await actions.callApi.get(
    `/api/services/app/Members/Get?id=${query.id}`
  );
  return response.data.result;
};
```

:::warning Use query.id in a Custom Loader, not data.id
A Custom Loader runs before the form has any data, so `data.id` and `form.data.id` are empty at that point. The id you want is the one in the URL, which is `query.id`.
:::

---

## Guarding Against a Missing Value

A query string parameter is only there if something put it there. A form opened without an id has no `query.id`, and passing `undefined` into an API call produces a request for `?id=undefined`, which the back-end rejects with a validation error.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Skip the call when there is no id:**

```javascript
const onAfterDataLoadAsync = async () => {
  if (!query.id) return;

  const response = await actions.callApi.get(
    `/api/services/app/Members/GetHistory?memberId=${query.id}`
  );
  form.setFieldsValue({ history: response.data.result });
};
```

:::note Values are always strings
Everything in a query string arrives as text. A parameter that is meant to be a number or a boolean needs converting before you compare it, for example with `Number(query.page)`.
:::
