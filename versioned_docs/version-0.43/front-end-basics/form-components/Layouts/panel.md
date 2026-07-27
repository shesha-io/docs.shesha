# Panel

The Panel component helps group and visually segment content inside a form. It acts as a flexible container that can include headers, icons, and conditional logic to show or hide its contents. Panels make forms easier to scan and more organized.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=747834b4-9ef8-4088-a951-e976776b19ec" title="Panel Component" ></iframe>'

![Image](../Layouts/images/panel1.png)

## **Properties**

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Custom Header** `boolean`
Enable a custom header layout instead of the standard title and icon.

#### **Icon Position** `object`
Position of the icon in the header:

- End *(default)*
- Hide
- Start

#### **Collapsible** `boolean`  
Enables the ability to collapse or expand the panel.

#### **Collapsible By Default** `boolean`  
If enabled, the panel starts off collapsed.

#### **Hide When Empty** `boolean`
If true, hides the panel when it contains no content.

___

### Appearance

#### **Ghost** `boolean`
Removes background and borders for a minimal, transparent look.

#### **Simple Design** `boolean`
Toggles a lightweight, minimal styling for a flatter design.

#### **Accent** `boolean`
Applies an accent border to visually emphasize the panel.

#### **Hide Top Bar** `boolean`
Hides the top bar area including title, icon, and actions.


