# Utils

The **application.utils** object provides access to the utils API. This object gives access to utility functions that can be used to perform different actions.

## `application.utils.evaluateString`

This function can be used to evaluate a string that uses Mustache syntax (see [Mustache syntax](https://mustache.github.io/)).

```typescript
application.utils.evaluateString(expression: string)
```
### Example
```typescropt
// Example record data
const data = {
  id: "REC-1001",
  name: "Shesha",
  status: "Active"
};

// Mustache expression using data.id
const expression = "Record {{data.id}} belongs to {{data.name}} and is currently {{data.status}}.";

// Evaluate the expression
const result = application.utils.evaluateString(expression, { data });

console.log(result);
// Output: "Record REC-1001 belongs to Shesha and is currently Active."
```