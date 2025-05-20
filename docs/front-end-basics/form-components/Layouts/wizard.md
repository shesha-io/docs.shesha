# Wizard

The Wizard component enables multi-step forms by segmenting fields across several pages with navigation controls. It's ideal for complex data entry processes where progressive disclosure improves the user experience.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=747834b4-9ef8-4088-a951-e976776b19ec" title="Wizard Component" ></iframe>'

![Image](../Layouts/images/wizard1.png)

## **Properties**

### Common

#### **Wizard Type** `string`

Sets the layout style:

- Default *(default)*
- Navigation

#### **Direction** ``object``
Defines orientation:

- Horizontal (default)
- Vertical

#### **Label Placement** ``object``

Controls how labels are positioned:

- Horizontal *(default)*
- Vertical

#### **Default Active Step** ``object``
The step index that should be active on load.

#### **Configure Steps**
![Image](../Layouts/images/wizard2.png)
List of steps with their titles, icons, and content configuration.

#### **Hide** `boolean`  
Controls the visibility of the entire wizard component.

___

### Appearance

#### **Font** ``object`` 

Customize how your wizard look. Choose the font family, size, weight, and color.

#### **Dimensions** ``object``

Set the width, height, min/max sizes of the component.

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

#### **Shadow** ``object``

Give depth with adjustable shadows:

- Offset, Blur, Spread, Color

#### **Margin & Padding** ``object``

Fine-tune spacing inside and around the component.

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).

#### **Additional Styles** ``object``

- Button Layout ``string``: Layout direction of navigation buttons. *(Left, Right, Space between)*

- Primary Color `object`: Main highlight color.

- Primary Text Color `object`: Text color for primary elements.

- Secondary Color `object`: Secondary accent color.

- Secondary Text Color `object`: Text color for secondary elements.

