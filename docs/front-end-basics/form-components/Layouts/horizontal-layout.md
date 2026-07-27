---
sidebar_label: Horizontal Layout
title: Horizontal Layout
---

# Horizontal Layout

The horizontal layout is an application layout built for public-facing portals. Instead of the default layout's collapsible sidebar menu, it places navigation along the top of the page, which suits landing pages and public sites where a full-width content area matters. It is part of Core, so it is available to every Shesha application without any extra packages.

---

## What the layout provides

The horizontal layout supports the pieces you need for a public portal.

| Feature | Description |
|---|---|
| Header | A configurable header, set from a form. |
| Footer | A configurable footer, set from a form. |
| Breadcrumbs | A breadcrumb trail for the current page. |
| Sticky heading | An optional setting that keeps the heading fixed at the top of the page as the user scrolls. It is off by default. |
| Show heading | Controls whether the heading area is shown. It is on by default. |

Shesha ships with pre-configured header and footer forms for the public portal, named `header-public-portal` and `footer-public-portal` in the `Shesha` module. You can use these as they are or replace them with your own.

---

## Choosing the layout for your application

The layout your application uses is set in one place in the front-end project, in the layout constants file (`mainLayout/constant.ts`). The `LAYOUT_MODE` constant accepts one of two values.

| Value | Layout |
|---|---|
| `defaultLayout` | The traditional layout with a collapsible sidebar menu. |
| `horizontalLayout` | The horizontal top-navigation layout described on this page. |

To switch your whole application to the horizontal layout, set the constant to `horizontalLayout`.

___

## Switching layouts at runtime

If you need to choose the layout dynamically rather than fixing it for the whole application, use the `useLayoutSelection` hook. It exposes the current `layoutMode`, a `setLayoutMode` function to change it between `defaultLayout` and `horizontalLayout`, and a wrapper that applies the chosen layout to a page.

:::tip
Use the constant when the whole application uses one layout. Reach for the `useLayoutSelection` hook only when you need different parts of the application to use different layouts.
:::

---

## Horizontal Menu component

The horizontal layout is paired with the **Horizontal Menu** component, available in the form designer toolbox. It renders the top navigation and gives you detailed control over how the menu looks.

### Appearance

The Appearance tab controls how the menu behaves and how its items look.

#### **Overflow** `string`

Controls what happens when the menu has more items than fit across the available width. The options are `dropdown`, `menu`, and `scroll`.

___

### Menu styles

The menu styles group controls the look of the menu items themselves.

| Group | What you can set |
|---|---|
| Colors | Item colour and background, hover colour and background, selected colour and background, and sub-item colour and background. |
| Font | Family, size, weight, colour, and alignment. |
| Gap | The spacing between menu items. |
| Custom styles | Style overrides for the default, hover, selected, and sub-menu states. |

___

### Container styles

The container styles group controls the menu's outer container.

| Group | What you can set |
|---|---|
| Dimensions | Width, minimum and maximum width, and height, minimum and maximum height. |
| Border | Border colour, width, style, and radius. |
| Background | Colour, gradient, image, or stored file. |
| Shadow | Offset, blur, spread, and colour. |
| Margin and padding | Spacing around and inside the container. |
| Custom styles | Style overrides for the container. |
