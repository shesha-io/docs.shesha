# Naming Conventions

For consistency, form names should adhere to a standard naming convention.

## CRUD Forms

### Form Names

This, prefixed with the `Module Name`, will be the `path` to your form. For normal CRUD forms, the naming convention should be as follows:

`{Entity Name}-{Form Type}-{Additional Descriptor}` where:

- `{Entity Name}` is the name of the entity the form is based on.
- `{Form Type}` indicates the type of form (e.g., 'Create', 'Details', 'Table', 'Picker', 'QuickView').
- `{Additional Descriptor}` provides extra information to distinguish similar forms. For example:

  - `customer-quickView` vs `customer-quickview-comprehensive` - to distinguish between the default Customer Quickview and a more comprehensive version appropriate for selected views.

  - `payment-create` vs `payment-create-from-customer` - to distinguish between the default Payment create view and the one used from the Customer details with a Payments child table.

### More Examples

- `customer-table`
- `customer-details`
- `customer-create`
- `customer-quickView`
- `customer-picker`
- `customer-picker-from-account` (view with additional descriptor)

## Non-CRUD Forms

Forms that do not perform a CRUD operation will follow a looser naming convention. If the form's purpose still centers around a specific entity, the form name should follow something along the lines of: <br/>`{entityName}-{operation or Purpose of Form}`.
