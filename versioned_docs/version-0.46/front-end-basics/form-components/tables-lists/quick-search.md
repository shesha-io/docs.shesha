---
sidebar_label: Quick Search
title: Quick Search
---

# Quick Search

The Quick Search component gives users a single search box that filters every row of a DataTable at once, without needing a per-column filter. Add it above or beside a table to let users narrow down a large list with a free-text search.

![Image](../tables-lists/images/quicksearch1.png)

:::warning Requires a Data Table Context
Quick Search only works inside a [Data Table Context](./datatable-context.md) component. Outside one, it renders as a disabled search box and is flagged as a [validation error](../data-display/validation-errors.md) on the component.
:::

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

### Common

#### **Block** `function`

Stretches the search input to fill the full width of its container, instead of a fixed width. Scriptable via the "fx" toggle, so it can be a plain on/off checkbox or a JavaScript expression.

___

### Appearance

Quick Search's Appearance tab exposes only **Dimensions** (Width, Min Width, Max Width).

:::note Size is fixed
The component always renders at a small size. This isn't configurable from the settings panel.
:::
