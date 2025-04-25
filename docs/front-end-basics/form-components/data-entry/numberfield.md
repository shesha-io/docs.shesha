# NumberField

The Number Field component is a powerful input tool designed for numeric data entry. It supports high-precision decimals, customizable increments, and visually appealing styling.

![Image](../data-entry/images/numberfield1.png)

## **Properties**

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Property Name** ``string``

Unique identifier used to bind the component's value to your data model.

#### **Label** ``object``

Customize whether to display a label. Hiding it can simplify the UI in some layouts.

#### **Placeholder** ``string``/``function``

Shows hint text inside the input to guide users on what to enter.

#### **Tooltip**  ``string``/``function``

Provides extra context via a hover message — perfect for subtle hints.

#### **Edit Mode**  ``object``

Select between Editable, Read Only, or Inherited from the form.

#### **Hide** ``boolean``

Allows the component to be conditionally hidden from the form.

#### **Prefix & Prefix Icon** ``string``/``function``

Add a prefix text or icon (e.g., currency symbols) before the number.

#### **Suffix & Suffix Icon** ``string``/``function``

Display text or icons after the number (e.g., units like %, kg).

#### **High Precision** ``boolean``

Enable this to allow high-precision decimal entry.

___

### Validation

#### **Required** ``boolean``

Ensures the field must be filled out before form submission.

#### **Min Value / Max Value** ``number``

Restrict entries to within a specified numeric range.

___

### Appearance

#### **Font** ``object`` 

Customize how your tab labels look. Choose the font family, size, weight, and color.

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
