# Html Render
The Html Render component allows you to inject custom JSX or HTML-like structures directly into your form. 

![Image](../Advanced/images/htmlrender1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Property Name** `string`  
Binds the rendered output to a unique key in your form. *(Required)*

#### **Render HTML** `function`  
JSX/HTML script that defines what to render. You can reference:
- `data`: Form data (object)
- `globalState`: The global app state (object)

#### **Hide** `boolean`  
Conditionally hide the component using a script or toggle.

___

### Appearance
#### **Custom Styles** `function`  
Returns a `CSSProperties` object to style the rendered HTML block.