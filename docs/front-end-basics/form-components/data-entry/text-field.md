# Text Field

The Text Field component provides a clean, customizable input for short strings like names, titles, or search queries. It supports various formatting options, validation rules, and interactive behaviors such as placeholders, tooltips, and live feedback. Ideal for capturing brief, user-entered information, it can be tailored for read-only displays, inline editing, or integrated seamlessly within larger forms.

![Image](../data-entry/images/textfield1.png)

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=e3191b51-4a87-4187-910e-177bcbed657b" title="Text Field Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Type** ``object``
Specify the input type:

- **Text *(default)***: Regular text input.

- **Password**: Masks the entered text for sensitive information.

#### **Default Value**  ``string``/``function``

Set a pre-filled value for the component.

#### **Prefix & Prefix Icon** ``string``/``function``

Add a prefix text or icon (e.g. currency symbols) before the text.

#### **Suffix & Suffix Icon** ``string``/``function``

Display text or icons after the text (e.g. units like %, kg).

#### **Spell Check** ``boolean``

Allows the browser to detect typos.

___

### Validation

#### **Min Length / Max Length** ``number``

Set how short or long the input must be.

#### **Message** ``string``/``function``

Custom message displayed when validation fails.

#### **Validator** ``function``

Provide a custom validation function using JavaScript. Return a Promise for async checks.