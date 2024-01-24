# Text

This refers to a UI element or module that is responsible for displaying text content on a webpage. Text components can vary in complexity and functionality, and they are a fundamental part of building user interfaces.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=5e5a3a67-c837-43c3-a34d-829a83465b49" title="Text Component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties.md).

### Type

- **Options**
  - Span
  - Paragraph
  - Title

### Content Display

- #### Content

  - The text you want to be shown should be inserted in this property. This also accepts dynamic `mustuche templating` values to make the content displayed more flexible. In the below example, we have `date`, as part of the [form data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) object.

    ![Image](./images/text1.png)

  _The rendered result will look like this: `Today's date is : 2023-12-09`_

- ### Property Name

  - This allows you to tap into your [form data](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/data) object and display the content. In the below example, we are tapping into the `date` property on the form data.

    ![Image](./images/text2.png)

  _The rendered result will look like this: `2023-12-09`_

### Data Type

- This allows the user to specify the data type of the text component, utlimately deciding the look and format of the rendered text.
- **Options:**
  - **String**
  - **Number**
    - Formats: Round, Currency, Double, Thousand Separator
  - **Boolean**
  - **DateTime**
    - This provides an interface in which to alter the format of the rendered text. Please refer to [this document](https://day.js.org/docs/en/display/format) for formatting.
