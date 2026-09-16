---
sidebar_label: HTML Render
title: HTML Render
---

# HTML Render

The HTML Render component displays markup you supply, instead of a fixed value. Use it when the content itself needs to change based on form data, for example a coloured status badge, a formatted summary line, or an image whose source depends on the record being viewed. It also works well for static visual context between interactive fields, such as styled headings or instructional text.

![Image](./images/htmlrender1.png)

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

The panel is organised into two tabs: **Common** and **Events**. Properties below appear in the same order as the live panel.

---

### Common

#### **Content Type** `object`

How you want to supply the content. This decides which of the two editors below is shown.

| Option | Description |
|---|---|
| `HTML` | You write plain HTML, with Mustache placeholders for data. Reveals Pure HTML below. |
| `JSX` | You write a script that returns the markup. Reveals JS for Render HTML below. |

#### **Sanitize** `boolean`

Strips scripts and styles out of the content before it is rendered. Switching it off allows them through, which is what makes complex, styled, interactive content possible.

:::danger Turning Sanitize off allows script execution
With Sanitize off, any script in the content runs in the user's browser. Never combine that with content built from values a user typed in, or from a record a user can edit, because it opens the page to a cross-site scripting attack. Leave Sanitize on unless you fully control the markup.
:::

#### **Pure HTML** `string`

Shown only when Content Type is **HTML**. The HTML to render. Use [Mustache](https://mustache.github.io/) syntax to insert values from the form data.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Show a record's reference in a heading:**

```html
<h3>Reference {{reference}}</h3>
```

#### **JS for Render HTML** `function`

Shown only when Content Type is **JSX**. A script that returns the markup to render.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Show a coloured badge based on a status value:**

```javascript
const isActive = data.status === 1;
return `<span style="color: ${isActive ? 'green' : 'red'}; font-weight: bold;">${isActive ? 'Active' : 'Inactive'}</span>`;
```

:::warning Always return something
If the script returns nothing, or an empty value, the component has no content to draw and renders an empty element on the form. Return a valid string on every path, including the case where the data you expected is missing.
:::

#### **Container Style** `function`

A script returning the style of the containing element as an object, conforming to CSSProperties. It styles the container rather than the content, which you style in the markup itself.

---

### Events

The HTML Render exposes **On Click**, **On Double Click**, **On Mouse Enter**, **On Mouse Move**, and **On Mouse Leave**, described in [common properties](../common-component-properties.md#events). It has no On Change handler, since it captures no value.
