---
sidebar_label: Bar Chart
---

# Bar Chart

The Bar Chart component displays data as vertical bars, making it easy to compare values across categories. Use it when you want to show how a numeric value differs across a set of groups, for example the number of active cases per region or total revenue per product category. You can connect it to any Shesha entity or a custom API endpoint, and switch between a simple single-series view and a pivot view that breaks data down by a second grouping dimension.

---

## Properties

The following properties are available to configure the Bar Chart component from the form designer. These are in addition to the [common properties](../../common-component-properties.md) shared by all Shesha components.

---

### Common

#### **Stacked** `boolean`

When enabled, each bar group is rendered as a single stacked bar with coloured segments for each group value, rather than side-by-side bars. Only appears when Simple / Pivot is set to `Pivot`, and only for entity-backed charts (it is hidden when Data Source Type is `URL`).

:::tip Quick Settings and Labels shortcuts
The Common tab also has two collapsible shortcut panels: **Quick Settings** (Data Source Type, Simple / Pivot, and the core data-binding fields) and **Labels** (title and axis label fields). They edit the exact same properties documented below under Data Settings and Chart Settings - they just let you configure the basics without switching tabs.
:::

---

### Chart Settings

#### **Simple / Pivot** `object`

Controls whether the chart displays one data series or multiple.

| Option | When to use |
|---|---|
| `Simple` | Show one bar per category. Use this for straightforward comparisons. |
| `Pivot` | Split each category into multiple bars, one per group. Use this to compare across two dimensions at once. |

---

#### **Show Title** `boolean`

When enabled, a title appears above the chart.

---

#### **Title** `string`

The text displayed as the chart heading. Only appears when Show Title is enabled.

---

#### **Show Legend** `boolean`

When enabled, a legend appears on the chart that maps each bar colour to a data series. For a Bar Chart, this setting only appears when Simple / Pivot is set to `Pivot` - a simple bar chart has only one series, so there is nothing for a legend to distinguish.

---

#### **Legend Position** `object`

Controls where the legend appears relative to the chart. Only appears when Show Legend is enabled.

| Option | Description |
|---|---|
| `Top` | Legend appears above the chart. |
| `Bottom` | Legend appears below the chart. |
| `Left` | Legend appears to the left of the chart. |
| `Right` | Legend appears to the right of the chart. |

---

#### **Show X Axis** `boolean`

Controls whether tick marks and labels are shown on the X-axis. Enabled by default.

---

#### **Show X Axis Title** `boolean`

When enabled, a title label appears along the X-axis. Enabled by default.

---

#### **Show Y Axis** `boolean`

Controls whether tick marks and labels are shown on the Y-axis. Enabled by default.

---

#### **Show Y Axis Title** `boolean`

When enabled, a title label appears along the Y-axis. Enabled by default.

---

#### **Axis Property Label** `string`

A custom label for the X-axis. If not provided, the label is generated from the Axis Property's entity field. Shown whenever Show X Axis Title is enabled (it does not depend on Data Source Type).

---

#### **Value Property Label** `string`

A custom label for the Y-axis. If not provided, the label is generated from the Value Property's entity field. Shown whenever Show Y Axis Title is enabled (it does not depend on Data Source Type).

---

#### **Stroke Thickness** `number`

The thickness of the border drawn around each bar, in pixels. Step `0.1`. Defaults to `0`.

---

#### **Stroke Color** `string`

The colour of the border drawn around each bar. Use a hex colour code or the colour picker. Defaults to `#000000`.

---

#### **Title Font**

Typography for the chart title - Family, Size, Weight, Colour.

---

#### **Axis Labels Font**

Typography for the X/Y axis titles - Family, Size, Weight, Colour.

---

#### **Legend Font**

Typography for the legend text - Family, Size, Weight, Colour. Only appears under the same condition as Show Legend (Simple / Pivot is `Pivot`).

---

#### **Grid Ticks Font**

Typography for the axis tick labels - Family, Size, Weight, Colour.

---

:::warning Height, Width, and Show Border removed
The standalone **Height** and **Width** settings (with minimum values of 200px and 300px) and the **Show Border** toggle from older versions are no longer exposed on the properties panel. Use the generic **Dimensions** panel under the Appearance tab (Width / Min Width / Max Width, Height / Min Height / Max Height) to size the chart, and the **Border** panel to add a border.
:::

