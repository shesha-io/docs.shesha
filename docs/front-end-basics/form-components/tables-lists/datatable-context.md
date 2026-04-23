import LayoutBanners from './LayoutBanners';

# DataTable Context

The DataTable Context is a container component that handles fetching, filtering, sorting, and paging of data on a form. You configure it with a data source — an entity, a custom API endpoint, or data already on the form — and child components like DataTable and DataList read from it. The context does all the data work so display components can focus on rendering records.

A DataTable Context has no visible UI of its own. It is a data provider that sits in the form tree and makes data available to any table or list placed inside it.

## Get Started

:::info
To set up a DataTable Context, open your form in the designer, drag a **DataTable Context** from the component toolbox, and then place a **DataTable** or **DataList** inside it. Configure the source type and entity before configuring child components.
:::

<LayoutBanners url="https://app.guideflow.com/embed/lpx4823s4k" type={1}/>

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

---

### Disable Refresh Data

#### **Disable Refresh Data** `function`

A JavaScript expression that returns `true` to pause all automatic data fetching, or `false` to allow it. Use this when the table depends on a filter or input that the user has not yet filled in. While the expression returns `true`, Shesha will not call the data API.

**Example - Prevent loading until a person is selected:**

```js
// Prevent the table from fetching until a personId is available on the form
return !formData.personId;
```

:::warning
If Disable Refresh Data always returns `true`, the table will never load any data. Make sure the condition eventually resolves to `false` once the required inputs are available.
:::

---

### Data Source

#### **Source Type** `object`

Controls where the table fetches its data from.

| Option | When to use |
|---|---|
| `Entity` | Loads records from a Shesha entity (like `Person` or `Organisation`). Shesha calls the standard entity API automatically. This is the default and the right choice for most tables. |
| `Url` | Fetches data from a specific API endpoint you provide. Use this when the data does not come from a standard entity, or when you need to call a custom backend action. |
| `Form` | Reads data from a property already on the form's data object, rather than making an API call. Use this for tables driven by data already loaded by the parent form. |

---

#### **Entity Type** `object`

Appears when Source Type is `Entity`. Select the entity the table loads records from. Type the entity name and select it from the autocomplete list (for example, `Shesha.Domain.Person`).

Setting Entity Type is what unlocks the Permanent Filter, Sorting, and Grouping settings. Shesha uses it to determine which API endpoint to call, which fields are available for column configuration, and how to handle CRUD operations on rows.

:::info
If Permanent Filter, Sorting, or Grouping settings are greyed out, check that Entity Type is set first.
:::

---

#### **Custom Endpoint** `string`

Appears when Source Type is `Entity` or `Url`. Select from the autocomplete list or type a path directly.

When Source Type is `Url`, this endpoint is required. The table calls it to fetch all of its data.

When Source Type is `Entity`, this field is optional. Leave it blank to use the default entity list endpoint. Set it only when you need to override the endpoint for this specific table.

---

### Data Fetching

#### **Data Fetching Mode** `object`

Controls whether Shesha loads records one page at a time or all at once.

| Option | When to use |
|---|---|
| `Paging` | Records are loaded one page at a time. The table shows a pager so the user can navigate between pages. Use this for large datasets. This is the default. |
| `Fetch all` | All records are loaded in a single request. Use this only for small, bounded datasets where you know the total record count is low. |

:::tip
Use `Paging` for production data. `Fetch all` can return thousands of records in one request and slow down the form significantly. Only use it when you know the dataset is small and will stay that way.
:::

---

#### **Default Page Size** `number`

Appears when Data Fetching Mode is `Paging`. The number of records shown per page. Choose from: `5`, `10`, `20`, `30`, `50`, `100`, or `200`. The default is `10`.

---

### Permanent Filter

#### **Permanent Filter** `object`

A filter that is always applied to every data request made by this table, regardless of what the user sets in the advanced filter UI. Use it to scope the table to a specific subset of records — for example, only records with a certain status, or only records belonging to the current user's organisation.

The permanent filter is built using the visual query builder in the designer. It only appears when Source Type is `Entity` and an Entity Type is set.

:::warning
The Permanent Filter cannot be overridden or removed by the user at runtime. If you need a filter that the user can toggle, use a predefined filter on the DataTable's filter bar instead of the Permanent Filter.
:::

---

### Sorting

These settings only appear when Source Type is `Entity`.

#### **Sort Mode** `object`

Determines how sorting works for this table.

| Option | When to use |
|---|---|
| `Standard` | The user can click column headers to sort the table interactively. You can also set a default sort order. This is the default. |
| `Strict` | The table is always sorted by a specific field and direction that you define. The user cannot change the sort order. Use this when the order is meaningful and must not change, for example a log sorted by timestamp. |

---

#### **Sort By** `object`

Appears when Sort Mode is `Standard`. A list of fields and directions that define the default sort order when the table first loads. The user can override this by clicking column headers.

Each entry has a field name and a direction (`Ascending` or `Descending`). Add multiple entries to sort by more than one field.

---

#### **Order By** `string`

Appears when Sort Mode is `Strict`. The field to sort all records by. The user cannot change this. Select the field from the property autocomplete.

---

#### **Sort Order** `object`

Appears when Sort Mode is `Strict`. The direction of the strict sort.

| Option | Description |
|---|---|
| `Ascending` | Records are sorted from lowest to highest (A to Z, oldest to newest). |
| `Descending` | Records are sorted from highest to lowest (Z to A, newest to oldest). |

---

### Row Reordering

Row reordering lets users drag rows to change their order. Shesha sends the new order to the server when the user drops a row. These settings appear when Source Type is `Entity` with Sort Mode set to `Strict`, or when Source Type is `Form`.

#### **Allow Reordering** `object`

Controls whether drag-and-drop row reordering is enabled.

| Option | Behaviour |
|---|---|
| `Yes` | Row reordering is enabled. Drag handles appear on each row. |
| `No` | Row reordering is disabled. This is the default. |
| `Inherit` | Inherits the setting from a parent context, if one exists. |

---

#### **Custom Reorder Endpoint** `string`

Appears when Allow Reordering is `Yes`. The API endpoint Shesha calls when a row is dropped in a new position. Leave blank to use the default reorder endpoint for the entity.

---

#### **On Before Row Reorder** `action`

Appears when Allow Reordering is `Yes`. Fires before the reorder request is sent to the server. Use a configured action here to validate the move or show a confirmation dialog. If you cancel the action, the reorder does not proceed.

---

#### **On After Row Reorder** `action`

Appears when Allow Reordering is `Yes`. Fires after the server has confirmed the reorder. Use this to show a success message or refresh related data after the order has been saved.

---

### Grouping

#### **Grouping** `object`

Groups records by one or more fields, visually collapsing rows that share the same value into a group header. This setting only appears when Source Type is `Entity` and Sort Mode is `Standard`.

Add one or more fields to group by. Each entry has a field name and a sort direction for the group headers.

:::note
Grouping changes how data is visually organised in the table. It does not filter or reduce the number of records fetched. All records are still loaded according to the Data Fetching Mode.
:::

