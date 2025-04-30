# Password Combo

The Password Combo component provides a secure and user-friendly way to capture passwords and their confirmation. It includes placeholder and tooltip support for both fields, detailed validation options, and fully customizable styling.

![Image](../Advanced/images/passwordcombo1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### Property Name `string`
Unique identifier for binding the password field to form data.

#### Label: Confirmation `string`
Label for the confirmation field.

#### Placeholder `string`
Placeholder text for the main password input.

#### Placeholder: Confirmation `string`
Placeholder text for the confirmation password input.

#### Tooltip `string`
Tooltip text for the main password field.

#### Tooltip: Confirmation `string`
Tooltip text for the confirmation password field.

#### Edit Mode `object`
Sets how the input behaves:
- **Editable**: Field is editable.
- **Read Only**: View-only mode.
- **Inherited** *(default)*: Inherits edit mode from the form.

#### Hide `boolean`
Control the component's visibility.

___

### Validation
#### Required `boolean`
Enforces input of a password.

#### Min Length `number`
Specifies the minimum allowed password length.

#### Message `string`
Custom validation message to show when input does not meet rules.

#### Validator `function`
Custom JavaScript-based validation logic. Should return a Promise.

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