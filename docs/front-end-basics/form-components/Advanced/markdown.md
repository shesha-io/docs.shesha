# Markdown

The Markdown component allows you to display richly formatted text using Markdown syntax. Whether you're sharing documentation, notes, or styled content, it provides a lightweight yet powerful editor and viewer.

![Image](../Advanced/images/markdown1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).


### Common

#### Property Name `string`
The key that binds the component's content to your data model.

#### Content `function`
Markdown-formatted text to display in the component. Written in Markdown language using a built-in code editor.

#### Hide `boolean`
Toggle visibility of the Markdown component.

___

### Appearance

#### Font
Customize how text looks with the following options:
- **Family**: Choose from system or web-safe fonts.
- **Size**: Set the font size using CSS units.
- **Weight**: Adjust text thickness (light, normal, bold, etc.).
- **Color**: Pick the text color.
- **Align**: Set horizontal alignment (left, center, right).

#### Dimensions `string`
Set width, min/max width constraints using any CSS units.

#### Border `object`
Configure border style, width, radius, and color.

#### **Background** ``object``

Pick your flavor of background:

- Color
- Gradient
- Image URL
- Uploaded Image
- Stored File

#### Shadow `object`
Apply a shadow with offset, blur, spread, and color settings.

#### Margin & Padding `object`
Fine-tune spacing around and inside the component.

#### Custom Style `function`
Inject your own CSS styles via JavaScript (must return a style object).

