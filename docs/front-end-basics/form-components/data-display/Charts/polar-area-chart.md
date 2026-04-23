# Polar Area Chart

The Polar Area Chart is a circular chart where each segment radiates outward from the centre. Unlike a pie chart where slice angle determines size, in a polar area chart every segment has the same angle and the radius of each segment represents its value. This makes it easy to compare magnitudes across categories while keeping all segments visually present, even small ones.

---

## Properties

The following properties are available to configure the Polar Area Chart component from the form designer. These are in addition to the [common properties](/docs/front-end-basics/form-components/common-component-properties) shared by all Shesha components.

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

Controls whether the chart uses one grouping dimension or two.

| Option | When to use |
|---|---|
| `Simple` | Each segment represents one distinct value of the Axis Property. This is the standard polar area layout. |
| `Pivot` | Each segment is further broken down by a second dimension using the Legend Property. Use this for more complex distributions. |

---

#### **Show Title** `boolean`

When enabled, a title appears above the chart.

---

#### **Title** `string`

The text displayed as the chart heading. Only appears when Show Title is enabled.

---

#### **Show Legend** `boolean`

When enabled, a legend appears on the chart that maps each segment colour to its category label. Because all segments have equal angles, the legend is important for identifying which segment represents which category.

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

The thickness of the border drawn around each segment, in pixels. Range is `0` to `10`. Set to `0` to remove segment borders entirely.

---

#### **Stroke Color** `string`

The colour of the border drawn around each segment. Use a hex colour code or the colour picker.

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

The entity field that determines the segment categories. Each distinct value in this field becomes a separate segment on the chart. Appears when Data Source Type is `Entity Type`.

---

#### **Is Axis Property Time Series?** `boolean`

When enabled, Shesha treats the Axis Property as a date or time value and groups segments by the selected Time Series Format.

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

The entity field whose values are aggregated to determine the radius and therefore the visual size of each segment. Appears when Data Source Type is `Entity Type`.

---

#### **Legend Property** `object`

The entity field used to add a second grouping dimension in Pivot mode. Only appears when Simple / Pivot is set to `Pivot`.

---

#### **Aggregation Method** `object`

Defines how the Value Property is calculated to determine each segment's radius.

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

A query builder where you define filter conditions to restrict which records are included in the chart. Use this to scope the chart to a specific subset of data, for example only records from a particular year or status. Appears when Data Source Type is `Entity Type`.
