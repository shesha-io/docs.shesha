# Line Chart

The Line Chart component displays data points connected by lines, making it ideal for showing trends and changes over time. Use it when you want to visualise how a value increases, decreases, or fluctuates across a sequence of categories, for example the number of new registrations per month or average response times per week. Like all Shesha chart components, it connects directly to your entity data or a custom API endpoint.

---

## Properties

The following properties are available to configure the Line Chart component from the form designer. These are in addition to the [common properties](/docs/front-end-basics/form-components/common-component-properties) shared by all Shesha components.

---

### General

#### **Data Source Type** `object`

Controls where the chart fetches its data.

| Option | When to use |
|---|---|
| `Entity Type` | Pull data directly from a Shesha entity using the built-in API. This is the right choice for most charts. |
| `URL` | Pull data from a custom API endpoint. Use this when your data comes from a non-standard source or a custom backend action. |

---

#### **Height** `number`

The height of the chart in pixels. The minimum value is `200`. Setting a height adjusts the width proportionally for responsiveness. Only visible when Width is not set.

---

#### **Width** `number`

The width of the chart in pixels. The minimum value is `300`. Setting a width adjusts the height proportionally for responsiveness. Only visible when Height is not set.

---

#### **Show Border** `boolean`

When enabled, a border is drawn around the chart container. Enabled by default.

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

When enabled, a legend appears on the chart that maps each line colour to a data series. This is most useful in Pivot mode when the chart displays multiple lines.

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

When enabled, a title label appears along the X-axis. Only appears when Show X Axis is enabled.

---

#### **Show Y Axis** `boolean`

Controls whether tick marks and labels are shown on the Y-axis. Enabled by default.

---

#### **Show Y Axis Title** `boolean`

When enabled, a title label appears along the Y-axis. Only appears when Show Y Axis is enabled.

---

#### **Tension** `number`

Controls the curvature of the line between data points. A value of `0` draws straight segments between each point. Higher values add a smooth curve. The minimum is `0` and the step is `0.1`.

:::tip
Use a low tension value around `0.3` for data that follows a gradual trend. Keep it at `0` when precise point-to-point values matter and you do not want the curve to visually suggest values between points.
:::

---

#### **Stroke Width** `number`

The thickness of the line drawn between data points, in pixels. Range is `0` to `10`.

---

#### **Stroke Color** `string`

The colour of the line. Use a hex colour code or the colour picker. In Pivot mode, each series gets its own colour automatically.

---

### Data Settings

The settings available in this section depend on the Data Source Type selected in the General panel.

---

#### **URL** `string`

The API endpoint Shesha calls to fetch chart data. Appears when Data Source Type is `URL`.

---

#### **Axis Label** `string`

A text label identifying the category axis in the chart. Appears when Data Source Type is `URL`.

---

#### **Value Axis Label** `string`

A text label identifying the value axis in the chart. Appears when Data Source Type is `URL`.

---

#### **Entity Type** `object`

The Shesha entity to pull data from. Appears when Data Source Type is `Entity Type`. Use the autocomplete to select a known entity, for example `Shesha.Domain.Person`.

---

#### **Axis Property** `object`

The entity field whose values appear as categories on the X-axis. Each distinct value in this field becomes a point on the line. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups points by the selected Time Series Format. Enable this for any time-based X-axis such as dates or months.

---

#### **Time Series Format** `object`

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

#### **Legend Property** `object`

The entity field used to split data into separate lines in Pivot mode. Each distinct value in this field becomes a separate coloured line on the chart. Only appears when Simple / Pivot is set to `Pivot`.

---

#### **Aggregation Method** `object`

Defines how the Value Property is calculated for each point on the line.

| Option | What it calculates |
|---|---|
| `Count` | The number of records in each category. |
| `Sum` | The total of the Value Property across all records in each category. |
| `Average` | The mean of the Value Property across all records in each category. |
| `Min` | The smallest Value Property value in each category. |
| `Max` | The largest Value Property value in each category. |

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

#### **Allow Chart Filter** `boolean`

When enabled, users can filter the chart data directly from the chart interface without editing the form. Disabled by default.

---

#### **Filter Property List** `object`

The entity fields that users can filter by. Only appears when Allow Chart Filter is enabled. Select one or more properties from the autocomplete.

---

#### **Entity Filter** `object`

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records from the current year. Appears when Data Source Type is `Entity Type`.

