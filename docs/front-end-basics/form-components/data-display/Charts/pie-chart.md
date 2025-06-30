# Pie Chart

The Pie Chart component is designed to visually represent parts of a whole. It’s an intuitive and colorful way to display data distribution and is ideal for summarizing proportions and percentages across categories.

<!-- ![image](images/chart/image-1.png)   -->

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
**Property Name** `string`  
A unique identifier for the chart.

**Hide** `boolean`  
Controls whether the component is visible on the page.

**Data Source Type** `object`  
Defines the source from which data is pulled:
- Entity Type *(default)*
- URL

**Simple / Pivot** `object`  
Chart structure configuration:
- Simple *(default)*
- Pivot

**Axis Property** `object`  
Determines how data is grouped for segments.

**Entity Type** `object`  
Specifies the source data model.

**Is Axis Property Time Series?** `boolean`  
Indicates if the axis property is based on time.

**Value Property** `object`  
Identifies the value metric for each segment.

**Aggregation Method** `object`  
Describes how values are calculated:
- Count *(default)*
- Sum
- Average
- Min
- Max

**Title** `string`  
The heading shown above the chart. If no title is specified, it is generated from the Entity Type.

**Show Title** `boolean`  
Toggles display of the chart title.

**Show Legend** `boolean`  
Controls whether the legend is shown.

**Legend Position** `object`  
Specifies the location of the legend:
- Top *(default)*
- Bottom
- Left
- Right

___


### Data
**Data Source Type** `object`  
Same as in Common.

**Entity Type** `object`  
Specifies which entity provides the data.

**Axis Property** `object`  
Defines the dimension by which data is segmented.

**Is Axis Property Time Series?** `boolean`  
Determines if the axis is date or time-based.

**Value Property** `object`  
Specifies the metric represented by each slice.

**Order By** `object`  
Determines the order in which slices are displayed.

**Aggregation Method** `object`  
Defines the aggregation logic used (as above).

**Entity Filter** `object`  
Allows you to build complex filter conditions using a query builder interface. This tool helps narrow down the dataset displayed in the chart.

___

### Appearance
**Width** `number`  
The total width of the chart in pixels.

**Height** `number`  
The total height of the chart in pixels.

**Show Border** `boolean`  
Adds or removes a border around the pie.


**Is Doughnut** `boolean`  
Enables a doughnut style, creating a hole in the center of the pie.

**Stroke Width** `number`  
Defines the thickness of the segment borders.

**Stroke Color** `object`  
Controls the color used to outline each pie segment.
