---
sidebar_position: 2
---

# Developing Configurable Components

A comprehensive guide to developing configurable components in the **Shesha low-code platform**.

### Prerequisites
- Node.js v14+
- npm or yarn
- Git

### Getting Started

```bash
# Fork and clone the repository
git fork https://github.com/your-organization/shesha-framework.git
cd shesha-framework

# Install dependencies
cd shesha-reactjs
npm install

# Start development server
npm run dev
```


## Architecture Overview

Shesha is a low-code platform built on:

- **NextJS + TypeScript**
- **Ant Design components**



## Project Structure

```
shesha-framework/
├── shesha-reactjs/              # Frontend React project
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── designer-components/ # Form designer components
│   │   │   ├── _common/         # Shared utilities
│   │   │   ├── _settings/       # Settings components
│   │   │   └── textField/       # Example component
│   │   ├── hooks/               # Custom React hooks
│   │   ├── providers/           # Context providers
│   │   └── styles/              # Styling system
└── shesha-backend/              # Backend project
```



## Component Development

### Core Files Structure

Every Shesha component requires **3 essential files**:

```
designer-components/myComponent/
├── index.tsx         # Main component implementation
├── interfaces.ts     # TypeScript interfaces
├── settingsForm.ts   # Configuration settings
├── styles.ts         # Component styling (optional)
└── utils.ts          # Helper functions (optional)
```


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

```typescript
import { DesignerToolbarSettings } from '@/interfaces/toolbarSettings';
import { nanoid } from '@/utils/uuid';

export const getSettings = (data: IMyComponentProps) => {
  const commonTabId = nanoid();
  
  return {
    components: new DesignerToolbarSettings(data)
      .addSearchableTabs({
        id: nanoid(),
        propertyName: 'settingsTabs',
        parentId: 'root',
        label: 'Settings',
        hideLabel: true,
        tabs: [{
          key: '1',
          title: 'Common',
          id: commonTabId,
          components: [
            ...new DesignerToolbarSettings()
              .addSettingsInput({
                id: nanoid(),
                propertyName: 'placeholder',
                label: 'Placeholder',
                inputType: 'textField',
                jsSetting: true,
              })
              .toJson()
          ]
        }]
      })
      .toJson(),
    formSettings: {
      layout: 'vertical',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    }
  };
};
```

### 3. Component Implementation (`index.tsx`)

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
import MyComponent from '@/designer-components/myComponent';

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

```typescript
import { useForm } from '@/providers/form';

const { form, formMode, formData } = useForm();

// Read values
const value = form.getValues('fieldName');

// Set values
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

### `useConfigurableAction` – Execute Actions

```typescript
import { useConfigurableAction } from '@/providers/configurableActionsDispatcher';

const { execute, loading } = useConfigurableAction({
  actionName: 'submit',
  actionOwner: 'form'
});

execute({
  data: { /* action data */ },
  onSuccess: () => console.log('Success!'),
  onError: (error) => console.error(error)
});
```

## Ant Design Best Practices

### Form Components

```tsx
import { ConfigurableFormItem } from '@/components/configurableForm/configurableFormItem';

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
