---
sidebar_label: Dynamic CRUD APIs
sidebar_position: 20
---

# Dynamic CRUD APIs

# TODO:
- List Standard End-points;
- How to generate/ or not;
- Securing APIs;
- Restricting with Specifications;
- QuickSearch??;
- Customising Behaviour (Fluent Validation, Specifications, ); 

---

# GraphQL (GQL)

Shesha provides a support of <a href="https://graphql.org/" target="_blank">GraphQL</a> for data fetching. It generates schemas per each entity class with support of dynamic properties described.

Currently entity schema contain following fields:

1. **[entity]** - return single entity by it's Id. Here [entity] - is a camel cased name of the entity class

      | Argument |  Description|
      |--|--|
      | id | Id of the entity to fetch |

2. **[entity]List** - return paged, filtered and sorted list of entities. It supports  <a href="https://jsonlogic.com/" target="_blank">JsonLogic</a> filters and <a href="https://shesha-documentation.readthedocs.io/en/latest/4.%20Back-End%20Core%20Concepts/4.2.%20Dynamic%20Entity%20APIs/3.%20Quick%20Search/" target="_blank">quick search</a>

      | Argument |  Description|
      |--|--|
      | filter | Filter in <a href="https://jsonlogic.com/" target="_blank">JsonLogic</a> format |
      | quickSearch | Quick search string, processed by the <a href="https://shesha-documentation.readthedocs.io/en/latest/4.%20Back-End%20Core%20Concepts/4.2.%20Dynamic%20Entity%20APIs/3.%20Quick%20Search/" target="_blank">IQuickSearcher</a> |
      | sorting | Comma delimited properties to sort. The format is the same as for SQL queries e.g. `firstName, lastName desc` |
      | skipCount | Number of entities to skip |
      | maxResultCount | Max number of entities to fetch |

There are two possible ways of GraphQL usage:

1. Using <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-6.0" target="_blank">middleware</a>
2. Integrate into application services

## Middleware
Middleware usage allows to fetch data without any <a href="https://aspnetboilerplate.com/Pages/Documents/Application-Services" target="_blank">Application Services</a> or Controllers. In this case we use a single endpoint (standard path is `/graphql`) and select a schema (entity type) using routes. Example: for the person entity we use `/graphql/person` where `person` is a camel cased class name of the entity.
To simplify development you can use one of GraphQL web clients:

   - <a href="https://altair.sirmuel.design/" target="_blank">Altair</a>
   - <a href="https://lucasconstantino.github.io/graphiql-online/" target="_blank">GraphiQL</a>
   - <a href="https://github.com/graphql/graphql-playground" target="_blank">Playground</a>
   - <a href="https://ivangoncharov.github.io/graphql-voyager/" target="_blank">Voyager</a>

Playground UI looks like a browser inside the browser, see the image below:

1. `/ui/playground` is a standard url of the Playground UI
2. Url of the GraphQL server, here `person` is used to select a schema of `Shesha.Core.Person` entity
3. Arguments of the field, here we pass and id of the entity
4. List of properties. It controls the shape of the response, supports autocompletion
5. Response data

![image](https://user-images.githubusercontent.com/85956374/222995705-3b0ce278-8800-4230-9468-5bc75fa53521.png)

## Integration into Application Services

GraphQL operations can be called from the code directly without middleware usage. GraphQL is integrated into `DynamicCrudAppService`

Available endpoints:

1. **Query** - return a single entity. It works by the same way as the **[entity]** field on the GraphQL entity schema but request and response are decorated according to the specific of application services:

     * request contains `properties` argument, Shesha passes it directly to the GraphQL query. If this argument is not specified the system returns all top level fields of the entity (by the same way as it's done for the `Get` endpoint). All referenced entities are presented as their Id values.
     * response is wrapped with ABP wrapper (see <a href="https://aspnetboilerplate.com/Pages/Documents/Dynamic-Web-API#wrapping-results)" target="_blank">details</a>) 

   Middleware vs application service comparison:

  ![image](https://user-images.githubusercontent.com/85956374/222995790-6ae18d57-046c-42ac-8e74-dc638e787521.png)
  
2. **QueryAll** - return list of entities, works by the same way as **[entity]List** and decorated by the same ways as **Query**

   Request example:
   ![image](https://user-images.githubusercontent.com/85956374/222995807-5d0a0646-aafd-415e-b4a4-c20cd16cd9fc.png)

   Response example:
   ![image](https://user-images.githubusercontent.com/85956374/222995825-ffdbd2e7-7b91-4d9a-836b-413fbc627fd2.png)

**NOTE**: **Query** and **QueryAll** work by the same way as **Get** and **GetAll** respectively. After some testing they will be merged into a single endpoints.


# 3. Quick Search
Shesha provides and ability to quick search entities by text using **_IQuickSearcher_**.
The **_IQuickSearcher_** analyzes entity properties and generates <a href="https://docs.microsoft.com/en-us/dotnet/api/system.linq.expressions.expression?view=net-6.0" target="_blank">Linq Expression</a> that can be applied to any repository or <a href="https://docs.microsoft.com/en-us/dotnet/api/system.linq.iqueryable?view=net-6.0" target="_blank">IQueryable</a>.

Key features of **_IQuickSearcher_**:

1. Supports predefined list of properties. The list can be passed from the front-end to align UI and the data. E.g. we have a filterable table with just two columns - _**UserName**_ and **Email**. When the user tries to filter users in this table it's more transparent to filter rows by just these two columns and skip others.
2. When a list of properties is not defined - all root level properties are used.
3. Supports dot notation for nested entities. Example: **_Person_** entity has a navigation property **_User_**, to filter persons by **_UserName_** you can add it to the predefined list of properties as **_User.UserName_**
4. Supported data types:
      * Text fields - search a substring (`contains` method)
      * Reference lists - search by name of the reference list item
      * Multivalue reference lists (flags) - search by name of the reference list item with bitwise comparison of the value
      * Nested entities - search by the display name property (usually it's **_Name_**)

**Code examples:**

Example 1:

![image](https://user-images.githubusercontent.com/85956374/222995997-20769915-55a2-450d-bd1d-c01e8bae8580.png)

Example 2:

![image](https://user-images.githubusercontent.com/85956374/222996012-ad159aac-6dbc-46ed-a5a2-a9473e05af27.png)

Example 3:

![image](https://user-images.githubusercontent.com/85956374/222996019-ec681184-41c2-475e-8477-4f8b268ad82e.png)



# Specifications
- [Specifications](/docs/fundamentals/specifications)


# See Also
- [Custom APIs](/docs/back-end-basics/custom-apis)
- [Specifications](/docs/fundamentals/specifications)