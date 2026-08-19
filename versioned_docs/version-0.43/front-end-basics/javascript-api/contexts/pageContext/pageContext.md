---
sidebar_label: Page Context
---

# Page Context

`contexts.pageContext` is a data store scoped to the current page. Shesha creates one page context when a page opens, and everything on that page, the page's main form as well as any subforms, modal dialogs, form cells, or data list items rendered inside it, shares that same store. Use it to pass a value between forms on the same page without wiring up component-to-component bindings. When the user navigates away from the page, its page context and everything stored in it is cleared.

---

## Accessing Page Context

```Javascript
contexts.pageContext
```

---

## Reading and Writing Page Context from a Script

Reading a value works the same way as reading any other variable:

```Javascript
const modelType = contexts.pageContext.modelType;
```

:::warning
Assigning directly to a field, like `contexts.pageContext.modelType = 'Shesha.Domain.Person'`, does not save the change. Scripts receive a snapshot copy of the context's data, so a plain assignment only changes that copy. To actually update Page Context from a script, call the context's own `setFieldValue` method instead.
:::

```Javascript
contexts.pageContext.setFieldValue('modelType', 'Shesha.Domain.Person');
```

---

## Page Context, Form Context, and App Context

One `appContext` and one `pageContext` are always available. `formContext`, on the other hand, can exist multiple times on the same page. For example, if two subforms are used on a main form, the main form has its own `formContext` and each subform has its own separate `formContext`. Components on one subform can't see the `formContext` values of another subform, but every form and subform on the page shares the same `pageContext`.

---

## Example

**Form type to use:** Any form, in an On Initialized (On Before Data Load) script, to make the form's entity type available to other forms on the same page.

**Example - Share the current form's model type with the rest of the page:**

```Javascript
// makes form.formSettings.modelType readable by every form on this page, not just this one
contexts.pageContext.setFieldValue('modelType', form.formSettings.modelType);
```
