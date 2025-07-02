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

___

### Data

#### **Disable Search** ``boolean``
Hides the search bar and disables real-time filtering.

#### **Selection Mode** ``string``
Sets how many options can be selected:

- Single *(default)*
- Multiple

#### **Default Value** `function`  
JavaScript code to compute the initial value.

#### **Data Source Type** `object`  
Choose source for suggestions:
- Entities List *(default)*
- URL

#### **Entity Type** `string`  
Entity to search within.

#### **Data Source URL** `string`  
External data source URL.

#### **Value Prop Name** `string`  
Value property in external source.

#### **Query Param** `string`  
Parameter for search queries.

#### **Entity Filter** `object`  
Filter options using a query builder.

#### **Custom Source URL** `string`  
Custom URL for fetching data.

#### **Value Format** `string`  
How values are formatted:
- Entity Reference *(default)*
- Simple ID
- Custom

#### **Display Value Function** `function`  
Custom display function for values.

#### **Display Property** `object`  
Property used to display selected value.

#### **Display Value Function** `function` (when Value Format is Custom)  
Function to render display text.

#### **Allow Free Text** `boolean` (when Value Format is Simple ID)  
Allow user to type custom text.

#### **Key Value Function** `function` (when Value Format is Custom)  
Function for key value mapping.

#### **Value Function** `function` (when Value Format is Custom)  
Function to get value.

#### **Key Value Function** `function` (when Value Format is Custom)  
Function for key value mapping.

#### **Display Value Function** `function` (when Value Format is Custom)  
Function to render display text.

#### **Filter Selected Function** `function` (when Value Format is Custom)  
Function to filter selected items.

#### **Use Quickview** `boolean`  
Enable modal quickview for selections.

#### **Fields to Fetch** `object`  
Additional fields to load.

#### **Sort By** `object`  
Sorts options by a specified property.

#### **Grouping** `object`  
Groups options by a property.

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


