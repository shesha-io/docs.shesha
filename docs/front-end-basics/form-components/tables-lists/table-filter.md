# Table Filter

The Table Filter component is a customizable filter button designed to help users quickly refine table data. It supports diverse configurations including layout, icons, tooltips, and custom action triggers—perfect for dynamic table filtering on dashboards or forms.

![Image](../tables-lists/images/tablefilter1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common
#### **Component Name** `string`  
The unique identifier used to reference this filter button. *(Required)*

#### **Label** `string`  
The visible text displayed on the button.

#### **Tooltip** `string`  
Helpful text shown on hover to describe the button's function.

#### **Icon** `object`  
Name of an optional icon displayed on the button.

#### **Danger** `boolean`  
Adds a red style to indicate a destructive action.

#### **Block** `boolean`  
Expands the button to take up full width of its container.

#### **Hide** `boolean`  
Determines whether the button is visible or hidden.

#### **Edit Mode** `object`  
Configures user interaction:
- Editable
- Read Only
- Inherited *(default)*

#### **Action Configuration** `object`  
Defines the behavior triggered when the button is clicked.

___

### Appearance

#### **Button Type** `object`  
Controls the visual style:
- Primary
- Ghost
- Dashed
- Link
- Text
- Default *(default)*

#### **Font** ``object`` 

Customize how your table filter looks. Choose the font family, size, weight, and color.

#### **Dimensions** ``object`` 

Specify the size of your component:
- Width, Height
- Min/Max Width and Height
- Overflow behavior


#### **Margin & Padding** ``object``

Fine-tune spacing inside and around the component.

####  **Custom Styles** ``function``

Inject your own CSS styles via JavaScript (must return a style object).



