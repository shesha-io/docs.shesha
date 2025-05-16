# Autocomplete

The AutoComplete component enhances user input fields with dynamic suggestions based on the user's typing.It is an input box with text hints, and users can type freely. The keyword is aiding input.

![Image](../Advanced/images/autocomplete1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Property Name** `string`  
Unique identifier for binding this field to your data model. *(Required)*

#### **Label** `boolean`  
Show or hide the label above the field.

#### **Placeholder** `string`  
Helper text inside the input box.

#### **Tooltip** `string`  
Text shown on hover for guidance.

#### **Edit Mode** `object`  
Controls interaction:
- Editable
- Read Only
- Inherited *(default)*

#### **Hide** `boolean`  
Toggle the visibility of the component.

#### **Selection Mode** ``string``
Sets how many options can be selected:

- Single *(default)*
- Multiple

#### **Disable Search** ``boolean``
Hides the search bar and disables real-time filtering.

___

### Data

#### **Default Value** `function`  
JavaScript code to compute the initial value.

#### **Data Source Type** `object`  
Choose source for suggestions:
- Entities List *(default)*
- URL

#### **Entity Type** `string`  
Entity to search within.
___

### Validation

#### **Required** `boolean`  
Enforces input before submission.

___

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


