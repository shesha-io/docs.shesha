# Form Naming Conventions

Form names need to be unique within the module. The form name should be in lowercase and use hyphens to separate words and should not have any other special characters or spaces.

For consistency, form names should adhere to a standard naming convention.

### Forms Bound to an Entity
 
For forms bound to an entity, it is recommended to follow the following convention: `{Entity Name}-{Form Type}-{Additional Descriptor}` where

- `{Entity Name}` is the name of the entity the form is bound to.
- `{Form Type}` indicates the type of form (e.g., 'Create', 'Details', 'Table', 'Picker', 'QuickView').
- `{Additional Descriptor}` provides extra information to distinguish similar forms and ensure uniqueness. For example:

  - `customer-quickview` vs `customer-quickview-comprehensive` - to distinguish between the default Customer Quickview and a more comprehensive version appropriate for selected views.
  - `customer-details` vs `customer-details-for-accountmanager` - to distinguish between the default Customer Details and a version tailored for account managers.
  - `customer-picker` vs `customer-picker-from-account` - to distinguish between a generic customer picker and one specifically designed for use within an account context.


### Forms to Perform a Custom Action on an Entity

For forms that perform a custom action on an entity, the naming convention should be similar to the one used for CRUD operations, but with a focus on the action being performed. The recommended format is: `{Entity Name}-{Action}`. For example:
- `customer-merge` - for a form that allows merging customer records.
- `customer-assign` - for a form that allows assigning customers to a specific user or team.
- `opportunity-convert` - for a form that allows converting an opportunity into a different entity, such as a quote or order.

## Custom Forms

Custom forms that are not bound to an entity or do not perform a CRUD operation should follow a looser naming convention.
- `dashboard` - for a custom dashboard that provides an overview of key metrics and data.
- `dashboard-for-supervisor` - for a custom dashboard designed specifically for supervisors.
- `report-generator` - for a custom form that allows users to generate reports based on specific criteria.