# Text Area

This allows users to input multiple lines of text. It is commonly used when you need to collect longer-form textual information, such as user comments, messages, or any other type of free-form text. The `Text Area`component provides a larger input area compared to a single-line `Text Field` component.

![Image](../data-entry/images/textarea1.png)

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=4d5f3201-2ba4-4a19-b3de-08153124ea65" title="Text Area Component" ></iframe>'

## Properties

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

#### **Default Value**  ``string``/``function``

Set a pre-filled value for the text area field.

#### **Empty As Default**  ``boolean``

Returns an empty string as the default value instead of ``null``.

#### **Auto Size**  ``boolean``

Enable this to automatically expand or shrink the ``textarea`` as the user types.

#### **Allow Clear**  ``boolean``

Adds a handy little clear button to reset the field.

#### **Edit Mode**  ``object``

Set the component’s interaction behavior:

- **Inherited *(default)***: Behavior is inherited from the parent form.

- **Editable**: Users can set and change their text area.

- **Read Only**: Users can view the text area but cannot change it.

#### **Hide** ``boolean``

Allows the component to be conditionally hidden from the form.

#### **Show Chars Count** ``boolean``

Display a live character count. Helpful for length-restricted inputs.

#### **Spell Check** ``boolean``

Allows the browser to detect typos.

___

### Validation

#### **Required** ``boolean``

Ensures the field must be filled out before form submission.

#### **Min Length / Max Length** ``number``

Set how short or long the input must be.

#### **Message** ``string``/``function``

Custom message displayed when validation fails.

#### **Validator** ``function``

Provide a custom validation function using JavaScript. Return a Promise for async checks.

___

### Appearance

#### **Font** ``object`` 

Customize how your text-area labels look. Choose the font family, size, weight, and color.

#### **Dimensions** ``object`` 

Specify the size of your component:
- Width, Height
- Min/Max Width and Height
- Overflow behavior

#### **Size** ``object`` 

Specify the size of the component between Small, Medium and Large.

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
