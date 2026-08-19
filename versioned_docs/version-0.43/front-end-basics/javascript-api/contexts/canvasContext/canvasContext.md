---
sidebar_label: Canvas Context
---

# Canvas Context

`contexts.canvasContext` gives your script code information about the device and canvas size the form is currently being displayed in. Use it when a component needs to behave differently depending on whether it's shown on a desktop, tablet, or mobile screen.

---

## Accessing Canvas Context

```Javascript
contexts.canvasContext
```

---

## Available Data

| Property | Type | Description |
|---|---|---|
| `activeDevice` | `IDeviceTypes` | The device type currently rendering the form. In the deployed application, this reflects the real browser viewport width. |
| `physicalDevice` | `IDeviceTypes` | The device type based on the real, physical viewport width. |
| `designerDevice` | `IDeviceTypes` | The device type selected in the Form Designer's device-preview toolbar. Defaults to `desktop`. |
| `designerWidth` | `string` | The width of the designer area. |
| `zoom` | `number` | The zoom level currently applied to the canvas content. |

`IDeviceTypes` is one of `desktop`, `tablet`, `mobile`, or `custom`.

:::note
`canvasContext` is available both while designing a form and in the live, deployed application, it isn't a designer-only tool. Outside of the Form Designer, `activeDevice` tracks the browser's actual viewport width.
:::

---

## Available Methods

| Method | What it does |
|---|---|
| `setDesignerDevice(deviceType: IDeviceTypes)` | Sets the device type shown in the Form Designer's preview. |
| `setCanvasWidth(width: number \| string, deviceType: IDeviceTypes)` | Sets the width of the canvas content for the given device type. |
| `setCanvasZoom(zoom: number)` | Sets the zoom level of the canvas content. |

:::info
These methods mirror what the Form Designer's own device-preview toolbar does. Most form scripts only need to read the properties above rather than call these methods directly.
:::

---

## Example

**Form type to use:** Any form with a component that should be hidden on mobile devices, using its Visibility expression.

**Example - Hide a component when viewed on a mobile device:**

```Javascript
return contexts.canvasContext?.activeDevice !== 'mobile';
```
