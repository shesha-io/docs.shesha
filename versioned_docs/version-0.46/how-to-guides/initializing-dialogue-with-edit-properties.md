---
sidebar_label: Initializing Dialog With Edit Properties
title: Initializing a Dialog With Edit Properties
---

# Initializing a Dialog With Edit Properties

Sometimes the user wants to edit a single row in a table without drilling all the way down to its details view. Shesha lets you add an inline **Edit** action column to the table that opens a pre-populated dialog seeded with the row's data. This guide walks through wiring up that action - adding the column, configuring the dialog, passing the row Id in, and refreshing the table on success.

:::warning Additional Properties has been replaced by a script
The **Show Dialog** action used to have an **Additional Properties** key/value list, filled in with `{{ }}` placeholder syntax (for example `{{selectedRow.id}}`). That list no longer exists. The action now has a single **Arguments** script field where you return a plain JavaScript object - see step 4 below.
:::

---

## 1. Open the Form and Configure the Table Columns

Navigate to the form in the designer.

Select the data table component and click **Configure Columns** under its properties.

---

## 2. Add an Action Column

Add a new column and move it to the top of the list.

Configure the column:

- Set **Type** to **Action**.
- Clear the column caption (so the column shows just the icon).

Click **Select Icon** to choose an icon. Search for **Edit** and pick **EditOutlined**.

---

## 3. Configure the Show Dialog Action

Set the column's **Action Configuration** to **Show Dialog**, with:

- **Title:** `Edit Payment`
- **Modal Form:** the Membership Payment form
- **Form Mode:** `Edit`

:::note Submit verb comes from the target form, not the action
There is no **Submit HTTP Verb** setting on the Show Dialog action any more. The Membership Payment form's own **Data Save** settings decide whether it posts or updates - by default a form submits an update when the data it is editing already has an `id`, and creates a new record otherwise. Passing the row's `id` into the dialog (step 4) is what makes it update instead of create.
:::

---

## 4. Pass the Selected Row's Id Into the Dialog

The dialog needs to know which record it is editing. Open the **Arguments** code editor on the Show Dialog action and return an object containing the row's Id.

**Example - Pass the selected row's Id to the dialog:**

```javascript
return {
  id: selectedRow?.id,
};
```

:::info
`selectedRow` is the data of the row whose Edit button was clicked - it is available directly inside the Arguments script. The value returned here becomes `form.arguments` inside the Membership Payment form, so its **On Before Data Load** script (or its default loader, if it fetches by `id`) can use it to load the right record.
:::

---

## 5. Refresh the Table on Success

Toggle **Handle Success** to true and set its action to **Form: Refresh**. This causes the table to re-fetch its data once the edit is saved, so the user immediately sees the updated row.

Save the column configuration and save the form.

---

## 6. Try It

Click the new Edit icon on any row. The dialog opens pre-populated with that row's data, and any changes are saved and reflected back in the table.
