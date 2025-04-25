# Time Picker

The Time Picker component allows users to select a time with precision and flexibility. Customize it for 12-hour or 24-hour formats, step increments, and optional range selection.

![Image](../data-entry/images/timepicker1.png)


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

Control the field's input mode:

- Inherited (default): Follows the parent form’s edit mode.

- Editable: Users can select a time freely.

- Read Only: Users can view the value but cannot change it.

#### **Hide** ``boolean``

Allows the component to be conditionally hidden from the form.

___

### Main Settings

#### **Hour Step** ``number``/``function``

Define the number of hours to increment or decrement by (e.g., steps of 1 hour, 2 hours, etc.).

#### **Minute Step** ``number``/``function``

Set how many minutes each selection should increment by.

#### **Second Step** ``number``/``function``

Specify the stepping interval for seconds.

#### **Time Format** ``string``/``function``

Define how the time is displayed (default: ``HH:mm``).

#### **Input Read-Only** ``boolean``

Set whether the input is read-only to prevent mobile keyboards from appearing.

#### **Use 12 Hours** ``boolean``

Enable 12-hour format (AM/PM) if needed.

#### **Allow Clear** ``boolean``

Allow users to clear the selected time.

#### **Show Now** ``boolean``

Show a shortcut to quickly select the current time.

#### **Auto Focus** ``boolean``

Automatically focus the time picker when the page loads.

#### **Hide Disabled Options** ``boolean``

Hide options that are not available for selection.

#### **Range** ``boolean``

Enable to allow users to select a range of times instead of a single time.

___

### Appearance

#### **Hide Border** ``boolean``

Decide whether to show or hide the border around the input.

#### **Size** ``object``

Adjust the size of the component:

- Small: Compact version of the picker.

- Middle (default): Standard medium-sized picker.

- Large: Bigger, easier-to-click version for accessibility.

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).

___

### Validation

#### **Required** ``boolean``

Set whether the field must be filled before form submission.



