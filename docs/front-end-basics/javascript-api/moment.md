---
sidebar_label: Moment 
---

# Moment

[Moment.js](https://momentjs.com/) is a library for parsing, validating, manipulating, and displaying dates and times in JavaScript. Shesha exposes it to your form scripts through the `moment` variable, so you can work with dates without writing your own date-handling logic.

`moment` is the genuine Moment.js library (not a substitute date library), so every feature documented on [momentjs.com](https://momentjs.com/) is available to you: creating moments, formatting them, and manipulating them.

---

## Using Moment

`moment` is the full Moment.js factory function. You can call it the same way you would in any JavaScript project:

```javascript
moment()                          // the current date and time
moment('2024-01-01')              // parse a specific date
moment().format('DD MMM YYYY')    // format a moment as a string
moment().add(1, 'days')           // manipulate a moment
```

`moment` is available anywhere the standard script variables are - component property expressions, event handlers such as On Before Data Load, button actions, and validation scripts.

---

## Examples

**Form type to use:** Any form with a Date Picker component that has a Disabled Date expression.

**Example - Disable dates using a Moment comparison:**

```javascript
return current && current < moment().endOf('day');
```

---

**Form type to use:** Table / List View - used inside a Data List item template to format a date field for display.

**Example - Format a date field for display:**

```
Created: {{data.creationTime ? moment(data.creationTime).format('DD MMM YYYY') : 'N/A'}}
```
