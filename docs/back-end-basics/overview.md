# 1. Overview 
The heart of a Shesha application is the domain. The domain is the set of entities that represent the core business concepts of your application. 

## The Core Domain Model
 To accelerate the development of your application, Shesha provides a set of core domain entities that you can use as a starting point for your application. We refer to this as the base domain.
 The base domain includes entities such as Person, Address, Organisation and Site which are recurrent in the vast majority of business applications.

| Entity | Description |
|--------|-------------|
| Person | Represents a person in the application. This may or may not represent a User in the system but this is expanded on in [User Management Fundamentals](/fundamentals/user-management). |
| Address | Represents an address. |
| Organisation | Represents an organization unit, organisation/company, team or similar. |
| Site | Sites may be used to represent point locations, areas or buildings/structures or similar. It has a hierarchical structure so may represent |
| StoredFile | Represents a file stored in the system. More details on how to manage files are provided [file storage fundamentals](/fundamentals/file-storage). |
| ReferenceList | Represents a standard reference list (sometimes also known as lookup lists). |
| ReferenceListItem | Represents an item in a reference list. |
| Account | Represents an account. |
| Note | Represents a note. |

Though it is not a requirement to use the base domain, it is highly recommended to do so as it will accelerate the development of your application and you will be able to leverage other modules that also assume you use those entities.


- Based domain model
   - Diagram
   - Table with details
* Build on top of existing Core domain entities will mean you can potentially leverage other modules that also assume you use those entities
* 

# Extending the Domain Model


## Domain Repositories



## Updating the Domain Model
### Adding a new entity

- Standard base classes to inherit from
- 
FullAuditedEntity
        bool IsDeleted
        long? DeleterUserId
        DateTime? DeletionTime




### Adding a new property to an existing entity

* How to extend an existing entity
  * Add DB Migration
  * Add attributes (reference separate attributes page)
  * Explaining discriminators


### Supported Property Types
  - Primitives
  - Entities
  - Reference Lists
[//]: # (- GenericEntityReferences - Ignore for now as advanced feature)
[//]: # (- Json Entities - Ignore for now as advanced feature)


# Shesha ORM
- NHibernate
- Fluent NHibernate
- SheshaDatabaseConfiguration

  
# Database Migrations
- Create table
- Add relationships


# Mapping to the Table Structure
* Explaining table and column naming conventions
* Table naming - {database prefix}_{entity name pluralised} e.g Core_Persons
* Column naming
    * Ordinary column - {property name as-is from entity} e.g Firstname
    * Foreign key column - {property name as-is from entity}{Id} e.g AddressId
    * Reference list based column - {property name as-is from entity}{Lkp} e.g GenderLkp
    * Inheritence column - {database prefix}_{column name with the above conventions} e.g  Mem_ProvinceId,  Mem_MembershipNo, Mem_MemberTypeLkp

- Table naming conventions
  * DB table prefix
  * Entity name pluralised
  * e.g Core_Persons