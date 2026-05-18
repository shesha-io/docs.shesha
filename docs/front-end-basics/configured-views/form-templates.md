---
sidebar_label: Form Templates
---

# Form Templates

Every form in Shesha starts from a template. A template sets the layout container your form uses as its foundation. Choosing the right template means Shesha pre-wires the correct display and interaction behaviour for your use case, saving you from building common layouts from scratch.

You select a template when you create a new form in the form designer. You cannot change the template after the form is created.

---

## Available Templates

| Template | Use it when... |
|---|---|
| `Blank` | You need a fully custom layout with no pre-configured structure. |
| `Table` | You need to list, search, and filter multiple records in a table. |
| `Details` | You want to display and edit the details of an existing record. |

---

### Blank

The Blank template starts with an empty canvas and no pre-configured layout container. Use it when none of the other templates fit your requirements, or when you want full control over every component you place on the form.

Because there is no default container, you are responsible for adding all the components yourself. This makes Blank the most flexible option, but also the most time-consuming for common use cases.

___

### Table

The Table template places a **Table View** container on the canvas. This container manages fetching, paginating, filtering, and sorting a list of records from an entity or custom endpoint.

Use this template for index views - pages that show a list of records the user can browse, search, and act on. From a table view you can link to a Details form to open individual records.

___

### Details

The Details template places a **Details View** container on the canvas. This container is optimised for displaying a record in a read-only layout that also supports switching to an edit mode inline, without navigating to a separate form.

Use this template when you want users to see the full details of a record and be able to edit them from the same page. Set the form's loader to Default so it reads the record by ID from the URL.
