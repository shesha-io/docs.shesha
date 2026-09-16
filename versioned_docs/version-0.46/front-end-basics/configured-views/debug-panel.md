---
sidebar_label: Debugging in the Designer
title: Debugging in the Designer
---

# Debugging in the Designer

When a form does not behave the way you expect, the first thing you usually need is the identity of the component you are looking at, and then the values a script is actually seeing. The Form Designer gives you the first directly, and your browser's console gives you the second.

---

## Identifying a Component on the Canvas

Hovering over any component on the designer canvas shows a tooltip with its **Type**, its **Property name**, and its **Component name**. That is normally enough to tell two similar components apart.

The bug icon in the designer toolbar toggles debug mode. While it is on, the tooltip also includes the component's internal **Id**.

You need the Id whenever something refers to a component by Id rather than by name, for example when reading a validation message or a console error that names the component it came from.

:::note There is no debug panel
Earlier versions of Shesha had two panels for inspecting live form state: one inside the Form Designer canvas, and a floating one opened with Ctrl+F12. Neither exists any more. Inspect script values from the browser console instead, as described below.
:::

---

## Inspecting What a Script Sees

To see the values a script is working with, log them and read the output in your browser's developer console.

**Form type to use:** Edit Form - or any form type, since this applies to every scripted setting.

**Example - Log the form data from a Visible expression:**

```javascript
const getVisible = () => {
  console.log('LOG::getVisible:formData: ', formData);
  return true;
};
```

Shesha wraps script variables in proxies so it can track which values a setting depends on, which means logging one directly shows the proxy rather than the data. To get the real values, use the `test.getArguments(context)` helper.

```javascript
console.log(test.getArguments(context));
```

See [Output the Data Object](../debugging-scripts/output-the-data-object.md) for the full technique, and [Proxying Input Variables](./client-side-scripting/script-variables-proxy.md) for why the proxies exist.

---

## Checking What a Script Can Reach

The code editor's autocomplete lists every object available at the point you are writing, with inline documentation for each. Because the scripting API is typed, what the editor offers is what the script actually receives, so it is a faster answer than logging and reading. See [Scripting API](../javascript-api/scripting-api.md) for the full reference.
