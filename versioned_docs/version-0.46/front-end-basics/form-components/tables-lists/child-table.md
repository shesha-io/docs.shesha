---
sidebar_label: Child Table
---

# Child Table

:::danger Component removed
The Child Table component has been removed from Shesha. Its designer entry now throws `Child Table component was removed` if anything still tries to render or configure it, and it no longer has a settings panel.

Existing forms that still reference a Child Table are automatically migrated the next time they are opened in the designer: Shesha rewrites the old configuration into a [Data Table Context](./datatable-context.md) containing a [DataTable](./datatable.md), with a [Quick Search](./quick-search.md) and [Table Pager](./table-pager.md) added automatically if the old Child Table had **Allow Quick Search** or pagination enabled.

**To build a nested/related table today:**
1. Add a **Data Table Context** where the child table used to be, and set its **Source Type**, **Entity Type** (or **Form**/**URL** source), and any **Permanent Filter** needed to scope it to the parent record (for example, filtering by a foreign key that matches the parent entity's id).
2. Place a **DataTable** inside it and configure its columns, CRUD settings, and row events.
3. Add a **Quick Search** and/or **Table Pager** and/or **Table View Selector** alongside the DataTable, inside the same Data Table Context, if you need them.

See [DataTable](./datatable.md) and [DataTable Context](./datatable-context.md) for full configuration details.
:::
