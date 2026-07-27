# API for saving files

`fileSaver` object provides a function that can be used to save files to the backend. The function takes the following parameters: 

- `data`: The data to save. This can be a string or an object.
- `filename`: The name of the file to save.
- `options`: The options for the file save.

```typescript
fileSaver.saveAs(data: string | object, filename?: string, options?: object) => void
```
