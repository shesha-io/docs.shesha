# File / File List

This enables the uploading of one or more files. It also showcases the process of uploading by selecting or dragging a file.

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

- **IsDragger**

  - When toggled on, this will render the uploader as a dragger instead of a button.

- **Allow Upload**

  - When checked, the component will be allowed to upload a new file.

- **Allow Replace**

  - When checked, the component will be allowed to replace uploaded files with another one.

- **Allow Delete**

  - When checked, the component will be allowed to delete uploaded files.

- **Synchronous upload**

  - It's a checkbox that, when checked, the component will upload files synchronously (together with form data). This allows the framework to determine the Owner Id and Owner Type automatically based on the Entity the form is bound to, which supports cases where the owner entity has not yet been created.

- **Owner Id**

  - Id of owner if you want to upload files to another Entity instead of the form model/Entity. E.g., `{data.id}`.

- **Owner Type**

  - Type of owner if you want to upload files to another Entity instead of the form model/Entity. E.g., `Shesha.Core.Person` (This is the namespace of the entity).

- **Property Name**

  - Property of the owner where files will be uploaded if you want to upload files to another Entity instead of the form model/Entity.

- **Allowed File Types**

  - File types that can be accepted. See [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers) for unique file type specifiers.

- **Files Category**
  - Allows grouping files by some categories (string value).
