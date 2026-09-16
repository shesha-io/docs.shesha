---
sidebar_label: Initialize Dialog From Parent
title: Initialize Dialog with Values From Parent Form
---

# Initialize Dialog with Values From Parent Form

When a user opens a child dialog from a details view, the dialog often needs to "know" which parent record it belongs to. For example, on an `invoice-details` view the **Add line item** button opens a child dialog that creates an `invoice-line-item` - but the line item must be linked to the invoice the user is currently looking at. This guide shows two ways to pass that parent-record context into the dialog's form.

:::warning Initial Values and On Initialized have been replaced
Earlier versions of the form designer exposed a key/value **Initial Values** list and a separate **On Initialized** script on the Form Settings panel. Neither exists on the live Data tab any more. Forms that still have them keep working - Shesha migrates the old settings into the lifecycle scripts described below the first time the form is opened in the designer - but any new form should use **On Before Data Load** / **On After Data Load** instead.
:::

---

## Option 1 - Pass Arguments From the Triggering Action

The dialog is opened by a **Show Dialog** action (on a button, a menu item, or a table action column). That action has an **Arguments** script field: a JavaScript function that returns the object passed into the dialog's form. This is the most explicit way to hand data to a child dialog, because the values are built right where the dialog is triggered.

1. Select the button (or action column) that opens the `invoice-line-item` **Create View**, and open its **Show Dialog** action configuration.
2. Open the **Arguments** code editor.
3. Return an object with the values the child form needs. `data` is the current (parent) form's data.

**Form type to use:** Create Form - the child dialog is creating a new line item against the parent invoice.

**Example - Pass the parent invoice's Id into the dialog:**

```javascript
return {
  invoiceId: data?.id,
};
```

4. On the `invoice-line-item` **Create View**, open **Settings** and locate **On Before Data Load** (under the **Data Load** panel on the **Data** tab). Use `form.formArguments` to read what the triggering action passed in, and `form.setFieldsValue` to seed the field.

**Example - Seed the invoice foreign key from the dialog's arguments:**

```javascript
form.setFieldsValue({
  invoice: form.formArguments?.invoiceId,
});
```

---

## Option 2 - Read the Parent Form's Values Directly

Shesha also exposes a [Parent Form Values](../front-end-basics/configured-views/client-side-scripting/shesha-objects/parent-form-values.md) object (`parentFormValues`) inside a form opened as a dialog, giving the child form implicit access to the entire data object of whichever form opened it - without the trigger having to pass anything explicitly. This is convenient, but the framework keeps it around for backward compatibility rather than as the primary mechanism, so prefer Option 1 for new forms unless you genuinely need the parent's full data set.

1. Open the `invoice-line-item` **Create View** in the form designer.
2. Open **Settings** and locate **On Before Data Load** (under the **Data Load** panel on the **Data** tab). This script runs once, before the form's data loader executes.
3. Use `form.setFieldsValue({ ... })` to seed the fields from `parentFormValues`.

**Example - Seed the invoice foreign key from the parent form's values:**

```javascript
form.setFieldsValue({
  invoice: parentFormValues?.id,
});
```

:::tip
Use **On Before Data Load** for seeding that must happen before the form's own data loads (the equivalent of the old On Initialized timing). Use **On After Data Load** instead when the seeded value needs to override or merge on top of data the form just loaded.
:::
