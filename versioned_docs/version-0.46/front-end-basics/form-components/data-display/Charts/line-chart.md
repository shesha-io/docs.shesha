---
sidebar_label: Line Chart
---

# Line Chart

The Line Chart component displays data points connected by lines, making it ideal for showing trends and changes over time. Use it when you want to visualise how a value increases, decreases, or fluctuates across a sequence of categories, for example the number of new registrations per month or average response times per week. Like all Shesha chart components, it connects directly to your entity data or a custom API endpoint.

---

## Properties

The following properties are available to configure the Line Chart component from the form designer. These are in addition to the [common properties](../../common-component-properties.md) shared by all Shesha components.

---

### Common

:::tip Quick Settings and Labels shortcuts
The Common tab has two collapsible shortcut panels: **Quick Settings** (Data Source Type, Simple / Pivot, and the core data-binding fields) and **Labels** (title and axis label fields). They edit the exact same properties documented below under Data Settings and Chart Settings - they just let you configure the basics without switching tabs.
:::

---

### Chart Settings

#### **Simple / Pivot** `object`

Controls whether the chart displays one line or multiple.

| Option | When to use |
|---|---|
| `Simple` | Show one line for all data. Use this for straightforward trend views. |
| `Pivot` | Show one line per group value. Use this to compare trends across different categories on the same chart. |

---

#### **Show Title** `boolean`

When enabled, a title appears above the chart.

---

#### **Title** `string`

The text displayed as the chart heading. Only appears when Show Title is enabled.

---

#### **Show Legend** `boolean`

When enabled, a legend appears on the chart that maps each line colour to a data series. For a Line Chart, this setting only appears when Simple / Pivot is set to `Pivot` - a simple line chart has only one line, so there is nothing for a legend to distinguish.

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

A custom label for the X-axis. If not provided, the label is generated from the Axis Property's entity field. Shown whenever Show X Axis Title is enabled.

---

#### **Value Property Label** `string`

A custom label for the Y-axis. If not provided, the label is generated from the Value Property's entity field. Shown whenever Show Y Axis Title is enabled.

---

#### **Tension** `number`

Controls the curvature of the line between data points. A value of `0` draws straight segments between each point. Higher values add a smooth curve. The minimum is `0`.

:::tip
Use a low tension value around `0.3` for data that follows a gradual trend. Keep it at `0` when precise point-to-point values matter and you do not want the curve to visually suggest values between points.
:::

---

#### **Stroke Thickness** `number`

The thickness of the line drawn between data points, in pixels. Step `0.1`. Defaults to `0`.

---

#### **Stroke Color** `string`

The colour of the line. Use a hex colour code or the colour picker. In Pivot mode, each series gets its own colour automatically. Defaults to `#000000`.

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

The entity field whose values appear as categories on the X-axis. Each distinct value in this field becomes a point on the line. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups points by the selected Axis Property Time Series Format. Enable this for any time-based X-axis such as dates or months.

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

The entity field whose values are aggregated and plotted on the Y-axis at each point on the line. Appears when Data Source Type is `Entity Type`.

---

#### **Grouping Property** `object`

The entity field used to split data into separate lines in Pivot mode. Each distinct value in this field becomes a separate coloured line on the chart. Only appears when Simple / Pivot is set to `Pivot`.

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

The entity field used to sort chart data before it is rendered. For time series charts, set this to the same field as Axis Property to ensure the line plots in chronological order.

---

#### **Order Direction** `object`

The direction to sort the data. Only appears when Order By is set.

| Option | Description |
|---|---|
| `Ascending` | Sort from smallest to largest (A to Z, oldest to newest). |
| `Descending` | Sort from largest to smallest (Z to A, newest to oldest). |

---

#### **Aggregation Method** `object`

Defines how the Value Property is calculated for each point on the line.

| Option | What it calculates |
|---|---|
| `Sum` | The total of the Value Property across all records in each category. |
| `Count` | The number of records in each category. |
| `Average` | The mean of the Value Property across all records in each category. |
| `Min` | The smallest Value Property value in each category. |
| `Max` | The largest Value Property value in each category. |

---

#### **Entity Filter** `object`

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records from the current year. Appears when Data Source Type is `Entity Type`.

---

:::warning Allow Chart Filter and Filter Property List removed
The **Allow Chart Filter** toggle and **Filter Property List** from older versions, which let users filter chart data from the chart itself, are no longer exposed on the properties panel. To restrict chart data, use the **Entity Filter** query builder above, or bind the chart's Data Table Context (if any) to a filter the user controls elsewhere on the form.
:::
