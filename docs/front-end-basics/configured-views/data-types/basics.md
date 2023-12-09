# Basic

Basic data types refer to the fundamental categories of values that programming languages use to represent different kinds of information. These data types define the nature of the values that variables can hold and determine the operations that can be performed on those values. Common basic data types include:

## Text/String

- **Description:** Used for storing alphanumeric characters and text.
- **Example:** "Hello, World!"

## Number/Integer/Decimal

- **Description:** Used for numeric values, either integers (whole numbers) or decimals (floating-point numbers).
- **Example:** 42, 3.14

## Boolean

- **Description:** Represents true or false values.
- **Example:** true, false

## Date/Time

- **Description:** Used for representing dates and times.
- **Example:** 2023-11-21, 14:30:00

## Object/Record

- **Description:** A structured data type that can hold multiple values or properties.
- **Example:**

```json
{ "name": "John", "age": 25, "city": "New York" }
```

## Array/List

- **Description:** An ordered collection of values of the same or different data types.
- **Example:** [1, 2, 3], ["apple", "orange", "banana"]

## File/Blob

- **Description:** Used for handling binary data, such as images, documents, or multimedia files.
- **Example:** Binary representation of an image or a document.

## null

- **Definition:** `null` is a primitive value that represents the intentional absence of any object value or no value or no reference.
- **Use Cases:**
  - It is often explicitly assigned to variables or properties to indicate that there is no valid object, array, or value associated with them.
  - It can be used to reset or clear the value of a variable.
- **Example:**
  ```javascript
  let myVariable = null; // explicitly assigning null
  ```

## undefined

- **Definition:** `undefined` is a primitive value automatically assigned to variables that have been declared but have not been assigned a value.
- **Use Cases:**
  - It is the default value of function parameters that are not provided.
  - It is the default value of declared variables that are not initialized.
  - It is often used to check if a variable has been assigned a value.
- **Example:**

  ```javascript
  let myVariable; // undefined by default

  function myFunction(parameter) {
    console.log(parameter); // If no argument is passed, parameter is undefined
  }

  let someVariable;
  if (typeof someVariable === "undefined") {
    console.log("Variable is undefined.");
  }
  ```

In summary, `null` is typically used when you want to explicitly indicate the absence of a value, while `undefined` is a default value assigned by the JavaScript engine when a variable is declared but not assigned a value. Understanding these distinctions is important for writing robust and error-resistant code. It's also worth noting that both `null` and `undefined` are falsy values in JavaScript, meaning they evaluate to false in a boolean context.
