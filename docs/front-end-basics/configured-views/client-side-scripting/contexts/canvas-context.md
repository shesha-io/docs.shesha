---
sidebar_label: Canvas Context
sidebar_position: 1
---

# Canvas Context

The canvas context gives scripts access to the current state of the form designer canvas - the device type being previewed, the canvas width, and the zoom level. Use it when you need a setting or a style to respond to which device the form is currently being previewed on in the designer.

:::info
The canvas context is only available inside the **form designer**. It is not available in end-user forms at runtime. Use it in scripts that control designer-time behaviour, such as property router conditions that adjust layout per device.
:::

---

## Accessing the Canvas Context

The canvas context is available in designer scripts as `contexts.canvasContext`.

```javascript
const device = contexts.canvasContext?.designerDevice;
```

:::tip
Always use optional chaining (`contexts.canvasContext?.property`) when reading canvas context values. The context may not be initialised in all script execution environments.
:::

---

## Properties

The following properties are available on `contexts.canvasContext`:

| Property | Type | Default | Description |
|---|---|---|---|
| `designerDevice` | `IDeviceTypes` | `'desktop'` | The device type currently selected in the designer toolbar |
| `activeDevice` | `IDeviceTypes` | `'desktop'` | The device type applied to the canvas display |
| `physicalDevice` | `IDeviceTypes` | - | The physical device type of the machine running the designer |
| `designerWidth` | `string` | `'100%'` | The current canvas width as a CSS string (e.g. `'724px'`, `'100%'`) |
| `zoom` | `number` | `100` | The current canvas zoom level as a percentage |

### IDeviceTypes

The `IDeviceTypes` values are:

| Value | Canvas width |
|---|---|
| `'desktop'` | `100%` |
| `'tablet'` | `724px` |
| `'mobile'` | `599px` |
| `'custom'` | Set manually via `setCanvasWidth` |

---

## Methods

Methods are available on `contexts.canvasContext.api`:

| Method | Description |
|---|---|
| `setDesignerDevice(deviceType: IDeviceTypes)` | Switch the designer to a preset device type. Updates both `designerWidth` and `activeDevice`. |
| `setCanvasWidth(width: number \| string, deviceType: IDeviceTypes)` | Set a custom canvas width. Pass a number for pixels or a string for any CSS width value. Sets `deviceType` to `'custom'`. |
| `setCanvasZoom(zoom: number)` | Set the canvas zoom level as a percentage (e.g. `75` for 75%). |

---

## Examples

**Example - Read the current designer device in a property router condition:**

```javascript
return contexts.canvasContext?.designerDevice || 'desktop';
```

**Example - Switch the canvas to tablet preview:**

```javascript
contexts.canvasContext.api.setDesignerDevice('tablet');
```

**Example - Set a custom canvas width:**

```javascript
contexts.canvasContext.api.setCanvasWidth(480, 'custom');
```

**Example - Reset the zoom to 100%:**

```javascript
contexts.canvasContext.api.setCanvasZoom(100);
```
