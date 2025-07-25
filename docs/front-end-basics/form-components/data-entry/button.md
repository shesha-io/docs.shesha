# Button

import LayoutBanners from './LayoutBanners';

The Button component provides an interactive element to trigger actions in a form. This could be submitting data, opening modals, or executing scripts. It supports a range of styling options, icons, and visibility rules to align with the design and workflows.

![Image](../data-entry/images/button1.png)


[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=4d5f3201-2ba4-4a19-b3de-08153124ea65" title="button Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Caption** `string`  
Text displayed on the button.

#### **Icon** `object`  
An optional icon to be displayed on the button.
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