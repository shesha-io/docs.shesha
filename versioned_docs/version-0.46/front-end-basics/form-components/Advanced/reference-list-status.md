---
sidebar_label: Reference List Status
title: Reference List Status
---

# Reference List Status

The Reference List Status component displays a value from a reference list as a status, showing the item's name, its icon, or both. It can read as plain text or as a coloured badge that takes its colour from the reference list item, which makes a record's state readable at a glance on a details view or in a table.

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

The panel is organised into three tabs: **Common**, **Events**, and **Appearance**. Properties below appear in the same order as the live panel.

---

### Common

The Common tab starts with the standard Property Name, Label, Tooltip, Visible, and Interaction Mode settings described in [common properties](../common-component-properties.md), followed by the two panels below.

___

### Reference List

A collapsible panel on the Common tab.

#### **Reference List** `object`

The reference list that supplies the possible values for this component. Required. See [Reference Lists](../../../back-end-basics/reference-lists.md).

#### **Display** `object`

Whether to show the reference list item's name, its icon, or both. At least one of the two is always shown.

In JS mode, return an object of the form `{ showName: true, showIcon: false }`.

**Form type to use:** Details View - use when displaying a record as read-only.

**Example - Show the icon only on a narrow layout:**

```javascript
return { showName: contexts.canvasContext.activeDevice !== 'mobile', showIcon: true };
```

#### **Show Solid Background** `boolean`

When checked, the component renders as a coloured badge taking its colour from the reference list item, with the icon and name shown in white inside it. When unchecked, it reads as plain text.

:::tip Badges for state, plain text for detail
A solid badge draws the eye, which is what you want for the one field that says whether a record is Active, Pending, or Rejected. Using badges for several fields on the same view cancels that out.
:::

___

### Validations

A collapsible panel at the bottom of the Common tab.

#### **Required** `boolean`

The form cannot be submitted while the component has no value.

---

### Events

The Reference List Status exposes On Focus, On Blur, On Click, On Double Click, On Mouse Enter, On Mouse Move, On Mouse Leave, On Key Down, and On Key Up, described in [common properties](../common-component-properties.md#events). It has no On Change handler, since the user does not edit its value directly.

---

### Appearance

The Appearance tab holds the standard [Font, Dimensions, Border, Background, Shadow, Margin & Padding, and Custom Styles](../common-component-properties.md#appearance) panels, configurable per device.
