---
sidebar_label: Moment
---

# Moment

`moment` is a ready-to-use instance of the [Moment.js](https://momentjs.com/) library, made available inside every Shesha form script. Moment.js is a library for parsing, validating, manipulating, and displaying dates and times in JavaScript, so you can work with dates in your script code without needing to import anything yourself.

---

## Using Moment in Scripts

`moment` behaves exactly like the `moment` object you would get from importing the `moment` npm package directly - it is not a custom wrapper, so the full [Moment.js API](https://momentjs.com/docs/) is available, including parsing dates, formatting them for display, and calculating differences between dates.

:::note
Shesha currently exposes version `2.25.3` of Moment.js. No custom locale or default format is applied, so `moment` behaves the same way it would in any other JavaScript project.
:::

---

## Example

**Form type to use:** Edit Form - use when you want to calculate a value from a date already loaded onto the form.

**Example - Calculate an age from a date of birth field:**

```javascript
const dob = data.dateOfBirth;
if (dob) {
  const age = moment().diff(moment(dob), 'years');
  form.setFieldsValue({ age });
}
```
