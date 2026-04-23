# Pie Chart

The Pie Chart component displays data as a circular chart divided into slices, where each slice represents a category's share of the total. Use it when you want to show how a whole breaks down into parts, for example the proportion of cases by status or the distribution of users across regions. You can optionally render it as a doughnut chart by enabling a hollow centre.

---

## Properties

The following properties are available to configure the Pie Chart component from the form designer. These are in addition to the [common properties](/docs/front-end-basics/form-components/common-component-properties) shared by all Shesha components.

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

#### **Is Doughnut** `boolean`

When enabled, the centre of the pie is cut out, turning it into a doughnut chart. The data and slices remain identical — only the visual style changes.

---

#### **Simple / Pivot** `object`

Controls whether the chart uses one grouping dimension or two.

| Option | When to use |
|---|---|
| `Simple` | Each slice represents one distinct value of the Axis Property. This is the standard pie chart layout. |
| `Pivot` | Each slice is further broken down by a second dimension using the Legend Property. Use this for more complex distributions. |

---

#### **Show Title** `boolean`

When enabled, a title appears above the chart.

---

#### **Title** `string`

The text displayed as the chart heading. Only appears when Show Title is enabled.

---

#### **Show Legend** `boolean`

When enabled, a legend appears on the chart that maps each slice colour to its category label. The legend is particularly important for pie charts because slice labels may not always be visible inside narrow slices.

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

#### **Stroke Width** `number`

The thickness of the border drawn around each slice, in pixels. Range is `0` to `10`. Set to `0` to remove slice borders entirely.

---

#### **Stroke Color** `string`

The colour of the border drawn between slices. Use a hex colour code or the colour picker.

---

### Data Settings

The settings available in this section depend on the Data Source Type selected in the General panel.

---

#### **URL** `string`

The API endpoint Shesha calls to fetch chart data. Appears when Data Source Type is `URL`.

---

#### **Entity Type** `object`

The Shesha entity to pull data from. Appears when Data Source Type is `Entity Type`. Use the autocomplete to select a known entity, for example `Shesha.Domain.Person`.

---

#### **Axis Property** `object`

The entity field that determines the pie slice categories. Each distinct value in this field becomes a separate slice on the chart. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups slices by the selected Time Series Format.

---

#### **Time Series Format** `object`

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

#### **Legend Property** `object`

The entity field used to add a second grouping dimension in Pivot mode. Only appears when Simple / Pivot is set to `Pivot`.

---

#### **Aggregation Method** `object`

Defines how the Value Property is calculated to determine each slice's size.

| Option | What it calculates |
|---|---|
| `Count` | The number of records in each category. |
| `Sum` | The total of the Value Property across all records in each category. |
| `Average` | The mean of the Value Property across all records in each category. |
| `Min` | The smallest Value Property value in each category. |
| `Max` | The largest Value Property value in each category. |

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

#### **Allow Chart Filter** `boolean`

When enabled, users can filter the chart data directly from the chart interface without editing the form. Disabled by default.

---

#### **Filter Property List** `object`

The entity fields that users can filter by. Only appears when Allow Chart Filter is enabled. Select one or more properties from the autocomplete.

---

#### **Entity Filter** `object`

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records created in the current financial year. Appears when Data Source Type is `Entity Type`.
