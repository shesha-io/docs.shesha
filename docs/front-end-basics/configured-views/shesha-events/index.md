import Card from '@site/src/components/docs/Card';

# Form Events

Event handlers are functions or methods that are designed to respond to specific events or triggers within a software application. These events can be user interactions, system events, or changes in the application state. Event handlers play a crucial role in controlling the flow of an application and responding to various scenarios. Let's explore the benefits of event handlers in the context of: `onInitialized`, `PreparedValues`, `OnUpdate`, and `OnDataLoaded`.

These events contain a standard list of variables that give the user access to certain variables and functions facilitating the need to respond to various scenarios. Namely:

- `form data`
- `moment` function for DateTime operations
- `ParentFormValues`
- `InitialValues`
- `toast message` functionality
- `form instance`
- `axios instance used to make http requests`
- A function used to `setFormData`

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridRowGap: '50px'}}>
  <Card title='On Initialized' url='on-initialized' description='Initializes tasks and conditions when a component or feature is initialized.'/>
  <Card title='Prepared Values' url='prepared-values' description='Allows customization or modification of form values before submission.'/>
  <Card title='On Data Loaded' url='on-data-loaded' description='Handles asynchronous data loading processes.'/>
  <Card title='On Update' url='on-update' description='Responds to changes in the state of a component or application.'/>
</div>
