---
sidebar_label: SetFormData
title: SetFormData
---

# SetFormData

:::danger Removed as a standalone script variable
The bare `setFormData` script variable described on this page is no longer injected into the script scope. If you write a new script that calls `setFormData(...)` directly (not as `form.setFormData(...)`), it will fail because `setFormData` is not defined.

Existing form configurations that still use the bare `setFormData(...)` call are automatically rewritten to `form.setFormData(...)` the next time the form is opened, so they keep working without you having to edit them by hand. `form.setFormData` is itself `@deprecated` - use [`form.setFieldsValue`](../../javascript-api/form.md) to merge values, or `form.clear()` to reset the form's data, in any new script.
:::

`setFormData` used to be a script variable that updated the form's [data](./shesha-objects/data.md) from inside a script, either merging new values in or replacing the data outright. The signature and merge behaviour described below still apply to `form.setFormData`, which the framework calls internally (for example, `form.clear()` is implemented as `form.setFormData({ values: {}, mergeValues: false })`), and to migrated scripts that were rewritten to call it directly.

---

## Signature

```typescript
setFormData: (payload: { values: object, mergeValues: boolean }) => void
```

- `values`: an object containing the data to set.
- `mergeValues`: `true` merges `values` into the form's existing data; `false` replaces the form's data entirely with `values`.

---

## Merge Behaviour

How `values` is applied depends on `mergeValues`, and the merge itself has a few non-obvious rules worth knowing before you rely on it:

- When `mergeValues` is `true`, `values` is deep-merged into the form's existing data - nested objects are merged property by property rather than the whole nested object being replaced.
- Arrays and date values inside `values` always replace the existing value outright, even while merging. They are never merged element by element.
- Setting a field to `null` or `undefined` inside `values` clears that field, even while merging - it is not treated as "no value provided".
- When `mergeValues` is `false`, the form's data is replaced entirely: any field not present in `values` is reset to its initial value rather than left as it was. `form.clear()` is implemented as exactly this - `form.setFormData({ values: {}, mergeValues: false })`.
- Calling `form.setFormData({ values: {}, mergeValues: true })` - an empty `values` object with merging on - is a no-op. It returns immediately without updating the form's data or firing change events.

---

## Examples

**Form type to use:** Any form type - new scripts should call `form.setFieldsValue({ ... })` for the common case of merging in specific fields, shown below in the preferred and legacy form.

**Example - Set a single value:**

Preferred, using `form.setFieldsValue`:
```javascript
form.setFieldsValue({
  emailAddress: "admin@shesha.io",
});
```

Legacy, still functional via `form.setFormData`:
```javascript
form.setFormData({
  values: {
    emailAddress: "admin@shesha.io",
  },
  mergeValues: true,
});
```

**Example - Set a nested value:**

```javascript
form.setFormData({
  values: {
    organisation: {
      emailAddress: "admin@shesha.io",
      name: "Shesha",
    },
  },
  mergeValues: true,
});
```

---

## See Also

- [Form Data](./shesha-objects/data.md)
- [Form instance API](../../javascript-api/form.md)
