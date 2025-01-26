# Inline CRUD Operations in Datatable

Inline CRUD operations in a datatable refer to the ability to perform Create, Read, Update, and Delete actions directly within the table interface itself. This functionality streamlines the user experience by allowing users to manipulate data without navigating to separate forms or screens. To enable this functionality, a column of type ‘CRUD’ Operations needs to be added to the list of columns. See the above example.

## Benefits

Inline editing refers to the ability to modify content directly within its display context without navigating to a separate editing interface. This feature offers several benefits:

**Efficiency and Speed**

Inline editing allows users to make quick updates directly on the page where the information is presented. This eliminates the need to navigate to a separate edit page, reducing the time and effort required for simple edits.

**Enhanced User Experience**

Users can interact with the content seamlessly, creating a more fluid and engaging experience. Inline editing reduces friction in the user workflow by providing a direct and immediate way to update information.

**Contextual Editing**

Users can edit content within the context of the surrounding elements. This context helps users understand the relationships between different pieces of information and ensures that edits are made with a clear understanding of the content's role within the larger context.

**Reduced Cognitive Load**

Inline editing simplifies the editing process by eliminating the need to switch between viewing and editing modes. This reduction in cognitive load can enhance user focus and productivity.

**Real-time Feedback**

Changes made through inline editing often provide real-time feedback, allowing users to see the impact of their edits immediately. This instant feedback can help users make more informed decisions and corrections.

**Mobile-Friendly**

Inline editing is well-suited for responsive and mobile-friendly designs. It accommodates the constraints of smaller screens by allowing users to interact with content directly, without the need for additional screens or pop-ups.

**Natural Interaction**

Inline editing mimics the way users interact with physical documents or objects. Users can click on, edit, and save content in a way that feels intuitive and familiar.

**Error Prevention**

With inline editing, users can catch errors or inaccuracies quickly as they review and update content in its natural context. This can contribute to better data accuracy and reduce the likelihood of mistakes.

**Workflow Integration**

Inline editing can be seamlessly integrated into existing workflows, making it easier for users to perform edits as part of their regular tasks. This integration promotes a smoother and more streamlined workflow.

**Customization and Flexibility**

Inline editing can be customized to suit different types of content and user preferences. It provides flexibility in how users interact with and update information, catering to diverse user needs.

It's important to note that while inline editing offers numerous benefits, its suitability depends on the specific use case, the type of content being edited, and the preferences of the target users. In certain situations, more complex edits may still require a dedicated editing interface.

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

## Additional Configurations

- **Can Add / Edit / Delete Inline:** Controls the visibility of the CRUD operation icons based on the enabled action under certain conditions. Options: Yes, No, Inherit, Expression (provides a Javascript code editor to return true or false based on a condition).
- **Row Edit Mode:** Specifies how the editing in the table is to be applied. Options: One by one, All at once.
- **Save Mode:** Options: Manual, Auto.
- **New Row Capture Position:** Specifies how to order the data of the newly created entry in relation to other information on the table. Options: Top, Bottom.
- **Custom Create / Update / Delete Url:** Overrides the default CRUD endpoints linked to the CRUD operations based on the entity the context is bound to (e.g., ‘/api/dynamic/Shesha/Organisation/Update’).
- **New Row Init:** Allows configurators to specify logic to initialize the object bound to a new row.

In the provided example, a child table is configured to display membership payments, and the details of the member are stored on the parent form. To access member information, the logic is configured as follows:

```javascript
return {
  member: formData.id,
};
```

This adds the member ID to the payload for inclusion in the API call.

- **On Row Save:** Allows custom business logic to be executed on saving a new/updated row (e.g., custom validation/calculations).
- **On Row Save Success:** Custom logic to be executed after successfully saving a new/updated row, exposing standard 'Action Configurations' as previously discussed.

## Example Usage

For an implementation example, please refer to the 'How-To Guide: [Inline Editing Initialization](../../how-to-guides/inline-editing-initialization.md)'
