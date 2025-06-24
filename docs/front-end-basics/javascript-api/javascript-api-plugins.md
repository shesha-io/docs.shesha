# Shesha JavaScript API Plugins

Shesha allows developers to extend the application JS API using `useApplicationPlugin` hook. Example of usage provided below:

```typescript
import { useApplicationPlugin } from '@shesha-io/reactjs';

export const MyApplicationPlugin: FC<PropsWithChildren> = ({ children }) => {
    const [contextData] = useState<IMyPluginApi>(() => new MyPluginApi());

    useApplicationPlugin({
        // name of the plugin
        name: 'myPlugin',
        // plugin metadata
        buildMetadata: (builder) => {
            builder.addObject("myPlugin", "My Plugin API", m => ...);
        },
        // plugin data (api)
        data: contextData
    });

    return (<> {children} </> );
};
```