---

### Data Settings

The settings available in this section depend on the Data Source Type selected.

---

#### **Data Source Type** `object`

Controls where the chart fetches its data.

| Option | When to use |
|---|---|
| `URL` | Pull data from a custom API endpoint. Use this when your data comes from a non-standard source or a custom backend action. |
| `Entity Type` | Pull data directly from a Shesha entity using the built-in API. This is the right choice for most charts. |

---

#### **Request Timeout** `number`

The timeout, in milliseconds, for the request to the data source. Defaults to `10000`. Available regardless of Data Source Type.

---

#### **URL** `string`

The API endpoint Shesha calls to fetch chart data. Appears when Data Source Type is `URL`.

---

#### **Additional Properties** `object[]`

A list of extra key/value pairs sent as parameters when fetching chart data. Values support Mustache expressions such as `{{id}}`. Appears when Data Source Type is `URL`.

---

#### **Entity Type** `object`

The Shesha entity to pull data from. Appears when Data Source Type is `Entity Type`. Use the autocomplete to select a known entity, for example `Shesha.Domain.Person`.

---

#### **Data Size Limit** `number`

The maximum number of records to fetch from the data source. `-1` means no limit. Defaults to `250`. Higher values may cause performance issues - for large datasets, aggregate the data in the backend instead. Appears when Data Source Type is `Entity Type`.

---

#### **Axis Property** `object`

The entity field whose values appear as categories on the X-axis. Each distinct value in this field becomes one bar group on the chart. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups bars by the selected Axis Property Time Series Format.

---

#### **Axis Property Time Series Format** `object`

Controls how dates on the axis are grouped. Only appears when Is Axis Property Time Series? is enabled.

| Option | Example |
|---|---|
| `Day` | 01 |
| `Month` | Jan |
| `Year` | 2024 |
| `Day-Month` | 01 Jan |
| `Day-Month-Year` | 01 Jan 2024 |
| `Month-Year` | Jan 2024 |

---

#### **Value Property** `object`

The entity field whose values are aggregated and plotted on the Y-axis. Appears when Data Source Type is `Entity Type`.

---

#### **Grouping Property** `object`

The entity field used to split data into separate series in Pivot mode. Each distinct value in this field becomes a separate coloured bar group. Only appears when Simple / Pivot is set to `Pivot`.

---

#### **Is Grouping Property Time Series?** `boolean`

When enabled, Shesha treats the Grouping Property as a date or time value and groups series by the selected Grouping Time Series Format. Only appears when Simple / Pivot is `Pivot` and a Grouping Property is set.

---

#### **Grouping Time Series Format** `object`

Controls how dates in the Grouping Property are grouped. Only appears when Is Grouping Property Time Series? is enabled.

| Option | Example |
|---|---|
| `Day` | 01 |
| `Month` | Jan |
| `Year` | 2024 |
| `Day-Month` | 01 Jan |
| `Day-Month-Year` | 01 Jan 2024 |
| `Month-Year` | Jan 2024 |

---

#### **Order By** `object`

The entity field used to sort chart data before it is rendered. Select from the property autocomplete.

---

#### **Order Direction** `object`

The direction to sort the data. Only appears when Order By is set.

| Option | Description |
|---|---|
| `Ascending` | Sort from smallest to largest (A to Z, oldest to newest). |
| `Descending` | Sort from largest to smallest (Z to A, newest to oldest). |

---

#### **Aggregation Method** `object`

Defines how the Value Property is calculated for each category.

| Option | What it calculates |
|---|---|
| `Sum` | The total of the Value Property across all records in each category. |
| `Count` | The number of records in each category. |
| `Average` | The mean of the Value Property across all records in each category. |
| `Min` | The smallest Value Property value in each category. |
| `Max` | The largest Value Property value in each category. |

---

#### **Entity Filter** `object`

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records where `status` is `Active`. Appears when Data Source Type is `Entity Type`.

---

:::warning Allow Chart Filter and Filter Property List removed
The **Allow Chart Filter** toggle and **Filter Property List** from older versions, which let users filter chart data from the chart itself, are no longer exposed on the properties panel. To restrict chart data, use the **Entity Filter** query builder above, or bind the chart's Data Table Context (if any) to a filter the user controls elsewhere on the form.
:::
