# Custom Components

## Overview

The Shesha Form Builder is a versatile tool offering a wide range of form components to cover most common scenarios. However, to meet unique requirements, Shesha allows the creation of custom components. These custom components can be seamlessly integrated into the Form Builder, enabling easy addition via a drag-and-drop interface.

## Background

Shesha Form Builder uses a JSON schema to assemble the form structure. Once the schema is available, it is injected into the builder, where it is interpreted to render components with their specific configurations.

  ![Image](./images/figure1.png)


#### Example JSON Schema
``` ts
{
  "components": [
    {
      "id": "LAuoz8VcEzPdMTc5zFK-n",
      "type": "rate",
      "propertyName": "ratings",
      "componentName": "ratings",
      "label": "Ratings",
      "labelAlign": "right",
      "parentId": "root",
      "hidden": false,
      "isDynamic": false,
      "version": 1,
      "count": 8,
      "settingsValidationErrors": []
    }
  ],
  "formSettings": {
    "layout": "horizontal",
    "colon": true,
    "labelCol": {
      "span": 6
    },
    "wrapperCol": {
      "span": 18
    }
  }
}
```

> **NOTE**: The JSON schema above shows two properties: `components` (an array of form components) and `formSettings`. If there are multiple components in the UI form, they would appear as additional entries within the `components` array.

## Folder Structure

