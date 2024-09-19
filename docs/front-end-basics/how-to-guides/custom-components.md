# Custom Components

## Overview

The Shesha Form Builder is a powerful feature that includes a variety of form components to cover a wide range of common scenarios. However, given the diversity of use cases, it's not feasible to address all of them. Therefore, Shesha provides an option to develop custom components for any unique requirements. These custom components can be seamlessly integrated withing the Form Builder, enabling you to easily add them to any form through the drag-and-drop interface.

## Background

Before diving into the code, we need to briefly mention a few topic areas.

- The form is assembled using a JSON schema. Once this JSON data is available it is injected into the Form Builder and interpreted to render specific components with exact configurations.

  ![Image](./images/figure1.png)
  ![Image](./images/figure2.png)

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

> **NOTE**: It is important to note that in the JSON schema in the above image, two properties are depicted (`components`, `formSettings`). Also take note that the components property is an `array` and if we had more than one component in the UI form it would be shown in this array.

## Folder Structure

- Looking at the file structure, we have gone with the [monorepo](https://monorepo.tools/) approach. NPM allows for [workspaces](https://dev.to/ynwd/how-to-create-react-monorepo-with-npm-workspace-webpack-and-create-react-app-2dhn) to be used in a single project. The use of workspaces allows us to share dependencies (node_modules) between projects/modules in a single application.
- The recommended naming conventions is to name the root workspace directory as `packages` and create all relevant modules in this `packages` directory.

  ![Image](./images/figure3.png)

  _Above image shows the `packages` folder in the root of the `adminportal` directory_

- Inside the `packages` directory we can see that only one module exists, namely the `his` module.
- The `hisApplicationPlugin.tsx` file inside of the `src/providers` folder is where components are exposed. `HisApplicationPlugin` will need to be wrapped around the main application's provider.

  ![Image](./images/figure4.png)

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

- By opening the `allComponents` file as shown in the image below, we can see the list of exposed components to the Shesha Form Builder.
  <!-- figure 5 -->

  ![Image](./images/figure5.png)
  <!-- figure 7 -->

  ![Image](./images/figure7.png)

- An array is the data structure used for `allComponents`, this allows us to group components and create multiple component modules if needed.
- The array is typed with a IToolboxComponentGroup interface which enforces that we follow the correct pattern. It is recommended that allComponents be typed as shown in the image below
  <!-- figure 5 -->
  ![Image](./images/figure5.png)

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

_The square bracket after the interface means it is an array of the [IToolboxComponentGroup](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/formDesigner.ts) interface._

## Implementation

- A simple example was constructed for demo purposes
  <!-- figure 6 -->

  ![Image](./images/figure6.png)

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

- `SampleComponent` is an object which implements the [IToolboxComponent](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/formDesigner.ts) interface, this is to ensure consistency.

## Type

- A key which is used to find specific components, it is essential that this is unique

## Name

- Property name is displayed on the components toolbox and is often the default value of the label once dragged to the form

## Icon

- Icon property refers to the selected icon on the toolbox

  <!-- figure 7 -->

  ![Image](./images/figure7.png)

## Form Configuration

- Form configuration are the configurations that render the side menu or metadata of the component

  <!-- figure 8 -->

  ![Image](./images/figure8.png)

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

- [DesignerToolbarSettings](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/toolbarSettings.ts) is a class that assists to create the configuration. Simply append the relevant method to the class to build the configuration and pass the relevant options to the method. Import the configuration settings and inject it to the builder.

_shown on lines 10, 40, 41_

  <!-- figure 6 -->

![Image](./images/figure6.png)

## Factory

- The `factory` property is arguably the most important property implemented from the `IToolboxComponent` interface. In essence, the property returns a JSX element and is what will be rendered in the forms.
- Property `factory` is actually a method that returns a JSX element/component, the first and only parameter is an object of type [ComponentFactoryArguments](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/interfaces/formDesigner.ts).
- We will be focusing on the model property that is inside the `ComponentFactoryArguments` interface and neglect the rest of the properties.
- From our parameter we destructure the model property. Property of model is passed to the [ConfigurableFormItem](https://github.com/shesha-io/shesha-framework/blob/d4959da52f3285067f3269d7f9a14a0259281afb/shesha-reactjs/src/components/formDesigner/components/formItem.tsx) component

    <!-- figure 6 -->

  _shown on line 25_

  ![Image](./images/figure6.png)

> **NOTE**: It is important to note that `ConfigurableFormItem` is a form item and is responsible for handling state, validation, visibility and many more features on the Shesha Form Builder.

## Model

- The model property is the values which were set in component form configuration

  <!-- figure 8 -->

  ![Image](./images/figure8.png)

- Once this is set the values are available on the model property
  <!-- figure 6 -->

  _shown on line 17_

  ![Image](./images/figure6.png)

- It is important to note the type of the model, the model is an object of type ISampleComponentProps. This is passed as a generic type on the ComponentFactoryArguements interface.

  <!-- figure 10 -->

  ![Image](./images/figure10.png)

``` ts
import { IConfigurableFormComponent } from '@shesha-io/reactjs';

export interface ISampleComponentProps extends IConfigurableFormComponent {
  title: string;
  height: string;
  width: string;
  hasBorder: boolean;
}
```

Rending of the `factory` property includes the `ConfigurableFormItem` component as the top parent, this is not mandatory only but done as preference. The children of `ConfigurableFormItem` return a function of parameters `value` and `onChange`. value is the current value of the active component, `onChange` is the event which will trigger the value to change

  <!-- figure 6 -->

_shown on line 26_

![Image](./images/figure6.png)

The function which is the child of `ConfigurableFormItem` is required to return the component which will be rendered on the form builder. Direct values can be passed down or muted depending on the specification, in the example used the values from model were directly used in the components

  <!-- figure 6 -->

_shown on lines 28, 29, 30_

![Image](./images/figure6.png)

_See working example below_

  <!-- figure 7 -->

![Image](./images/figure7.png)

## Init Model

- Initial values can be set using the initModel property. These values will be initialized on the form configuration

    <!-- figure 6 -->

  _shown on line 36_

  ![Image](./images/figure6.png)
  <!-- figure 8 -->

  ![Image](./images/figure8.png)

## Exposing Component

- Navigate to the `app-provider.tsx` file from the root directory of the `adminportal` directory. `src` > `app` > `app-provider.tsx`
  <!-- figure 11 -->

  ![Image](./images/figure11.png)

- The `HisApplicationPlugin` is wrapped around the main application's provider as seen in the illustration below. Simply import the hook and wrap it around the `ShaApplicationProvider`.

  <!-- figure 13 -->

  ![Image](./images/figure13.png)

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