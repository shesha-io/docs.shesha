# Icon Picker

The Icon Picker component provides an interface for selecting icons from a library.

![Image](../Advanced/images/iconpicker1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).


### Common
#### Property Name `string`
Unique key binding the component to form data.

#### Label `boolean`
Toggles display of the component’s label.

#### Tooltip `string`
Helper text shown on hover to guide users.

#### Default Icon `object`
Set a default icon from the icon library.

#### Icon Align `object`
Alignment of the selected icon:
- **Left** (`start`)
- **Center** (`center`)
- **Right** (`end`) *(default)*

#### Edit Mode `string`
Controls interactivity:
- **Editable**: Icon can be changed by the user.
- **Read Only**: View only.
- **Inherited** *(default)*: Uses parent form’s setting.

#### Hide `boolean`
Determines if the component should be hidden from view.

___

### Appearance

#### Color `object`
Set the icon color using a color picker.

#### Size `number`
Size of the icon in pixels *(default is 24)*.

#### Background Color `object`
Background color behind the icon

#### Border Radius `number`
Defines how rounded the background corners are.

#### Border Width `number`
Width of the icon border.

#### **Margin & Padding** ``object``

Fine-tune spacing inside and around the component.

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).





