# Validation Errors
The Validation Errors component displays validation messages triggered by user input or programmatic checks. It helps guide users by surfacing required fields, invalid entries, or custom business logic warnings in a centralized and styled display.

*TODO: [Screenshot of component in runtime]*

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Component Name** `string`  
A unique identifier used to reference this validation block within the form.

#### **Hide** `boolean`  
Controls the visibility of the component using conditional logic.

____

### Appearance

#### **Font** ``object`` 

Customize the dropdown's font family, weight, color, and alignment.

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