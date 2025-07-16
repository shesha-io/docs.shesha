# DataTable Context

import LayoutBanners from './LayoutBanners';

The datatable context component is a powerful tool that allows users to manage and manipulate tabular data within an application. It's often used in scenarios where you need to display, organize, and interact with data in a structured, table-like format. 

## **Get Started**

<LayoutBanners url="https://app.guideflow.com/embed/lpx4823s4k" type={1}/>
___

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).

### Common

#### **Disable Refresh Data** `function`  
JavaScript function that prevents data refresh until required inputs (like filters) are ready.

___

### Data

#### **Data Source Type** `object`  
Choose how data should be fetched:
- **Url**
- **Entity**
- **Form**

#### **Entity Type** `object`  
Defines the data entity type when using *Entity* source.

#### **Custom Endpoint** `string`  
Endpoint to fetch data from (used for *Url* and *Entity* sources).

#### **Data Fetching Mode** `object`  
Determines how records are loaded:
- **Paging** *(default)*: Data is fetched page by page.
- **Fetch all**: All records are fetched at once.

#### **Default Page Size** `number`  
Applies only in *Paging* mode. Choose from:
- 5, 10, 20, 30, 50, 100, 200

#### **Sort Mode** `object`  
Defines how data is sorted:
- **Standard** *(default)*
- **Strict**

#### **Order By** `object`  
Used in *Strict* sort mode to define sort fields.

#### **Sort Order** `object`  
Sort direction for *Strict* mode:
- **Ascending**
- **Descending**

#### **Sort By** `object`  
For *Standard* mode — specify data sorting fields dynamically.

#### **Grouping** `object`  
Available when sorting by *Standard* and using *Entity* data.