Shesha adopts a [monorepo](https://monorepo.tools) structure with [NPM workspaces](https://www.geeksforgeeks.org/getting-started-with-npm-workspaces), allowing shared dependencies between multiple projects or modules within a single application.

- The root workspace directory is typically named packages, where all relevant modules are stored.
- In the above example, the his module is the only one in the packages directory.
- Components are exposed through the `hisApplicationPlugin.tsx` file inside `src/providers`, which needs to be wrapped around the main application's provider.

  ![Image](./images/figure3.png)

#### Example Code: Exposing Components


``` ts
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useSheshaApplication } from '@shesha-io/reactjs';
import { allComponents } from '@/designer';

export interface HisApplicationPluginProps {}

export const HIS_PLUGIN_NAME = 'His-Plugnin';

export const HisApplicationPlugin: FC<PropsWithChildren<HisApplicationPluginProps>> = ({ children }) => {
  const { registerFormDesignerComponents } = useSheshaApplication();

  useEffect(() => {
    registerFormDesignerComponents(HIS_PLUGIN_NAME, allComponents);
  }, []);

  return <>{children}</>;
};
```

#### Viewing Exposed Components
To view the list of exposed components in the Shesha Form Builder, open the `allComponents` file, as shown in the image below:

  <!-- figure 7 -->

  ![Image](./images/figure7.png)
  
#### Data Structure
The `allComponents` file uses an array to group components. This structure allows for organizing multiple component modules when needed.

The array is typed using the `IToolboxComponentGroup` interface, ensuring that the correct structure is followed. It is recommended to type `allComponents` as demonstrated in the example below:

#### Example Code: `allComponents`
``` ts
import { IToolboxComponentGroup } from '@shesha-io/reactjs';
import CalendarComponent from 'components/global/bookingCalendar/formComponent';
import FacilityContextPickerComponent from 'components/global/facilityContextPicker/formComponent';
import StatsListComponent from 'components/global/statsList/formComponent';
import TableFormComponent from 'components/global/tableBuilder/formComponent';
import UrinalysisComponent from 'components/global/urinalysis';
import SampleComponent from 'components/global/urinalysis';

export const allComponents: IToolboxComponentGroup[] = [
  {
    name: 'HIS Components',
    components: [
      CalendarComponent,
      FacilityContextPickerComponent,
      StatsListComponent,
      TableFormComponent,
      UrinalysisComponent,
      SampleComponent,
    ],
    visible: true,
  },
];
```

> **NOTE**: An example of this folder structure can be found [here](https://github.com/shesha-io/shesha-framework/tree/main/shesha-starter/frontend-packages).

## Component Definition

Custom components must implement the IToolboxComponent interface to maintain consistency within the Form Builder.

#### Example Component: `SampleComponent`
``` ts
import { DingtalkOutlined } from '@ant-design/icons';
import {
  ComponentFactoryArguements,
  ConfigurableFormItem,
  IToolboxComponent,
  validateConfigurableComponentSettings,
} from '@shesha-io/reactjs';
import React from 'react';
import { settingsForm } from './settings';

const SampleComponent: IToolboxComponent<ISampleComponentProps> = {
  type: 'sampleComponent',
  name: 'Sample Component',
  icon: <DingtalkOutlined />,
  Factory: ({ model }: ComponentFactoryArguements<ISampleComponentProps>) => {
    const style = {
      height: model.height,
      width: model.width,
      border: model.hasBorder ? '1px solid black' : 'none'
    };

    const onMouseMove = (event: MouseEvent, onChange: Function) => {
      onChange({ x: event.movementx, y: event.movementy });
    };

    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => (
          <div style={style} onMouseMove={(e: any) => onMouseMove(e, onChange)}>
            <div>{model.title}</div>
            <span>X: {value?.x}</span>
            <span>Y: {value?.y}</span>
          </div>
        )}
      </ConfigurableFormItem>
    );
  },
  initModel: (model) => ({
    ...model,
    hasBorder: true,
  }),
  settingsFormMarkup: settingsForm,
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
};

export default SampleComponent;
```

#### Key Properties of [IToolboxComponent](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/formDesigner.ts):
- `Type`: Unique identifier for the component.
- `Name`: Displayed in the toolbox, often set as the default label.
- `Icon`: The icon shown in the toolbox.
- `Factory`: A method that returns a JSX element and defines how the component is rendered in the form.
- `Settings`: Used to configure form-specific settings like size, label visibility, etc.
- `initModel`: Initial values can be defined and will be applied during the form configuration initialization.

  <!-- figure 7 -->

  ![Image](./images/figure7.png)

## Form Configuration

- The `settingsForm` property defines the component's configuration, typically displayed in the side menu or metadata section of the builder.
- [`DesignerToolbarSettings`](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/toolbarSettings.ts) is a helper class for building configurations. To create a configuration, simply add the appropriate method to the class and provide the necessary options. Then, import the configuration settings and inject them into the builder.

#### Example: `settingsForm` Configuration
``` ts
import { DesignerToolbarSettings } from '@shesha-io/reactjs';
import { nanoid } from 'nanoid';

export const settingsForm = new DesignerToolbarSettings()
  .addSectionSeparator({
    id: nanoid(),
    propertyName: 'separatorl',
    parentld: 'root',
    label: 'Display',
  })
  .addContextPropertyAutocomplete({
    id: nanoid(),
    propertyName: 'propertyName',
    parentld: 'root',
    label: 'Property name',
    validate: {
      required: true,
    },
  })
  .addTextField({
    id: nanoid(),
    propertyName: 'title',
    parentld: 'root',
    label: 'Title',
  })
  .addCheckbox({
    id: nanoid(),
    propertyName: 'hideLabel',
    parentld: 'root',
    label: 'Hide Label',
  })
  .addNumberField({
    id: nanoid(),
    propertyName: 'height',
    parentld: 'root',
    description: 'This property determines the height of the selector in question.',
    label: "Selector's Height",
    validate: {
      required: true,
    },
  })
  .addNumberField({
    id: nanoid(),
    propertyName: 'width',
    parentld: 'root',
    description: 'This property determines the width of the selector in question.',
    label: "Selector's Width",
    validate: {
      required: true,
    },
  })
  .addCheckbox({
    id: nanoid(),
    propertyName: 'hasBorder',
    parentld: 'root',
    label: 'Has Border',
  })
  .tolson();
```

  <!-- figure 9 -->

  ![Image](./images/figure9.png)

## Factory Method

The `factory` property is a key method in the `IToolboxComponent` interface. It returns a JSX element and handles rendering in the form.

#### How Factory Works:
- The `factory` method takes a [`ComponentFactoryArguments`](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/formDesigner.ts) object as an argument. The primary property of interest is `model`, which holds the component's configuration values.
- The `ConfigurableFormItem` component is responsible for managing the form's state, validation, visibility, and more.

> **NOTE**: It is important to note that [`ConfigurableFormItem`](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/components/formDesigner/components/formItem.tsx) is a form item and is responsible for handling state, validation, visibility and many more features on the Shesha Form Builder.

#### Example of Factory Method Usage:
``` ts
const SampleComponent: IToolboxComponent<ISampleComponentProps> = {
  ...
  Factory: ({ model }: ComponentFactoryArguements<ISampleComponentProps>) => {
    const style = {
      height: model.height,
      width: model.width,
      border: model.hasBorder ? '1px solid black' : 'none',
    };

    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => (
          <div style={style}>
            <div>{model.title}</div>
            <span>X: {value?.x}</span>
            <span>Y: {value?.y}</span>
          </div>
        )}
      </ConfigurableFormItem>
    );
  },
  ...
};
```

## Rendering the Factory Property
The factory property includes the `ConfigurableFormItem` component as its top-level parent. While using `ConfigurableFormItem` is not mandatory, it is the preferred approach. The children of `ConfigurableFormItem` receive a function with two parameters: `value` and `onChange`.

- `value`: Represents the current value of the active component.
- `onChange`: The event handler that triggers value changes.

The function that is the child of `ConfigurableFormItem` must return the component that will be rendered in the form builder. The component can either receive values directly or mute them, depending on the specification. In the provided example, the values from the model are directly passed to the components.

## Model
The model contains the component’s configuration values (e.g., title, size, border settings). The model is passed to the `ConfigurableFormItem`, and it reflects changes made via the form builder interface.

#### Example of Model Definition:
``` ts
import { IConfigurableFormComponent } from '@shesha-io/reactjs';

export interface ISampleComponentProps extends IConfigurableFormComponent {
  title: string;
  height: string;
  width: string;
  hasBorder: boolean;
}
```

## Exposing Component

To expose custom components, wrap your application's root provider with the `HisApplicationPlugin`. This step makes the components available in the form builder.

Navigate to the `app-provider.tsx` file located in the `adminportal` directory: `src > app > app-provider.tsx`

  <!-- figure 11 -->

  ![Image](./images/figure11.png)

#### Example: Wrapping with `HisApplicationPlugin`
``` ts
"use client";

import React, { FC, PropsWithChildren } from "react";
import {
  GlobalStateProvider,
  ShaApplicationProvider,
  StoredFilesProvider,
  useNextRouter,
} from "@shesha-io/reactjs";
import { HisApplicationPlugin } from "@shesha-io/pd-publicportal";
import { AppProgressBar } from "next-nprogress-bar";
import { useTheme } from "antd-style";

export interface IAppProviderProps {
  backendUrl: string;
}

export const AppProvider: FC<PropsWithChildren<IAppProviderProps>> = ({
  children,
  backendUrl,
}) => {
  const nextRouter = useNextRouter();
  const theme = useTheme();

  return (
    <GlobalStateProvider>
      <AppProgressBar height="4px" color={theme.colorPrimary} shallowRouting />
      <ShaApplicationProvider
        backendUrl={backendUrl}
        router={nextRouter}
        noAuth={nextRouter.path?.includes("/no-auth")}
      >
        <HisApplicationPlugin>
          <StoredFilesProvider baseUrl={backendUrl} ownerId={""} ownerType={""}>
            {children}
          </StoredFilesProvider>
        </HisApplicationPlugin>
      </ShaApplicationProvider>
    </GlobalStateProvider>
  );
};
```