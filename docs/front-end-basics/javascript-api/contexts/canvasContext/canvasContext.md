---
sidebar_label: Canvas Context
---

# Canvas Context

Canvas Context gives a form script information about the device the form is currently being viewed on, and about the Form Designer's canvas when the form is open in the designer. Use it to adjust a component's behaviour based on the device it is displayed on, for example hiding a wide table on mobile.

---

## Accessing Canvas Context

`contexts.canvasContext` is available anywhere standard script variables are.

### Available Data

| Property | Type | What it is |
|---|---|---|
| `activeDevice` | `IDeviceTypes` | The device type the application is currently rendering for |
| `designerDevice` | `IDeviceTypes` | The device type currently selected for preview in the Form Designer |
| `physicalDevice` | `IDeviceTypes` | The device type of the physical device the browser is running on |
| `designerWidth` | `string` | The width of the designer area, as a CSS size (for example `"800px"`) |
| `zoom` | `number` | The current zoom level of the Form Designer canvas |

`IDeviceTypes` is one of `desktop`, `mobile`, `tablet`, or `custom`.

### Available Actions

| Method | What it does |
|---|---|
| `api.setDesignerDevice(deviceType)` | Sets the device type previewed in the Form Designer |
| `api.setCanvasWidth(width, deviceType)` | Sets the width of the designer canvas for the given device type |
| `api.setCanvasZoom(zoom)` | Sets the zoom level of the Form Designer canvas |

:::warning Actions live under `.api`
Call these through the `api` property, for example `contexts.canvasContext.api.setDesignerDevice('mobile')`. Calling `contexts.canvasContext.setDesignerDevice(...)` directly will fail, since the data properties above and the actions are two separate objects merged into `canvasContext` - only the actions are nested under `api`.
:::

---

## Example

**Form type to use:** Edit Form - or any form type, since Canvas Context is available everywhere standard script variables are.

**Example - Hide a component on mobile:**

Use this in a component's [Hide](/docs/front-end-basics/form-components/common-component-properties#hide) setting to hide it whenever the form is being rendered for a mobile device.

```javascript
// Hide returns true to hide the component, false to show it
return contexts.canvasContext.activeDevice === 'mobile';
```
