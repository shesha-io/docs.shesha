# Text Field

This page provides information on using the Text Field component to gather and validate user input such as text, numbers, emails, and passwords.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=e3191b51-4a87-4187-910e-177bcbed657b" title="Text Field Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties).

### Type

- **Options**:
  - Text
  - Password
    ![Image](./images/textF1.png)

### Prefix

 A "prefix" is a sequence of characters at the beginning of a string. It is added to the front of the original string.

### Suffix

 A "suffix" is a sequence of characters at the end of a string. It is added to the end of the original string.

### Default Value

 This allows you to set the default value for the input field. _[formData](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) is exposed_.

### Empty as Default

 Whether the component should be initialized to an empty string.

### Min Length

 This sets a minimum length allowed for user input. If validation is not satisfied then a `Validation error message` will be rendered beneath the text field.
  _E.g. Password must be at least 5 characters_

### Max Length

 This sets a maximum length allowed for user input. Once the validation has been satisifed then it will restrict user input.

### Validator

 This allows for `javascript` expressions to enter custom validator logic and should return a promise.
  _Example implementation can be found [here](/docs/get-started/tutorial/the-basics/configuring-first-view#custom-validations)_
