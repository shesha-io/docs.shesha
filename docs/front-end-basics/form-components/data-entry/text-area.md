# Text Area

The Text Area component allows users to input multiple lines of text. It is commonly used when you need to collect longer-form textual information, such as user comments, messages, or any other type of free-form text. The `Text Area`component provides a larger input area compared to a single-line [`Text Field`](/front-end-basics/form-components/data-entry/text-field.md) component.

![Image](../data-entry/images/textarea1.png)

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=4d5f3201-2ba4-4a19-b3de-08153124ea65" title="Text Area Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Empty As Default**  ``boolean``

Returns an empty string as the default value instead of ``null``.

#### **Auto Size**  ``boolean``

Enable this to automatically expand or shrink the ``textarea`` as the user types.

#### **Allow Clear**  ``boolean``

Adds a handy little clear button to reset the field.

#### **Show Chars Count** ``boolean``

Display a live character count. Helpful for length-restricted inputs.

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