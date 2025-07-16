# Entity Picker
The Entity Picker component allows users to select one or more entities from a backend list, supporting both single and multiple selection modes. With deep customization for filtering, formatting, and modal creation, it's a powerful tool for relational forms.

![Image](../Entity-References/images/entitypicker1.png)

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Data

#### **Selection Type** `object`  
Selection behavior:
- Single *(default)*
- Multiple

#### **Entity Type** `string`  
Defines the entity to pick from. *(Required)*

#### **Entity Filter** `object`  
Define pre-filtering logic using a query builder.

#### **Value Format** `string`  
How selected values are stored:
- Simple ID
- Entity reference
- Custom

#### **Configure Columns** `object`  
Configures visible columns for entity suggestions.

#### **Allow New Record** `boolean`  
Enable adding new records directly from the picker.
