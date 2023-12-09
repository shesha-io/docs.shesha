# Date and Time Picker

By clicking the input box, you can select a date or time from a popup calendar.

<iframe width="100%" height="500" src="http://localhost:4000/shesha/forms-designer?id=bf89e9d3-7609-4a6e-b937-b1fb312d769d" title="Shesha in 100 seconds" ></iframe>

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

### Range

- A date range refers to a period of time defined by two dates: a start date and an end date. This value is stored in the form data object as an array. E.g.
  ```json
  {
    "dateRange": ["2023-11-15T16:25:13", "2023-12-18T16:25:13"]
  }
  ```

### Date Only?

- When this is toggled on, it will only send a 'Date' format as a request, instead of a 'DateTime' format

### Resolve to UTC

- If switched on, the selected time will be converted to UTC (UTC stands for Coordinated Universal Time. It is the primary time standard by which the world regulates clocks and time). When written, UTC time is typically represented in the format "hh:mm:ss" (hours, minutes, seconds) and can be appended with a "Z" to denote that it is in Coordinated Universal Time. For example, "14:30:00Z" represents 2:30 PM UTC.

### Picker

- This is the type of picker. Options: Date, Week, Month, Quarter, Year

### Formats

- This provides an interface in which to alter the format of the different pickers. Please refer to [this document](https://day.js.org/docs/en/display/format) for formatting.

### Show Time

- This provides an additional time selection panel

### Show Now

- Whether to show 'Now' button on the panel when `showTime` is set

### Show Today

- Whether to show the 'Today' button

### Disabled Date Mode

- This is used to specify the dates that cannot be selected on the selection panel. Options: None, Function Template, Custom Function

### Function Template

- This provides a list of pre-populated templates that the user can utilize to disable certain dates. Options: Disable past dates, Disable future dates

### Disabled Date Function

- This provides a Javascript code editor to enter the disabled date code. You must return true to hide the date. Two objects are exposed to work with, namely ‘current’ and ‘moment’. Use these variables to write code that will hide the dates that you want.

  ```javascript
  // Future dates
  const today = moment().endOf("day");
  return current && current > today;

  // Past dates
  const yesterday = moment().subtract(1, "day").endOf("day");
  return current && current < yesterday;
  ```
