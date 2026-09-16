---
sidebar_position: 2
sidebar_label: Developing Configurable Components
---

# Developing Configurable Components

A comprehensive guide to developing configurable components in the **Shesha low-code platform**.

### Prerequisites
- Node.js v24+ (the `shesha-reactjs` package requires Node `>=24` and npm `>=11`)
- npm or yarn
- Git

### Getting Started

Fork [shesha-io/shesha-framework](https://github.com/shesha-io/shesha-framework) to your own GitHub account first (`git fork` is not a real Git command - use the **Fork** button on GitHub), then clone your fork:

```bash
git clone https://github.com/<your-github-username>/shesha-framework.git
cd shesha-framework

# Install dependencies
cd shesha-reactjs
npm install

# Start development server
npm run dev
```


## Architecture Overview

Shesha is a low-code platform built on:

- **Next.js + TypeScript**
- **Ant Design components**



## Project Structure

```
shesha-framework/
├── shesha-reactjs/              # Frontend React project (npm library)
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── designer-components/ # Form designer components
│   │   │   ├── _common/         # Shared utilities
│   │   │   ├── _settings/       # Settings components
│   │   │   └── numberField/     # Example component
│   │   ├── hooks/               # Custom React hooks
│   │   ├── providers/           # Context providers
│   │   └── styles/              # Styling system
├── shesha-core/                 # Backend class libraries (ASP.NET Core / ABP)
├── shesha-starter/               # Starter project (frontend + backend + seeded database)
└── shesha-functional-tests/      # Functional test project
```

## Component Development

### Core Files Structure

Every Shesha component requires **3 essential files**, matching the component's folder name rather than `index.tsx`:

```
designer-components/myComponent/
├── myComponent.tsx   # Main component implementation
├── interfaces.ts     # TypeScript interfaces
├── settingsForm.ts   # Configuration settings
├── styles.ts         # Component styling (optional)
└── utils.ts          # Helper functions (optional)
```

:::note
Real components (for example `numberField/numberField.tsx`, `textField/textField.tsx`) implement the component in a file named after the component, not `index.tsx`, and are imported by that explicit path in `providers/form/defaults/toolboxComponents.ts` (e.g. `import NumberFieldComponent from '@/designer-components/numberField/numberField';`).
:::

### 1. Component Interface (`interfaces.ts`)

```typescript
import { IConfigurableFormComponent } from '@/providers/form/models';

export interface IMyComponentProps extends IConfigurableFormComponent {
  placeholder?: string;
  customValue?: string;
  validate?: {
    required?: boolean;
    minLength?: number;
    message?: string;
  };
}
```

### 2. Settings Configuration (`settingsForm.ts`)

:::warning Use the `fbf` builder, not `DesignerToolbarSettings`
There is no `DesignerToolbarSettings` class in `shesha-reactjs`. Every settings form exports a `SettingsFormMarkupFactory` that receives a form-builder factory function, conventionally named `fbf`, and calls `fbf(parentId)` to start a chain of `.addXxx(...)` / `.stdXxx(...)` calls ending in `.toJson()`. See `designer-components/numberField/settingsForm.ts` for a real example; the example below follows the same pattern.
:::

```typescript
import { SettingsFormMarkupFactory } from '@/interfaces';
import { nanoid } from '@/utils/uuid';

export const getSettings: SettingsFormMarkupFactory = ({ fbf, removeStyleRouter }) => {
  const commonTabId = nanoid();
  const eventsTabId = nanoid();
  const appearanceTabId = nanoid();

  return {
    components: fbf('root')
      .addSearchableTabs({
        id: nanoid(),
        propertyName: 'settingsTabs',
        label: 'Settings',
        hideLabel: true,
        tabs: [
          {
            key: '1',
            title: 'Main',
            id: commonTabId,
            components: [
              ...fbf(commonTabId)
                .stdVisibleEditableInputs()
                .addSettingsInput({
                  id: nanoid(),
                  propertyName: 'placeholder',
                  label: 'Placeholder',
                  inputType: 'textField',
                  jsSetting: true,
                })
                .toJson(),
            ],
          },
          {
            key: '2',
            title: 'Events',
            id: eventsTabId,
            components: [...fbf(eventsTabId).stdEventHandlers(['onChange', 'onFocus', 'onBlur']).toJson()],
          },
          {
            key: '3',
            title: 'Appearance',
            id: appearanceTabId,
            components: [...fbf(appearanceTabId).stdAppearancePanels(['font', 'dimensions', 'border', 'background', 'shadow', 'marginPadding', 'customStyle'], removeStyleRouter).toJson()],
          },
        ],
      })
      .toJson(),
    formSettings: {
      layout: 'vertical',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    },
  };
};
```

:::note
Per the [Component Standards & Developer Checklist](./component-standards-and-developer-checklist.md), a component should use the standard `Main` / `Events` / `Appearance` tab structure (added via `stdVisibleEditableInputs` and `stdAppearancePanels`), which the example above follows. Some existing settings forms still key their first tab as `'Common'` instead of `'Main'` - the checklist flags this as a naming inconsistency to correct when a component is refactored, not the standard to copy for new components.
:::

### 3. Component Implementation (`myComponent.tsx`)

```tsx
import React from 'react';
import { IToolboxComponent } from '@/interfaces';
import { Input } from 'antd';
import { ComponentOutlined } from '@ant-design/icons';
import { IMyComponentProps } from './interfaces';
import { getSettings } from './settingsForm';

const MyComponent: IToolboxComponent<IMyComponentProps> = {
  type: 'myComponent',
  name: 'My Component',
  icon: <ComponentOutlined />,
  isInput: true,
  
  Factory: ({ model }) => {
    if (model.hidden) return null;
    
    return (
      <Input
        placeholder={model.placeholder}
        disabled={model.disabled}
      />
    );
  },
  
  settingsFormMarkup: (data) => getSettings(data),
  
  initModel: (model) => ({
    ...model,
    label: 'My Component',
    placeholder: 'Enter text...'
  }),
  
  migrator: (m) => m,
};

export default MyComponent;
```
:::note
 Your component model contains properties primarily from the component's properties panel.
:::

### 4. Component Registration

Add your component to  
`src/providers/form/defaults/toolboxComponents.ts`:

```typescript
import MyComponent from '@/designer-components/myComponent/myComponent';

export const getToolboxComponents = (): IToolboxComponentGroup[] => [
  {
    name: 'Data Entry',
    visible: true,
    components: [
      TextField,
      NumberField,
      MyComponent, // Add your component here
    ],
  },
  // ... other groups
];
```

> The `visible` property determines whether your component will appear in the widgets panel.

## Settings System

### Common Setting Types

#### Basic Input
```typescript
.addSettingsInput({
  id: nanoid(),
  propertyName: 'label',
  label: 'Label',
  inputType: 'textField',
  jsSetting: true,
})
```

#### Input Row (Multiple Fields)
```typescript
.addSettingsInputRow({
  id: nanoid(),
  hidden: { 
    _code: 'return getSettingValue(data?.background?.type) !== "color";', 
    _mode: 'code', 
    _value: false 
  } as any,
  parentId: appearanceTabId,
  inputs: [{
    type: 'colorPicker',
    id: 'backgroundStyleRow-color',
    label: "Color",
    propertyName: "background.color",
    hideLabel: true,
    jsSetting: false,
  }],
})
```

#### Collapsible Panel
```typescript
.addCollapsiblePanel({
  id: nanoid(),
  propertyName: 'styling',
  label: 'Styling Options',
  content: {
    id: nanoid(),
    components: [
      // Panel contents...
    ],
  },
})
```

#### Conditional Visibility

**Show/Hide Based on Boolean**
```typescript
hidden: { 
  _code: 'return getSettingValue(data?.background?.type) !== "color";', 
  _mode: 'code', 
  _value: false 
} as any
```

**Show Based on Selected Value**
```typescript
hidden: { 
  _code: 'return getSettingValue(data?.background?.type) === "color";', 
  _mode: 'code', 
  _value: false 
} as any
```

#### Responsive Design with Property Router
```typescript
.addPropertyRouter({
  id: nanoid(),
  propertyName: 'deviceSettings',
  label: 'Device Settings',
  propertyRouteName: {
    _mode: 'code',
    _code: "return contexts.canvasContext?.designerDevice || 'desktop';",
  },
  components: [
    // Device-specific settings...
  ],
})
```

## Styling System

### Creating Styles (`styles.ts`)

```typescript
import { createStyles } from '@/styles';

export const useStyles = createStyles(({ css, cx }, props) => {
  const myComponent = cx("sha-my-component", css`
    .ant-input {
      font-weight: ${props.fontWeight};
      color: ${props.color};
      border-radius: ${props.borderRadius}px;
    }
  `);
  
  return { myComponent };
});
```

### Using Styles in Components

```tsx
import { useStyles } from './styles';

const MyComponent = (props) => {
  const { classes } = useStyles({
    fontWeight: props.font?.weight,
    color: props.font?.color,
    borderRadius: props.borderRadius,
  });
  
  return (
    <div className={classes.myComponent}>
      {/* Component content */}
    </div>
  );
};
```

## Shesha Hooks

### `useForm` – Form Context

`useForm` (from `@/providers/form`) returns the form's `formMode`, `formData`, and a `form` property that is the underlying **Ant Design** `FormInstance` - so reading and writing individual field values uses Ant Design's own API, not a Shesha-specific one:

```typescript
import { useForm } from '@/providers/form';

const { form, formMode, formData } = useForm();

// Read a value (Ant Design FormInstance - not getValues)
const value = form.getFieldValue('fieldName');

// Set a value
form.setFieldValue('fieldName', 'newValue');

// Submit form
form.submit();
```

### `useSheshaApplication` – App Services

```typescript
import { useSheshaApplication } from '@/providers/sheshaApplication';

const { httpClient, backendUrl } = useSheshaApplication();

// Make API calls
const response = await httpClient.get(`${backendUrl}/api/data`);
```

### `useConfigurableActionDispatcher` – Execute Configured Actions

```typescript
import { useConfigurableActionDispatcher } from '@/providers/configurableActionsDispatcher';

const { executeAction } = useConfigurableActionDispatcher();

executeAction({
  actionConfiguration: model.onClickAction,
  argumentsEvaluationContext: { event, value },
}).catch((error: unknown) => console.error(error));
```

:::note Two different hooks
`useConfigurableAction` **registers** an action so it can be picked in the action configurator. To **run** an already-configured action (`IConfigurableActionConfiguration`), use `useConfigurableActionDispatcher`, which returns `executeAction` - see the [Component Standards & Developer Checklist](./component-standards-and-developer-checklist.md), Section 9, for the pattern used when wiring a component's own action-configurable events.
:::

## Ant Design Best Practices

### Form Components

```tsx
import { ConfigurableFormItem } from '@/components';

<ConfigurableFormItem model={model}>
  <Input placeholder={model.placeholder} />
</ConfigurableFormItem>
```

### Layout & Spacing

```tsx
// Grid System
<Row gutter={[16, 16]}>
  <Col span={12}>Left</Col>
  <Col span={12}>Right</Col>
</Row>

// Component Spacing
<Space>
  <Button>Cancel</Button>
  <Button type="primary">Submit</Button>
</Space>

// Loading States
<Spin spinning={loading}>
  {children}
</Spin>
```

## Component Groups

| Group | Purpose | Examples |
|-------|----------|-----------|
| Data entry | Input components | TextField, NumberField, Checkbox |
| Data display | Information display | Text, Alert, Statistic |
| Advanced | Complex components | Autocomplete, RichTextEditor |
| Entity references | Entity components | EntityPicker, FileUpload |
| Layout | Page structure | Card, Columns, Tabs |
| Dev | Development tools | CodeEditor, JsonEditor |


## Best Practices

### Component Development
✅ Single responsibility  
✅ TypeScript interfaces  
✅ Responsive design  
✅ Meaningful defaults  
✅ Performance optimization  
✅ Unique IDs using `nanoid()`

### Code Organization
✅ Follow file structure patterns  
✅ Reuse utilities  
✅ Document complex logic  
✅ Use consistent naming  

### Development Workflow
1. Create feature branch  
2. Implement component  
3. Register in toolbox  
4. Test in form designer  
5. Commit clearly  
6. Create pull request  

## Component Lifecycle

```
Create Component Files
         ↓
Define Interfaces
         ↓
Configure Settings
         ↓
Implement Component
         ↓
Register in Toolbox
         ↓
Test in Designer
         ↓
Deploy & Iterate
```

## Notes on Migrations

### Core Principles
- Don’t modify existing migrations once merged into `main`
- Add **new versions** instead of editing old ones
- Changing live migrations risks **breaking forms and tests**

### Safe vs Unsafe to Modify

✅ **Safe**
- Migrations not merged with main  
- Migrations in local/feature branches  

❌ **Unsafe**
- Migrations on main  
- Deployed or tested migrations  


### Proper Migration Strategy
- Always create a **new version** for behavior changes  
- Maintain **backward compatibility**  
- Test before merging  
- Use **semantic versioning**


### Example Scenario

**Situation:** Add a new default setting  
**✅ Correct:** Create a new migration version  
**❌ Wrong:** Modify old migration or just set `defaultValue`

## Resources

- [Shesha Documentation](https://docs.shesha.io)  
- [Ant Design](https://ant.design)  
- [React Docs](https://react.dev)  
- [TypeScript](https://typescriptlang.org)

**Happy Shesha Development!**  
Start building amazing configurable components today 🚀
