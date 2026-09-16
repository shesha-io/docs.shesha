---
sidebar_label: Password Combo
title: Password Combo
---

# Password Combo

:::warning Deprecated in v0.46
The Password Combo component is hidden from the toolbox as of v0.46. Use the [Text Field](../data-entry/text-field.md) component with **Text Type** set to `Password` instead, which now includes a **Use standard password validation** switch.

Existing forms that already use Password Combo keep working.
:::

The Password Combo component captures a password together with its confirmation field in one control, and shows a live checklist of password strength rules as the user types.

![Image](../Advanced/images/passwordcombo1.png)

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

### Common

The confirmation field has its own equivalents to the password field's Property Name, Label, Placeholder, and Tooltip:

#### **Repeat Property Name** `string`

The name of the property used to store the confirmation (repeated) password value.

#### **Label: Confirmation** `string`

The label shown above the confirmation field. Only shown when **Label** is enabled.

#### **Placeholder: Confirmation** `string`

The placeholder text shown in the confirmation field.

#### **Tooltip: Confirmation** `string`

The tooltip shown on the confirmation field.

___

### Validation

#### **Min Length** `number`

The minimum password length. This drives both the standard length validation and the length rule shown in the strength checklist below the input (defaults to 4 if left unset).

#### **Message** `string`

A custom validation message shown when the password does not meet the rules.

#### **Validator** `function`

A script with custom validation logic for the field's antd `rules`. Must return a Promise.

:::note Strength checklist rules are mostly fixed
While the user types, a checklist shows whether the password has a lowercase letter, an uppercase letter, a numeric character, a special character, and the minimum length. Only the minimum length is configurable here (via **Min Length**) - the other four rules are fixed and cannot be turned off. This checklist is separate from the application-wide Password Complexity settings described in [Security Settings (General)](../../../fundamentals/security/authentication.md#security-settings-general) - the two are not connected.
:::
