# File / File List

This enables the uploading of one or more files. It also showcases the process of uploading by selecting or dragging a file.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=3745cb52-d48c-478c-8d34-b5743f7c9388" title="File / Filelist component" ></iframe>'

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties).

### IsDragger

- When toggled on, this will render the uploader as a dragger instead of a button.

### Allow Upload

- When checked, the component will be allowed to upload a new file.

### Allow Replace

- When checked, the component will be allowed to replace uploaded files with another one.

### Allow Delete

- When checked, the component will be allowed to delete uploaded files.

### Synchronous upload

- It's a checkbox that, when checked, the component will upload files synchronously (together with form data). This allows the framework to determine the Owner Id and Owner Type automatically based on the Entity the form is bound to, which supports cases where the owner entity has not yet been created.

### Owner Id

- Id of owner if you want to upload files to another Entity instead of the form model/Entity. E.g., `{data.id}`.

### Owner Type

- Type of owner if you want to upload files to another Entity instead of the form model/Entity. E.g., `Shesha.Core.Person` (This is the namespace of the entity).

### Property Name

- Property of the owner where files will be uploaded if you want to upload files to another Entity instead of the form model/Entity.

### Allowed File Types

- File types that can be accepted. See [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers) for unique file type specifiers.

### Files Category

- Allows grouping files by some categories (string value).
