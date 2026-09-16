---
sidebar_label: Address Input
title: Address Input
---

# Address Input

The Address Input component captures an address and, optionally, the exact point on the map it refers to. The user can type and pick from address suggestions, or open an interactive map and drop a pin on the location directly. The map is part of Shesha core, so you do not need an extra package to use it.

Use it when a typed address is not precise enough on its own: a delivery point in an area with no street numbering, a site visit location, or anywhere you need to store coordinates you can later use for mapping or distance calculations.

---

## Properties

The following properties are available to configure the behaviour of the component from the form editor (this is in addition to [common properties](../common-component-properties.md)).

The panel is organised into four tabs: **Common**, **Data**, **Validation**, and **Security**.

---

### Common

The Common tab holds the standard Property Name, Label, Placeholder, Tooltip, Edit Mode, and Hide settings described in [common properties](../common-component-properties.md).

---

### Data

These settings connect the component to Google Maps and control the map dialog.

#### **Google Maps API Key** `string`

The API key for the Google Maps JavaScript API. The key must have both the **Places** and **Maps** libraries enabled, since the component uses Places for the address suggestions and Maps for the picker.

:::warning The map needs a key
Without a valid key, no address suggestions appear and the map button is not shown. If the component renders as a plain text box, check the key first.
:::

#### **Enable Map Interface** `boolean`

Shows a map pin button next to the input. Clicking it opens an interactive map dialog where the user drops a pin on the location, and the address and coordinates are filled in from the point they chose.

Leave this off when you only want a typed address and have no use for coordinates.

#### **Latitude Property** `string`

The path on the form data where the latitude is written, in dot notation, for example `address.latitude`.

#### **Longitude Property** `string`

The path on the form data where the longitude is written, in dot notation, for example `address.longitude`.

:::note Coordinates are only stored if you say where
The component writes latitude and longitude only when these two properties name a destination. Leave them empty and the picked point is used to resolve the address text, but the coordinates themselves are not saved.
:::

#### **Default Zoom** `number`

The zoom level the map opens at, from 1 to 20. Defaults to 15, which shows a street-level view.

A lower number zooms out. If your users typically pick a location within a known town, the default is usually right. Start lower when they might be picking anywhere in a region.

#### **Map Height (px)** `number`

The height of the map inside the dialog, in pixels. Defaults to 400.

#### **Map Width (px)** `number`

The width of the map inside the dialog, in pixels. Defaults to the full width of the dialog.

---

### Validation

#### **Required** `boolean`

The form cannot be submitted while this component has no value. See the [common Required property](../common-component-properties.md#validations).

---

### Security

#### **Permissions** `object`

Restricts the component to users holding one of the named permissions. See the [common Permissions property](../common-component-properties.md#permissions).

---

## See Also

- [Address](./address.md) - the simpler address lookup, when you do not need a map picker.
