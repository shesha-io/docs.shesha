---
sidebar_label: Time Picker
title: Time Picker
---

# Time Picker

The Time Picker component allows users to select a time with precision and flexibility. Customize it for 12-hour or 24-hour formats, step increments, and optional range selection.

![Image](./images/timepicker1.png)

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

### Data

#### **Hour Step** `number` / `function`

Define the number of hours to increment or decrement by (e.g., steps of 1 hour, 2 hours, etc.).

#### **Minute Step** `number` / `function`

Set how many minutes each selection should increment by.

#### **Second Step** `number` / `function`

Specify the stepping interval for seconds.

#### **Time Format** `string` / `function`

Define how the time is displayed (default: `HH:mm`). When Property Name is bound to an entity field, this is filled in from that field's metadata.

#### **Input Read-Only** `boolean`

Set whether the input is read-only to prevent mobile keyboards from appearing.

#### **Use 12 Hours** `boolean`

Enable 12-hour format (AM/PM) if needed.

#### **Allow Clear** `boolean`

Allow users to clear the selected time.

#### **Show Now** `boolean`

Show a shortcut to quickly select the current time.

#### **Auto Focus** `boolean`

Automatically focus the time picker when the page loads.

#### **Hide Disabled Options** `boolean`

Hide options that are not available for selection.

#### **Range** `boolean`

Enable this to allow users select a range of times instead of a single time.

___

### Appearance

:::warning Hide Border and Size have been removed
The old **Hide Border** and **Size** (Small / Middle / Large) properties no longer appear on the properties panel. Border is now controlled through the **Border** panel described below, and there is no dedicated component-size control.
:::

#### **Enable Style On Readonly** `boolean`

By default, most styling (other than font and dimensions) is dropped when the component becomes read-only, so it blends in as plain text. Enable this to keep the full styling - border, background, shadow - even when the component is read-only.

The remaining Appearance settings (Font, Dimensions, Border, Background, Shadow, Margin & Padding, Custom Styles) follow the same [common style properties](../common-component-properties.md#appearance) shared by all components.
