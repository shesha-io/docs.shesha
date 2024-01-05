---
sidebar_position: 2
---

# Event Handlers

Event handlers are functions that get triggered on on specific envents in a component lifecycle.

All form components have a set of event handlers that can be used to respond to specific triggers as the user interacts with the application. These include the following:

## onChange

Triggered on change of the component's value such as on input changes or change of selection in the case of selected based components such as radio buttons, check boxes or drop down list.

## onFocus

Triggered on the component receives the focus.

## onBlur

Triggered when a previously selected component loses focus.

## onSelect

An event which is triggered every time an address is selected.


These events contain a standard list of variables that give the user access to certain variables and functions facilitating the need to respond to various scenarios. Namely:

- `form data`
- `event` callback when an input is made
- current `mode` of the form
- A function used to `setFormData`
- `moment` function for DateTime operations
- `ParentFormValues`
- `InitialValues`
- `toast message` functionality
- `form instance`
- `axios instance used to make http requests`
