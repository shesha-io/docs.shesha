# Alert

This component is used when you need to show alert messages to users. It is also useful when you need a persistent static container that is closable by user actions.

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

- **Type**

  - Type of Alert styles, options: success, info, warning, error

- **Text**

  - The simplest usage for short messages.

- **Description**

  - Additional description for alert message. You can include dynamic values in your description by tapping into your data object using 'mustache templating'. E.g. `{{name}}`

- **Show Icon / Icon**

  - A relevant icon will make information clearer and more friendly.

- **Closable**
  - To show a close button.
