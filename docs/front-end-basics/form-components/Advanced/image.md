# Image

The Image component allows you to display visuals using various sources like URLs, and stored files. It comes with powerful preview settings, flexible sizing, object-fit controls, and design filters for a complete image experience.

![Image](../Advanced/images/image1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Alt Text** `string`
Alternative text shown when the image fails to load.

#### **Allow Preview** `boolean`
Enable an image preview popup when clicked.

#### **Allowed File Types** `object`
Specify file types allowed for upload (e.g. `.jpg`, `.png`, `.gif`).

#### **Image Source Type** `object`
Select the source of the image:
- **Stored File**
- **URL**
- **Base64**

___


### Appearance

#### **Object Fit** `object`
How the image should be resized:
- **Cover**
- **Contain**
- **Fill**
- **Auto**

#### **Object Position** `object`
Sets the alignment of the image content (e.g. `top left`, `center center`).

#### **Filter** `object`
Apply visual filters:
- **None**
- **Grayscale**
- **Sepia**
- **Blur**
- **Brightness**
- **Contrast**
- **Hue-Rotate**
- **Invert**
- **Saturate**

#### **Filter Intensity** `number`
Level of filter application.

#### **Opacity** `number`
Controls transparency of the image.

