---
sidebar_label: DEPRACATED - Child Table
---

# Child Table

A child table component is a feature within a table or data display structure that allows the representation of related data in a hierarchical or nested format. It's often used in scenarios where one set of data is directly associated with or linked to another set, creating a parent-child relationship.

## Title

This is the title of the Child Table Component.

## Allow Quick Search

When this is toggled off, the quick search component will be hidden from the UI.

## Is Button Inline

By default, the child table buttons are not inline, which refers to a user interface element that is distinct and separate from the content, meaning it's not embedded within a text passage or content block. Instead, it stands alone as a separate interactive element within the interface, represented by a 3 dotted-line hover button. When this is toggled on, the button group content will be displayed within a content block or a text passage, allowing users to perform specific actions or trigger events directly from that specific location.

## Show Pagination

When this is toggled off, the table pager component will be hidden from the UI.

## Customize Button Group

A customizable button group on a child table refers to a set of interactive buttons within a nested or child table component that can be tailored or configured to perform specific actions related to the data displayed within the child table. This exposes the standard set of button styling and actions as previously discussed.

## Column Types

All columns come with a standard set of properties used to configure look and feel, visibility, captions, and even additional information about the information in the column.

- ### Data

This is for when you only want your column to act as a data display in the table.

- ### Action

This is for when you want your column to execute some type of actions. This exposes the ‘Action Configurations’ exposed on each button, as discussed previously.

- ### CRUD Operations

This is for when Inline actions are enabled. This column will be used to trigger the different CRUD operations that the user has enabled on the table. Namely: ADD, EDIT, and DELETE. This topic will be discussed more in depth later on in the section.

## Customize Filters

Customizable filters on a child table refer to a feature that enables users to refine and narrow down the data displayed within a nested or child table component. These filters are adjustable, allowing users to set specific criteria to control the information displayed within the child table. This exposes a view where you can define a list of views or filters using a query builder, that also has dynamic mustache values functionality. Implementation can be found [here](/docs/front-end-basics/how-to-guides/filtering).
