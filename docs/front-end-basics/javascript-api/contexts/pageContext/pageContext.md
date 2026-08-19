---
sidebar_label: Page Context
---

# Page Context

Page Context is a storage area scoped to the current page. Use it to hold temporary data that needs to be shared between the different forms on that page, for example a main form and the SubForms or modal dialogs it opens. When the user navigates away from the page, its Page Context and everything stored in it are cleared.

---

## Accessing Page Context

`contexts.pageContext` is available in any script on the page, alongside the other standard script variables.

It behaves like a plain object: there is no fixed list of properties, so any property you set on it becomes available under that name.

**Form type to use:** Edit Form - or any form type, since Page Context is available everywhere standard script variables are.

**Example - Setting a value:**

```javascript
contexts.pageContext.myPageVariable = 'test data';
```

**Example - Reading a value:**

```javascript
const getPlaceholder = () => {
  return contexts.pageContext.myPageVariable;
};
```

You can also bind a component directly to Page Context instead of writing to it from a script. Most Shesha form components use a Property Name control with a **show binding option** link next to it; clicking it reveals a **Context** selector. Choosing the context named `pageContext` there, then a Property Name, makes that component read and write its value directly in `contexts.pageContext.<propertyName>`.

---

## Page Context Is Shared Across the Whole Page

Exactly one App Context and one Page Context are always available, unlike Form Context, where every form instance gets its own. Page Context is the same single object for every form on the page, which makes it a good way to pass data between a main form and the SubForms or modal dialogs it opens - something a `formContext` cannot do, since each of those forms would have its own separate `formContext`.

---

## Example

**Form type to use:** Edit Form - or any form type, since Page Context is available everywhere standard script variables are.

**Example - Share a filter between two forms on the same page:**

Suppose a page in the Membership app has a filter panel form and a member results list form displayed side by side. The filter panel's TextField for the category filter has its On Change event write the value to Page Context:

```javascript
contexts.pageContext.selectedCategory = data.category;
```

The results list form, elsewhere on the same page, reads that same value back:

```javascript
const category = contexts.pageContext.selectedCategory;
```
