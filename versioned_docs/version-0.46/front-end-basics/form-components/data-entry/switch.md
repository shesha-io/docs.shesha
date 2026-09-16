---
sidebar_label: Switch
title: Switch
---

# Switch

The Switch component gives users a simple ON/OFF toggle. It binds to a boolean field on your entity.

![Image](../data-entry/images/switch.png)

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

The panel is organised into three tabs: **Common**, **Events**, and **Appearance**.

---

### Common

The Common tab holds only the standard Property Name, Label, Tooltip, Visible, and Interaction Mode settings described in [common properties](../common-component-properties.md), plus the Validations panel below.

___

### Validations

A collapsible panel at the bottom of the Common tab.

#### **Required** `boolean`

The form cannot be submitted while the Switch has no value.

:::note Required on a switch
A Switch that has never been touched has no value at all, which is different from being off. Required forces the user to make an explicit choice rather than letting the default stand.
:::

---

### Events

The Switch exposes On Change, On Focus, On Blur, On Click, On Mouse Enter, On Mouse Leave, On Key Down, and On Key Up, described in [common properties](../common-component-properties.md#events). It has no On Double Click or On Mouse Move handler.

---

### Appearance

The Switch has two independent sets of style settings, because it draws two things: the track the toggle slides along, and the toggle itself.

The tab's own panels, configurable per device, style the **track**: Dimensions, Border, Background, Shadow, Margin & Padding, and Custom Styles. See [common properties](../common-component-properties.md#appearance).

#### Toggle Styles

A collapsible panel styling the **toggle** rather than the track, with its own Dimensions, Border, Background, Shadow, and Custom Styles settings.

:::note No font or spacing settings here
Neither set has a Font panel, because a Switch renders no text of its own. Toggle Styles also has no Margin & Padding panel: the toggle is positioned inside the track rather than laid out in the normal flow, so there is no box model for spacing to act on.
:::
