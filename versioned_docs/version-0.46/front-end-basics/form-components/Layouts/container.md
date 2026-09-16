---
sidebar_label: Container
title: Container
---

# Container

The Container component groups other components together into a single box, using CSS flex, grid, or block layout to arrange them. Use it to build rows, columns, or grids of other components, and to apply a shared background, border, or spacing to the group as a whole.

---

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)). Container groups its settings into **Common**, **Events**, and **Appearance** tabs. Permissions are set on the Visible and Interaction Mode settings on the Common tab, using the lock icon beside each.

### Common

#### **No Default Styling** `boolean`

When checked, Shesha's default container styles and CSS classes are not applied, leaving the container's appearance entirely up to the other settings below (or your own Custom CSS Class).

___

### Appearance

Like most components, these settings can be configured separately per device (desktop, tablet, mobile) using the device switcher at the top of the panel. Unlike most components, Container's Appearance tab has no Font panel.

#### Display

**Layout Type** sets the container's CSS `display` value - it controls whether an element is treated as a block or inline element, and the layout used for its children (flow layout, grid, or flex). There are four options:

| Option | Description |
|---|---|
| **Block** | The container behaves like a `<p>` tag: it starts on a new line, takes up the full width available, and its children stack one after another. This is the default. |
| **Grid** | The container becomes a block-level grid container, arranging its children into rows and columns. |
| **Flex** | The container becomes a block-level flex container, letting you control the direction, wrapping, and alignment of its children along a single axis. |
| **Inline Grid** | The container becomes an inline-level grid container - it behaves like Grid, but sits inline with surrounding content instead of starting on a new line. |

Choosing **Grid**, **Flex**, or **Inline Grid** reveals further controls, described below.

**Gap** `string` sets the spacing between children, for example `10`, `10px`, or `20px 20px`. It is shown for Flex, Grid, and Inline Grid.

**Grid Columns Count** `number` sets how many columns the grid should have. It is shown only for Grid and Inline Grid.

By default the panel shows a small set of **quick controls** - button groups with icons for the most common values. A **Show Advanced** toggle next to them swaps in full dropdowns for **Flex Direction**, **Flex Wrap**, **Justify Content**, **Align Items**, **Align Self**, **Justify Items**, and **Justify Self**, giving access to the complete set of CSS values rather than just the common ones.

:::note
`Inherit`, `Initial`, `Revert`, `Revert Layer`, and `Unset` are standard CSS keywords available on most of the properties below. They aren't specific to this container: `Inherit` copies the parent element's value, `Initial` resets to the property's default, `Revert` reverts to the value the browser's own stylesheet would apply, `Revert Layer` reverts to the value from an earlier CSS cascade layer, and `Unset` acts as `Inherit` for properties that normally inherit, or as `Initial` otherwise.
:::

#### **Flex Direction** `object`

Sets how flex items are placed in the flex container - the main axis and its direction (normal or reversed). Shown only when Layout Type is Flex.

The quick controls offer two values:

| Option | Description |
|---|---|
| **Row** | Items are laid out horizontally, left to right. This is the default. |
| **Column** | Items are laid out vertically, top to bottom. |

Turning on **Show Advanced** adds:

| Option | Description |
|---|---|
| **Row Reverse** | Same as Row, but items are laid out in reverse order, right to left. |
| **Column Reverse** | Same as Column, but items are laid out in reverse order, bottom to top. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Flex Wrap** `object`

Sets whether flex items are forced onto multiple lines, and the direction of that wrapping. Shown only in Advanced mode, for Flex layouts.

| Option | Description |
|---|---|
| **No Wrap** | All items stay on a single line, shrinking to fit if necessary. This is the default. |
| **Wrap** | Items move onto additional lines once they run out of room on the current one. |
| **Wrap Reverse** | Same as Wrap, but the lines stack in reverse order. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Justify Content** `object`

Aligns children along the main axis - horizontally for Row, vertically for Column - when they don't fill all the available space. Shown for Flex, Grid, and Inline Grid.

The quick controls adapt to the chosen Flex Direction. For **Row**, the options are:

| Option | Description |
|---|---|
| **Left** | Items are packed against the left edge of the container. This is the default. |
| **Center** | Items are centred along the main axis. |
| **Right** | Items are packed against the right edge of the container. |

For **Column**, the quick options are **Start**, **Center**, and **End**, aligning items to the top, middle, or bottom of the container instead.

Turning on **Show Advanced** adds the full set of CSS values:

| Option | Description |
|---|---|
| **Start** | Items are placed at the start of the axis, respecting the text direction. |
| **End** | Items are placed at the end of the axis, respecting the text direction. |
| **Flex Start** | Items are placed at the start of the flex container's main axis. |
| **Flex End** | Items are placed at the end of the flex container's main axis. |
| **Normal** | Default behaviour - equivalent to Stretch for most layouts. |
| **Space Between** | Even space is placed between items, with no space at the outer edges. |
| **Space Around** | Even space is placed around every item, including half-sized space at the outer edges. |
| **Space Evenly** | Items are spaced so the gap between any two items, and between the items and the container edges, is equal. |
| **Stretch** | Items stretch to fill the container along the main axis. |
| **Safe Center** | Centres items, but falls back to start-alignment if centring would push content out of view. |
| **Unsafe Center** | Centres items even if that pushes content out of view. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Align Items** `object`

