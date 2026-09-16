---
sidebar_label: Date Field
title: Date Field
---

# Date Field

The Date Field component lets users pick a date, a date and time, or a calendar unit such as a week or a quarter. It can also capture a range with a start and an end. What the user picks, how precisely, and what format the value is stored in are all controlled from the settings panel.

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

The panel is organised into three tabs: **Common**, **Events**, and **Appearance**. Properties below appear in the same order as the live panel.

---

### Common

#### **To Property Name** `string`

Shown only when Range is enabled. The property the end of the range binds to, while Property Name binds the start.

___

#### **Binding Format** `object`

The format the selected value is stored in. This decides what actually lands in your database, so pick it to match the backend property.

| Option | Description |
|---|---|
| `UTC` | Stored as UTC. |
| `ISO Local` | ISO 8601 with no offset, representing local time. |
| `ISO with offset` | ISO 8601 including the timezone offset. |
| `Date only` | The date with no time part. |
| `Ticks` | .NET ticks. |
| `Unix` | A Unix timestamp. |

:::warning Match the format to the backend property
A `DateTime` property that expects UTC will silently store the wrong instant if the component sends local time. Check what the entity property holds before changing this.
:::

___

#### **Required** `boolean`

The form cannot be submitted while the Date Field has no value. Unlike most components, Required sits directly on the Common tab here rather than inside the Validations panel.

___

#### **Selection Type** `object`

What the user picks, and at what precision. Several settings below appear only for certain selection types.

| Option | Description |
|---|---|
| `Date & Time (hours)` | A date and a time, to the hour. |
| `Date & Time (mins)` | A date and a time, to the minute. This is the default. |
| `Date & Time (secs)` | A date and a time, to the second. |
| `Date only` | A date with no time part. |
| `Week` | A calendar week. |
| `Month` | A calendar month. |
| `Quarter` | A calendar quarter. |
| `Year` | A calendar year. |

___

#### **Range** `boolean`

Captures a start and an end rather than a single value. Turning it on reveals To Property Name at the top of the tab, which binds the end of the range.

___

#### **Date Format** `string`

The display format of the date part. Shown for every Selection Type except the calendar units (Week, Month, Quarter, and Year), which have their own format settings below.

#### **Time Format** `string`

The display format of the time part. Shown only when Selection Type includes a time.

#### **Week Format** `string`

The display format. Shown only when Selection Type is **Week**.

#### **Month Format** `string`

The display format. Shown only when Selection Type is **Month**.

#### **Quarter Format** `string`

The display format. Shown only when Selection Type is **Quarter**.

#### **Year Format** `string`

The display format. Shown only when Selection Type is **Year**.

___

#### **Minute steps** `object`

The granularity of the minute column in the time picker. Shown only when Selection Type is **Date & Time (mins)** or **Date & Time (secs)**.

| Option |
|---|
| `1 Minute` |
| `5 minutes` |
| `10 minutes` |
| `15 minutes` |
| `20 minutes` |
| `30 minutes` |

:::tip Coarser steps are faster to use
For an appointment booked on the half hour, a 30 minute step turns a fiddly scroll into two clicks. Keep 1 minute only where the exact minute genuinely matters.
:::

___

#### **Convert to/from UTC** `boolean`

Converts the value between UTC and the user's local time for display. Shown only when Binding Format is **UTC** and Selection Type includes a time, since converting a bare date or a calendar unit would only shift it across a day boundary.

___

#### **Default time to midnight** `boolean`

Sets the time part to midnight when the user picks a date without specifying a time. Shown only when Selection Type includes a time.

___

#### **Date Restriction** `object`

Restricts which dates the user can choose.

| Option | Description |
|---|---|
| `None` | Any date can be picked. This is the default. |
| `In the past` | Only dates in the past can be picked. |
| `In the future` | Only dates in the future can be picked. |

___

#### **Time Restrictions** `object`

Restricts which times the user can choose. Shown only when Selection Type includes a time.

| Option | Description |
|---|---|
| `None` | Any time can be picked. |
| `Function template` | Uses one of the built-in templates, chosen in Time Restriction Template below. |
| `Custom function` | Uses your own script, written in Time Restriction Func below. |

#### **Time Restriction Template** `object`

Shown only when Time Restrictions is **Function template**.

| Option | Description |
|---|---|
| `Disable past times` | Times earlier than now cannot be picked. |
| `Disable future times` | Times later than now cannot be picked. |

#### **Time Restriction Func** `function`

Shown only when Time Restrictions is **Custom function**. A script deciding which times are unavailable.

___

### Validations

A collapsible panel at the bottom of the Common tab. Required sits on the Common tab itself, above.

#### **Message** `string`

The text shown when validation fails, in place of the default message.

#### **Custom Validation** `function`

Your own validation rule, written as a script that returns a promise.

---

### Events

The Date Field exposes the standard event handlers described in [common properties](../common-component-properties.md#events): On Change, On Focus, On Blur, On Click, On Mouse Enter, On Mouse Move, On Mouse Leave, On Key Down, and On Key Up.

#### **On Change** `function`

In addition to the standard script variables, On Change receives `dateString`, the selected value as displayed and formatted with the configured Date and Time Format. For a range it is a `[start, end]` pair.

**Form type to use:** Edit Form - use when the user is updating an existing record.

**Example - Show the selected date as the user picked it:**

```javascript
actions.showMessage.info(`You selected ${dateString}`);
```

---

### Appearance

The Appearance tab holds the standard [Font, Dimensions, Border, Background, Shadow, Margin & Padding, and Custom Styles](../common-component-properties.md#appearance) panels, configurable per device.
