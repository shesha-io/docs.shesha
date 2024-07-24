# Text Area

This allows users to input multiple lines of text. It is commonly used when you need to collect longer-form textual information, such as user comments, messages, or any other type of free-form text. The `Text Area`component provides a larger input area compared to a single-line `Text Field` component.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=4d5f3201-2ba4-4a19-b3de-08153124ea65" title="Text Area Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties).

### Auto size

 Height auto size feature.

### Allow clear

 If allowed to remove input content with clear icon.

### Show chars count

 Whether to show character count.

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
