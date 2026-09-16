---
sidebar_label: Page
sidebar_position: 3
title: Page API
---

# Page API

The `page` object covers the page a form is sitting on, rather than the form itself. It gives you a shared store that every component on the page can read and write, and the browser's location for the current URL. Use it when two components on the same page need to agree on a value that does not belong on the form.

---

## Sharing Data Across a Page

#### **page.state** `object`

A store scoped to the current page. It behaves like a plain object: there is no fixed list of properties, so any property you set on it becomes available under that name to every script on the page.

Its contents last as long as the user stays on the page. Navigating away clears it.

**Form type to use:** Table / List View - use when showing multiple records.

**Example - Store a filter choice so another component can read it:**

```javascript
const onChange = () => {
  page.state.selectedRegion = form.data.region;
};
```

Reading it back from a different component on the same page:

```javascript
const getHidden = () => {
  // Hide this panel until a region has been chosen.
  return !page.state.selectedRegion;
};
```

:::tip Choosing where to put shared data
Use `page.state` for something only the current page cares about, `form.state` for something scoped to one form, and `application.state` for something that has to survive navigation. See [Application API](./application/application.md) and [Form Instance API](./form.md).
:::

___

## Reading the Current URL

#### **page.location** `object`

The browser's standard [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) object for the current page, with properties such as `href`, `pathname`, `search`, and `hash`.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Read the current path:**

```javascript
const getText = () => {
  return page.location?.pathname ?? '';
};
```

:::note Reading query string values
To read a value out of the query string, use [`query`](./query.md) rather than parsing `page.location.search` yourself.
:::

---

## Moving From pageContext

Scripts written against earlier versions of Shesha used a `pageContext` object. It still resolves at runtime, so existing scripts keep working, but it is no longer suggested or type-checked in the editor.

| Old | Use instead |
|---|---|
| `pageContext.selectedRegion` | `page.state.selectedRegion` |
| `pageContext.selectedRegion = x` | `page.state.selectedRegion = x` |