Aligns children along the cross axis - vertically for Row, horizontally for Column. Shown for Flex, Grid, and Inline Grid.

The quick controls adapt to the chosen Flex Direction. For **Row**, the options are **Start**, **Center**, and **End**, aligning items to the top, middle, or bottom of the container. For **Column**, the same three options align items to the left, middle, or right instead.

Turning on **Show Advanced** adds the full set of CSS values:

| Option | Description |
|---|---|
| **Normal** | Default. Behaves like Stretch for flexbox and grid items, or Start for grid items with a defined block size. |
| **Stretch** | Items stretch to fill the container along the cross axis. |
| **Center** | Items are centred along the cross axis. |
| **Start** | Items are placed at the start of their grid cell or the cross axis. |
| **End** | Items are placed at the end of their grid cell or the cross axis. |
| **Baseline** | Items are aligned so their text baselines line up. |
| **First Baseline** | Aligns to the first baseline of the alignment context. |
| **Last Baseline** | Aligns to the last baseline of the alignment context. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Align Self** `object`

Overrides Align Items for this one container. In Grid, it aligns the container inside its grid area; in Flexbox, it aligns the container on the cross axis. Shown only in Advanced mode.

| Option | Description |
|---|---|
| **Auto** | Uses the parent's Align Items value instead of overriding it. This is the default. |
| **Normal** | Behaves like Stretch for most layouts. |
| **Stretch** | The container stretches to fill the available space on the cross axis. |
| **Center** | The container is centred on the cross axis. |
| **Start** | The container is placed at the start of the cross axis. |
| **End** | The container is placed at the end of the cross axis. |
| **Self Start** | Aligns to the start edge of the container's own alignment area. |
| **Self End** | Aligns to the end edge of the container's own alignment area. |
| **Flex Start** | Aligns to the start of the flex container's cross axis. |
| **Flex End** | Aligns to the end of the flex container's cross axis. |
| **Baseline** / **First Baseline** / **Last Baseline** | Aligns so text baselines line up, as described under Align Items above. |
| **Safe Center** / **Unsafe Center** | Centres the container, with or without protection against overflow, as described under Justify Content above. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Justify Items** `object`

Aligns grid children along the inline (row) axis inside their grid cells. Shown only in Advanced mode, and only when Layout Type is Grid or Inline Grid.

| Option | Description |
|---|---|
| **Normal** | Default behaviour - equivalent to Stretch for most layouts. |
| **Stretch** | Items stretch to fill their grid cell. |
| **Center** | Items are centred inside their grid cell. |
| **Start** | Items are placed at the start of their grid cell. |
| **End** | Items are placed at the end of their grid cell. |
| **Flex Start** / **Flex End** | Aligns to the start or end of the flex container's main axis, for consistency with flex layouts. |
| **Left** | Items are packed against the left edge of the cell. |
| **Right** | Items are packed against the right edge of the cell. |
| **Space Between** / **Space Around** / **Space Evenly** | Distributes items with even spacing, as described under Justify Content above. |
| **Safe Center** / **Unsafe Center** | Centres items, with or without protection against overflow, as described under Justify Content above. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

#### **Justify Self** `object`

Sets the way this one container is justified inside its alignment container along the appropriate axis, overriding Justify Items for just this element. Shown only in Advanced mode.

| Option | Description |
|---|---|
| **Auto** | Uses the parent's Justify Items value instead of overriding it. This is the default. |
| **Normal** | Behaves like Stretch for most layouts. |
| **Stretch** | The container stretches to fill its grid cell. |
| **Center** | The container is centred inside its grid cell. |
| **Start** | The container is placed at the start of its grid cell. |
| **End** | The container is placed at the end of its grid cell. |
| **Self Start** / **Self End** | Aligns to the start or end edge of the container's own alignment area. |
| **Flex Start** / **Flex End** | Aligns to the start or end of the flex container's main axis, for consistency with flex layouts. |
| **Left** / **Right** | Packs the container against the left or right edge of its grid cell. |
| **Baseline** / **First Baseline** / **Last Baseline** | Aligns so text baselines line up, as described under Align Items above. |
| **Safe Center** / **Unsafe Center** | Centres the container, with or without protection against overflow, as described under Justify Content above. |
| **Inherit** / **Initial** / **Revert** / **Revert Layer** / **Unset** | Standard CSS keywords - see the note above. |

___

#### Custom Styles

Container's Custom Styles panel exposes three properties, including two separate style scripts (Wrapper Style and Style) instead of the single Style script most components have:

- **Custom CSS Class** `string` - a custom class name applied to the container.
- **Wrapper Style** `function` - a script returning a style object for the container's outer element, the one that also carries the Border, Background, Shadow, Dimensions, and Margin/Padding settings above.
- **Style** `function` - a script for the inner content area only, not the outer element.

:::tip
If a style isn't taking effect, check whether you set it on **Style** when it needed to be on **Wrapper Style**, or the reverse - they target different elements.
:::
