---
sidebar_label: Pie Chart
---

# Pie Chart

The Pie Chart component displays data as a circular chart divided into slices, where each slice represents a category's share of the total. Use it when you want to show how a whole breaks down into parts, for example the proportion of cases by status or the distribution of users across regions. You can optionally render it as a doughnut chart by enabling a hollow centre.

---

## Properties

The following properties are available to configure the Pie Chart component from the form designer. These are in addition to the [common properties](../../common-component-properties.md) shared by all Shesha components.

---

### Common

#### **Is Doughnut** `boolean`

When enabled, the centre of the pie is cut out, turning it into a doughnut chart. The data and slices remain identical - only the visual style changes.

:::tip Quick Settings and Labels shortcuts
The Common tab also has two collapsible shortcut panels: **Quick Settings** (Data Source Type, Simple / Pivot, and the core data-binding fields) and **Labels** (title and axis label fields). They edit the exact same properties documented below under Data Settings and Chart Settings - they just let you configure the basics without switching tabs.
:::

---

### Chart Settings

#### **Simple / Pivot** `object`

Controls whether the chart uses one grouping dimension or two.

| Option | When to use |
|---|---|
| `Simple` | Each slice represents one distinct value of the Axis Property. This is the standard pie chart layout. |
| `Pivot` | Each slice is further broken down by a second dimension using the Grouping Property. Use this for more complex distributions. |

---

#### **Show Title** `boolean`

When enabled, a title appears above the chart.

---

#### **Title** `string`

The text displayed as the chart heading. Only appears when Show Title is enabled.

---

#### **Show Legend** `boolean`

When enabled, a legend appears on the chart that maps each slice colour to its category label. The legend is particularly important for pie charts because slice labels may not always be visible inside narrow slices. Unlike Bar and Line charts, this setting is always available on a Pie Chart, regardless of Simple / Pivot.

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

#### **Axis Property Label** `string`

A custom label associated with the Axis Property grouping. If not provided, a label is generated from the entity field. This field is available on Pie Chart even though there is no visible X-axis, because it shares the same underlying setting as the axis-based chart types.

---

#### **Value Property Label** `string`

A custom label associated with the Value Property. If not provided, a label is generated from the entity field. Available for the same reason as Axis Property Label above.

---

#### **Stroke Thickness** `number`

The thickness of the border drawn around each slice, in pixels. Step `0.1`. Defaults to `0`.

---

#### **Stroke Color** `string`

The colour of the border drawn between slices. Use a hex colour code or the colour picker. Defaults to `#000000`.

---

#### **Title Font**

Typography for the chart title - Family, Size, Weight, Colour.

---

#### **Legend Font**

Typography for the legend text - Family, Size, Weight, Colour. Always available for Pie Chart.

---

:::note Axis Labels Font and Grid Ticks Font not available
Pie Chart has no X/Y axes, so the **Axis Labels Font** and **Grid Ticks Font** panels available on Bar and Line charts are hidden here.
:::

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

The entity field that determines the pie slice categories. Each distinct value in this field becomes a separate slice on the chart. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups slices by the selected Axis Property Time Series Format.

---

#### **Axis Property Time Series Format** `object`

Controls how dates are grouped. Only appears when Is Axis Property Time Series? is enabled.

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

The entity field whose values are aggregated to determine the size of each slice. Appears when Data Source Type is `Entity Type`.

---

#### **Grouping Property** `object`

The entity field used to add a second grouping dimension in Pivot mode. Only appears when Simple / Pivot is set to `Pivot`.

---

#### **Is Grouping Property Time Series?** `boolean`

When enabled, Shesha treats the Grouping Property as a date or time value and groups by the selected Grouping Time Series Format. Only appears when Simple / Pivot is `Pivot` and a Grouping Property is set.

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

Defines how the Value Property is calculated to determine each slice's size.

| Option | What it calculates |
|---|---|
| `Sum` | The total of the Value Property across all records in each category. |
| `Count` | The number of records in each category. |
| `Average` | The mean of the Value Property across all records in each category. |
| `Min` | The smallest Value Property value in each category. |
| `Max` | The largest Value Property value in each category. |

---

#### **Entity Filter** `object`

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records created in the current financial year. Appears when Data Source Type is `Entity Type`.

---

:::warning Allow Chart Filter and Filter Property List removed
The **Allow Chart Filter** toggle and **Filter Property List** from older versions, which let users filter chart data from the chart itself, are no longer exposed on the properties panel. To restrict chart data, use the **Entity Filter** query builder above, or bind the chart's Data Table Context (if any) to a filter the user controls elsewhere on the form.
:::
