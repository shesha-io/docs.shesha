# Button

import LayoutBanners from './LayoutBanners';

The Button component provides an interactive element to trigger actions in your forms. This could be submitting data, opening modals, or executing scripts. It supports a range of styling options, icons, and visibility rules to align with your design and user workflows.

![Image](../data-entry/images/button1.png)


[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=4d5f3201-2ba4-4a19-b3de-08153124ea65" title="button Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Component Name** `string`  
Unique name for this button instance. *(Required)*

#### **Caption** `string`  
Text displayed on the button.

#### **Tooltip** `string`  
Text shown on hover to provide additional context.

#### **Icon** `object`  
An optional icon to be displayed on the button.

#### **Edit Mode**  ``object``

Set the component’s interaction behavior:

- **Inherited *(default)***: Behavior is inherited from the parent form.

- **Editable**: Users can set and change their button.

- **Read Only**: Users can view the button but cannot change it.

___

### Appearance

#### **Type** `object`  
Predefined button style:
- **Default** *(default)*
- **Primary**
- **Dashed**
- **Link**
- **Text**
- **Ghost**

#### **Font** ``object`` 

Customize how your buttons look. Choose the font family, size, weight, and color.

#### **Dimensions** ``object`` 

Specify the size of your component:
- Width, Height
- Min/Max Width and Height
- Overflow behavior

#### **Border** ``object`` 

Personalize the borders:
- Set border width, color, and style
- Round the corners for a softer touch

#### **Background** ``object``

Pick your flavor of background:

- Color
- Gradient
- Image URL
- Uploaded Image
- Stored File

Also tweak background size, position, and repeat behavior.

#### **Shadow** ``object`` 

Give depth with adjustable shadows:

- Offset, Blur, Spread, Color

#### **Margin & Padding** ``object``

Fine-tune spacing inside and around the component.

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).


