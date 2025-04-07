# Alert

This component is used when you need to show alert messages to users. It is also useful when you need a persistent static container that is closable by user actions.

[//]: # (<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=793ec3d1-04c1-4253-adec-6521f82be88b" title="Alert Component" ></iframe>)

## Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

### Component Name
Sets the internal name for the component, useful when referencing it in scripts or styling.

### Type
Choose the type of alert you want to show:

- **Success**: All systems go!
- **Info**: Just keeping you in the loop.
- **Warning**: Something looks off.
- **Error**: Yikes! Something went wrong.

### Message
The main message of the alert. You can use dynamic values with variables and expressions for full power-flex.

### Description
Optional additional information to help clarify the message. This is hidden when banner mode is active or the alert is read-only.

### Show Icon
Toggles whether an icon appears beside the alert text. Great for visual cues.

### Icon
Allows you to pick a custom icon (only visible if "Show Icon" is enabled).

### Hide
Hides the alert from view—poof, it’s gone!

### Closable
Gives users the option to dismiss the alert.

### Marquee
If enabled, the content scrolls horizontally like a stock ticker. Flashy and fun for long messages.

### Banner
Switches the alert to a banner layout. This changes the display style and hides the description.

## Appearance
### Custom Style
JavaScript code that returns a CSS style object to dynamically style the component. Perfect for when you want full visual control over your alert.