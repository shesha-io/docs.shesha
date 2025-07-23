# Checkbox

The Checkbox component provides a simple yet essential control that allows users to make a binary choice — checked or unchecked.

![Image](../images/checkbox3.png)

## **Properties**

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Property Name** ``string``

This is the identifier used to bind the component to a form’s data model. It’s mandatory and must be unique within the form.

#### **Label** ``object``

Customize whether to display a label. Hiding it can simplify the UI in some layouts.

#### **Hide** ``boolean``

Allows the component to be conditionally hidden from the form.

#### **Default Checked** ``boolean``

Choose whether the checkbox is checked by default when the form loads.

___

### Appearance

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).

___

### Validation

#### **Required** ``boolean``

Ensure users must interact with the checkbox before submission by marking it as required.
