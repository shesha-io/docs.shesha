# Line Chart

The Line Chart component visualizes data points connected by straight lines. It's perfect for illustrating trends over time, patterns, and continuous datasets. Whether you're tracking performance metrics or time series data, the Line Chart provides a clean and effective visual representation.

<!-- ![image](images/chart/image-1.png)   -->

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
**Property Name** `string`  
A unique identifier for the line chart.

**Hide** `boolean`  
Controls whether the chart is visible on the page.

**Data Source Type** `object`  
Defines where the chart retrieves data from:
- Entity Type *(default)*
- URL

**Simple / Pivot** `object`  
Chart structure configuration:
- Simple *(default)*
- Pivot

**Axis Property** `object`  
Defines the property used on the X-axis.

**Entity Type** `object`  
Specifies the data entity from which values are drawn.

**Is Axis Property Time Series?** `boolean`  
Indicates whether the X-axis property represents a time series.

**Value Property** `object`  
Specifies the property whose values are to be visualized.

**Aggregation Method** `object`  
Determines how values are aggregated:
- Count *(default)*
- Sum
- Average
- Min
- Max

**Title** `string`  
Main title displayed above the chart.

**Show Title** `boolean`  
Toggles visibility of the chart title.

**Show X Axis** `boolean`  
Enables or disables display of the X-axis.

**Show X Axis Title** `boolean`  
Toggles the title for the X-axis.

**Show Y Axis** `boolean`  
Enables or disables display of the Y-axis.

**Show Y Axis Title** `boolean`  
Toggles the title for the Y-axis.

___

### Data
**Data Source Type** `object`  
Defines where the chart retrieves data from:
- Entity Type *(default)*
- URL

**Entity Type** `object`  
Specifies the data model or context.

**Axis Property** `object`  
Field used for the X-axis.

**Is Axis Property Time Series?** `boolean`  
Designates if X-axis values are dates or times.

**Value Property** `object`  
Specifies the metric or quantity being charted.

**Order By** `object`  
Determines sorting logic for chart data.

**Aggregation Method** `object`  
Defines how values are aggregated (same as above).

**Entity Filter** `object`  
Allows you to build complex filter conditions using a query builder interface. This tool helps narrow down the dataset displayed in the chart.

___

### Appearance
**Width** `number`  
Pixel width of the chart.

**Height** `number`  
Pixel height of the chart.

**Show Border** `boolean`  
Toggles a border around the chart.

**Stroke Width** `number`  
Sets the width of the line drawn for data points.

**Stroke Color** `object`  
Defines the color of the line used for connecting data points.

**Tension** `number`  
Controls the curvature of the lines. A value closer to 0 makes the line straighter, while a higher value adds more curve.

