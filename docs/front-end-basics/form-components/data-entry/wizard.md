# Wizard

The Wizard Component is designed to guide users through a series of steps or tasks, simplifying complex processes by breaking them down into smaller, manageable steps. Users can navigate forward and backward, with the flexibility to implementing custom actions at each step, and have the option to cancel through the steps of the wizard.

## Wizard Type

- The different types of wizard components can vary based on their design, functionality, and use cases.
- **Options**:
  - Default
  - Navigation

## Size

- This will set the size for all buttons.
- **Options**:
  - Default
  - Small

## Direction

- To specify the placement of the step labels.
- **Options**:
  - Vertical
  - Horizonal (Default)

## Buttons Layout

- How you want the steps buttons to be aligned
- **Options**:
  - Left
  - Right
  - Space Between (Default)

## Default Active Step

- The "Default Active Step" property allows users to define a step that will be active every time the wizard component is opened. This can be configured either by manually selecting the step or programmatically, for example:

`return contexts?.indexTable?.selectedRow?.propertyName;`

## Wizard Configuration

- Users can customize the wizard's type, size, direction, label placement, and button layout to structure and position the wizard according to their design preferences.

### Title

- The title is a brief and concise piece of text that serves as the main heading or label for a specific section or component.

### Subtitle

- The subtitle is a secondary heading or a supporting piece of text that provides additional context or information related to the main title.

### Description

- The description is a more extensive piece of text that elaborates on the details introduced in the title and subtitle. It provides a comprehensive explanation or additional information.

### Key

- Unique identifier of the wizard

### Icon

- Users can select an icon to be displayed on each wizard step.

### Allow Cancel

- When set to true, this property enables a cancel button for the wizard step. The behavior is determined based on the configurations defined in the cancel event.

### Events for Each Step

Several events are available for each step in the wizard, which make use of [configurable actions](/docs/front-end-basics/configured-views/action-configurations) for each step:

- **On Before Render**: An action triggered before the step renders.
- **Before Next**: An action triggered before the step moves to the next one.
- **After Next**: An action triggered after the step has moved to the next one.
- **Before Back**: An action triggered before the step moves to the previous one.
- **After Back**: An action triggered after the step has moved to the previous one.
- **Before Cancel**: An action triggered before the cancel event occurs.
- **After Cancel**: An action triggered after the cancel event occurs.
- After any of these events, you can handle both success and failure.

### Customizing Button Titles

Each button title can be customized to meet business requirements. By default, the buttons are named:

- Cancel
- Next
- Back
- Done

_**These titles can be overridden by using the 'Text' property on each step.**_

### Button Custom Enabled

- This allows for a custom `javascript` code to be added to determine whether a button is enabled. For instance, you may want to prevent users from proceeding before entering mandatory fields. In such cases, the button can be disabled and only enabled after the mandatory fields are captured.

_In this example, the fields `firstName`, `lastName` and `emailAddress1` are manadatory and movement to the next step should be restricted if they have not been captured_

```javascript
if (formMode != "designer") {
  //this is to prevent movement to the next step while on the form designer
  return (
    isValidProperty(data.firstName) &&
    isValidProperty(data.lastName) &&
    isValidProperty(data.emailAddress1)
  );
}

function isValidProperty(value) {
  return value !== undefined && value !== "";
}
```

## Using JS code
- You can use JS script of some controls (Buttons, etc.) to manage Wizard Component

`contexts.wizardName.current` - get the current step index (zero-based)
`contexts.wizardName.visibleSteps` - get the list of visible steps (object `IWizardStepProps`)

```javascript
interface IWizardStepProps extends IConfigurableItemBase {
  id: string;
  icon?: string;
  key: string;
  title: string;
  subTitle: string;
  description: string;
  allowCancel?: boolean;

  cancelButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
  doneButtonText?: string;
  ...
}
```

Actions to move between steps
`contexts.wizardName.api.next()` - to the next step
`contexts.wizardName.api.back()` - to the previous step
`contexts.wizardName.api.done()` - finish the wizard (execute Done configurable actions)
`contexts.wizardName.api.cancel()` - canel the wizard (execute Cancel configurable actions)
`contexts.wizardName.api.setStep(index)` - move to the step with Index (will be executed `On Before Render` configurable action)