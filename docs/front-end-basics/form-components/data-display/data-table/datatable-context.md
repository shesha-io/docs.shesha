# Datatable Context

A datatable context component is a powerful tool that allows users to manage and manipulate tabular data within an application. It's often used in scenarios where you need to display, organize, and interact with data in a structured, table-like format. Below are the key functionalities:

1. **Data Display:**

   - The datatable context component primarily serves to display data in a table format. It could be information retrieved from a database, an API, or entered directly by users.

2. **Customization:**

   - Users can typically customize the appearance and behavior of the table. This may involve setting column headers, defining data types for each column, adjusting the table's styling, and configuring how the data is presented.

3. **Data Interaction:**

   - This component allows users to interact with the data. Common functionalities include sorting columns, filtering data based on specific criteria, and searching within the table. Users might also be able to edit, delete, or add new data directly from the table interface.

4. **Data Source Binding:**

   - The datatable context component is often connected to a data source, which could be a database, an API, or an internal data structure within the application. This binding enables the table to dynamically reflect changes in the underlying data.

5. **Contextual Actions:**

   - Some platforms allow for contextual actions within the datatable. For example, clicking on a specific row might trigger an action, like displaying more details about that particular entry, opening a related form for editing, or initiating a specific workflow related to the selected data.

6. **Integration with Other Components:**
   - This component often integrates with other elements or functionalities within the application. For instance, the data displayed in the table might be linked to forms, charts, or other components for a more comprehensive user experience.

The "context" in a datatable context component typically refers to the ability to manage and manipulate the context or environment in which the table operates. This might include setting rules, managing data relationships, and configuring how the table interacts with the rest of the application.

Overall, the datatable context component provides an intuitive and efficient way to manage and display structured data within an application. It streamlines the process of presenting, interacting with, and managing tabular data, offering a user-friendly interface for data manipulation.

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

- **Source Type:**
  - Options: Entity, Form, URL

### Entity

- **Entity Type:**
  - This provides a dropdown of all the entities available in the application that the component can use as a data source.
  - By default, the GET URL that is used is `/api/services/app/Entities/GetALL`. This will do a default ‘GET ALL’ of the entity that you have selected.
- **Custom Endpoint:**
  - This allows you to override the default ‘GET ALL’ URL provided when you selected the entity to be binded to the context. You can override that by providing the GET ALL URL.

### URL

- **Custom Endpoint:**

  - This allows you to provide a ‘GET ALL’ URL to bind to the table as a datasource if you do not want to bind the context to an entity but to a custom endpoint.

- **Data Fetching Mode:**

  - Options:
    - **Paging:**
      - Paging is a technique used to manage large datasets by breaking them into smaller, manageable chunks or pages.
      - Default Page Size specifies how much fetched data should be displayed per request.
    - **Fetch All:**
      - Fetch all involves retrieving the entire dataset in one go.

- **Sort Mode:**

  - Options:
    - **Standard:**
      - In standard mode, users can sort the table data by clicking on column headers or by specifying one or more sorting properties and the sorting order.
      - 'Allow sorting' option enables users to sort the table by clicking on the column header.
    - **Strict:**
      - Strict mode allows users to specify one or more properties for ordering the table data.

- **Grouping:**
  - The grouping feature allows users to group table data by specifying one or more properties and the desired sort mode for each grouping. If one or more grouping rows are specified, these properties will always appear first in the sort by clause prior to any other manually ordered columns.
