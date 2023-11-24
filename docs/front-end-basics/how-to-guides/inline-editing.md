# Inline CRUD Operations in Datatable

Inline CRUD operations in a datatable refer to the ability to perform Create, Read, Update, and Delete actions directly within the table interface itself. This functionality streamlines the user experience by allowing users to manipulate data without navigating to separate forms or screens. To enable this functionality, a column of type ‘CRUD’ Operations needs to be added to the list of columns. See the above example.

## READ

The main function of a table is to display existing data. Users can view the information in a tabular format, making it easy to scan through different entries and access details within the table cells.

### Configuring Columns

On each column configuration on a table, there is a ‘Display Component’ property setting that allows the user to select which component they would like to use as a form of data display on the table. Each option provides standard configuration properties relevant to the component for a better user experience.

## CREATE

Users can add new data rows directly within the table interface, involving an empty row at the end of the table where users can input new information. Upon submission, this data is added to the dataset without leaving the table.

### Configuring Columns

On each column configuration on a table, there is a ‘Create Component’ property setting that allows the user to select which component they would like to use as a form of data entry on the table. Each option provides standard configuration properties relevant to the component for a better user experience.

## EDIT

Users can edit or update existing data within the table. Clicking on a cell or row might transition it into an editable state, allowing users to modify the content directly within the table.

### Configuring Columns

On each column configuration on a table, there is an ‘Edit Component’ property setting that allows the user to select which component they would like to use as a form of data entry on the table. Each option provides standard configuration properties relevant to the component for a better user experience.

### Additional Configurations

- **Can Add / Edit / Delete Inline:** Controls the visibility of the CRUD operation icons based on the enabled action under certain conditions. Options: Yes, No, Inherit, Expression (provides a Javascript code editor to return true or false based on a condition).
- **Row Edit Mode:** Specifies how the editing in the table is to be applied. Options: One by one, All at once.
- **Save Mode:** Options: Manual, Auto.
- **New Row Capture Position:** Specifies how to order the data of the newly created entry in relation to other information on the table. Options: Top, Bottom.
- **Custom Create / Update / Delete Url:** Overrides the default CRUD endpoints linked to the CRUD operations based on the entity the context is bound to (e.g., ‘/api/dynamic/Shesha/Organisation/Update’).
- **New Row Init:** Allows configurators to specify logic to initialize the object bound to a new row.
- **On Row Save:** Allows custom business logic to be executed on saving a new/updated row (e.g., custom validation/calculations).
- **On Row Save Success:** Custom logic to be executed after successfully saving a new/updated row, exposing standard 'Action Configurations' as previously discussed.

### Example Usage

In the provided example, a child table is configured to display membership payments, and the details of the member are stored on the parent form. To access member information, the logic is configured as follows:

```javascript
return {
  member: formData.id,
};
```

This adds the member ID to the payload for inclusion in the API call.
