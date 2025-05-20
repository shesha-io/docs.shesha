# Entity Picker
The Entity Picker component allows users to select one or more entities from a backend list, supporting both single and multiple selection modes. With deep customization for filtering, formatting, and modal creation, it's a powerful tool for relational forms.

![Image](../Entity-References/images/entitypicker1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Property Name** `string`  
A unique identifier binding this picker to the form. *(Required)*

#### **Label** `object`  
Toggle visibility of the field label.

#### **Placeholder** `string`  
Text displayed when no value is selected.

#### **Tooltip** `string`  
Hover text to provide field guidance.

#### **Selection Type** `object`  
Selection behavior:
- Single *(default)*
- Multiple

#### **Entity Type** `string`  
Defines the entity to pick from. *(Required)*

#### **Display Property** `string`  
The field displayed for each entity. Defaults to the backend's default display property.

#### **Edit Mode** `object`  
Specifies interaction mode:
- **Editable**: Users can add and manage notes.
- **Read Only**: Notes are view-only.
- **Inherited** *(default)*: Follows the parent form’s interaction settings.

#### **Hide** `boolean`  
Toggles visibility of the component.

___

### Data

#### **Entity Filter** `object`  
Define pre-filtering logic using a query builder.

#### **Value Format** `string`  
How selected values are stored:
- Simple ID
- Entity reference
- Custom

#### **Configure Columns** `object`  
Configures visible columns for entity suggestions.

#### **Allow New Record** `boolean`  
Enable adding new records directly from the picker.

___

### Validation

#### **Required** `boolean`  
Sets the field as mandatory.

___

### Appearance

#### **Font** ``object`` 

Customize how your Entity picker looks. Choose the font family, size, weight, and color.

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

#### **Entity Picker Divider**

Divider color, width, and style