# Autocomplete

Autocomplete is used when you need an input box instead of a selector. It is an input box with text hints, and users can type freely. The keyword is aiding input.

<iframe width="100%" height="500" src="http://localhost:4000/shesha/forms-designer?id=957fcf19-42a3-4013-9329-08b1e2fc1ea9" title="Autocomplete Component" ></iframe>

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

### Selection Mode

- Set mode of selection. Options: Single (Single value), Multiple (Array of values)

### Data Source Type

- Where the component should source the data to be displayed as options. Options: Entities List, URL

### Entity Type

- Drop down of all the entities available in the systems to bind to the component as options

### Entity Filter

- The JavaScript Query Builder is a rich and responsive UI for filtering large amounts of data by creating or editing conditions. It outputs structured JSON filters that can be easily parsed to create SQL queries. It allows you to create conditions and group them using AND/OR logic. This was explained in an earlier section. Implementation can be found [here](/docs/front-end-basics/how-to-guides/filtering).

### Use Raw Values

- Raw data (sometimes called source data, atomic data, or primary data) is data that has not been processed for use. If turned off, the component on the data structure will come back as an object. E.g. <br/>`{ "id": "93fc6ee1-5e4e-4570-8383-d7489879b0a1", "_displayName": "Shesha", "_className": "Shesha.Core.Organisation" }`. <br/>If turned on, then the component will be appended to the data structure with just the Id property as a string.

### Use Quickview

- Entity display name displays the specified form in a Quickview on hover. This functionality is only possible on a details view (readonly). This is very useful in cases where the user would like to view more information about the linked entity in the form of a pop-up, however have the functionality to edit and change the value of the linked entity when on edit mode

  #### Form Path

  - This brings a dropdown list of all the forms that are available in the system and can be rendered as a quickview

  #### Get Entity Url

  - This is used in cases where you want to override the default ‘GET’ URL that is being utilized when the Entity Type has been selected.

  #### Display Property Name

  - Name of the property that should be displayed in the field. Leave empty to use the default display property defined in the backend

  #### Width

  - The display width of the quickview on hover
