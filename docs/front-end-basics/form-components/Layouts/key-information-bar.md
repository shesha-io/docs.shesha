# Key Information Bar

The Key Information Bar component displays essential data in a compact, styled row or column format. Great for summaries and quick insights, it supports fully customizable layouts and styling per item.

![Image](../Layouts/images/keyinformationbar1.png)

![Image](../Layouts/images/keyinformationbar2.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Component Name** `string`  
Unique identifier for this Key Information Bar component. *(Required)*

#### **Columns** `keyInformationBarColumnsList`  

![Image](../Layouts/images/keyinformationbar3.png)

Defines the layout and contents of each key information column.

#### **Hide** `boolean`  
Controls the visibility of the entire Key Information Bar.
___

### Appearance

#### **Orientation** `object`  
Defines layout direction:
- **Horizontal** *(default)*: Items laid out in a row.
- **Vertical**: Items stacked in a column.

#### **Gap** `number`  
Spacing between columns/items.

#### **Dimensions**  
Set width, min/max width, height, min/max height using CSS units.

#### **Background** `object`  
Style the background with a solid color, gradient, image URL, or stored file.

#### **Shadow** `object`  
Apply shadow using offset, blur radius, spread, and color.

#### **Margin & Padding** `object`  
Control internal and external spacing.

#### **Custom Style** `function`  
Apply dynamic styles via a function that returns a `CSSProperties` object.

#### **Divider** `object`  
Configure a divider line between items with properties for margin, width, height, thickness, and color.





