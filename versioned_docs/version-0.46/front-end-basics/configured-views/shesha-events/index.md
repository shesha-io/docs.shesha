---
sidebar_label: Form Events
---

import Card from '@site/src/components/docs/Card';

# Form Events

Event handlers are functions or methods that are designed to respond to specific events or triggers within a software application. These events can be user interactions, system events, or changes in the application state. Event handlers play a crucial role in controlling the flow of an application and responding to various scenarios. Let's explore the benefits of event handlers in the context of the form's Data tab settings, whose current names are **On Before Data Load** (`onBeforeDataLoad`, formerly known as `onInitialized`), **Prepare Submit Data** (`onPrepareSubmitData`, formerly known as `preparedValues`), **On Values Update** (`onValuesUpdate`, formerly known as `onUpdate`), and **On After Data Load** (`onAfterDataLoad`, formerly known as `onDataLoaded`).

Older forms that still use the legacy names above are automatically migrated to the current names the next time they are opened, so they keep working without manual changes.

These events contain a standard list of variables that give you access to certain variables and functions facilitating the need to respond to various scenarios. Namely:

- `data` - the form's current field values
- `moment` function for DateTime operations
- `parentFormValues`
- `initialValues`
- `message` - toast notification functionality
- `form` - the form instance, including `form.setFieldsValue` and `form.clearFieldsValue` for updating form data
- `http` - axios instance used to make http requests

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridRowGap: '50px'}}>
  <Card title='On Before Data Load' url='/docs/0.46/front-end-basics/configured-views/shesha-events/on-initialized' description='Runs before the form starts loading its data, so you can prepare things the rest of the form depends on.'/>
  <Card title='Prepare Submit Data' url='/docs/0.46/front-end-basics/configured-views/shesha-events/prepared-values' description='Allows customization or modification of form values right before submission.'/>
  <Card title='On After Data Load' url='/docs/0.46/front-end-basics/configured-views/shesha-events/on-data-loaded' description='Runs once the form has finished loading and applying its data.'/>
  <Card title='On Values Update' url='/docs/0.46/front-end-basics/configured-views/shesha-events/on-update' description='Responds to every change in the form field values.'/>
</div>
