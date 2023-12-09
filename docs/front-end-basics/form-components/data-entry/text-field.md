# Text Field

This page provides information on using the Text Field component to gather and validate user input such as text, numbers, emails, and passwords.

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

### Type

- **Options**:
  - Text
  - Password
    ![Image](./images/textF1.png)

### Prefix

- A "prefix" is a sequence of characters at the beginning of a string. It is added to the front of the original string.

### Suffix

- A "suffix" is a sequence of characters at the end of a string. It is added to the end of the original string.

### Default Value

- This allows you to set the default value for the input field. _[formData](/docs/front-end-basics/configured-views/data-types/shesha-objects/data) is exposed_.

### Empty as Default

- Whether the component should be initialized to an empty string.

### Min Length

- This sets a minimum length allowed for user input. If validation is not satisfied then a `Validation error message` will be rendered beneath the text field.
  _E.g. Password must be at least 5 characters_

### Max Length

- This sets a maximum length allowed for user input. Once the validation has been satisifed then it will restrict user input.

### Validator

- This allows for `javascript` expressions to enter custom validator logic and should return a promise.
  _Example implementation can be found [here](/docs/get-started/tutorial/the-basics/configuring-first-view#custom-validations)_
