# Chevron

A chevron is a simple arrow-like symbol (›) that helps users navigate through your application. Think of it as a visual signpost that shows users where they can click or what will happen next.

![Image](../Advanced/images/chevron1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Property Name** `string`
A unique key binding the Chevron component to your data model.

#### **Label** `object`
Toggle whether the label should be displayed.

#### **Tooltip** `string`
Contextual help that appears when the user hovers over the component.

#### **Hide** `boolean`
Determines whether the Chevron is visible on the form.

___

### Data

#### **Reference List** `object`
Defines which reference list is used to drive the Chevron items. Ensure the list is properly selected to reflect updates.

#### **Items** `object`
A selector for managing specific items from the chosen reference list.

___

### Appearance

#### **Font** ``object`` 
Customize the font with options for:
- Family
- Size
- Weight
- Color
- Text alignment

#### **Dimensions** ``object``  
Set width and height using any valid CSS units.

#### **Margin & Padding** ``object``
Adjust internal and external spacing for layout control.

#### **Color Source** ``object``
Defines where the color comes from:
- **Primary** *(default)*: Uses primary color theme.
- **Custom**: Lets you define your own color.
- **From reflist item**: Dynamically sourced from reference list data.

#### **Show Icons** `boolean`
Toggle visibility of icons next to items.


