---
sidebar_label: File Storage
---

# File Storage

File storage, display, and management are common needs in many business applications. Shesha caters to these needs with its built-in file management features. These include:
1. APIs for the uploading, downloading, deletion, updating (incl. version management) of files
1. UI components that can bind to entities and allow uploading, downloading and viewing of files
1. Storage providers that allow files to be stored in various types of storage locations. Currently, local file storage and Azure Blob Storage are supported, with the option for custom providers to be implemented.
1. Metadata management for all files uploaded

# Adding a file to an entity

If you wish to be able to upload a file against an entity, simply add a property of type `StoredFile` to the entity as follows:

``` csharp
public class MyEntityWithFile : Entity
{
    ...

    public virtual StoredFile MyFile { get; set; }

    ...
}
```

On the front-end you can then use the `File` form component and bind it to your new `StoredFile` property as illustrated below:

``` 
TODO: INSERT SCREENSHOT WITH FILE COMPONENT
```

Refer for the [File form component](../front-end-basics/form-components/Entity-References/files.md) for more details on how to configure the component.

# Adding a list of files to an entity

If you wish to be able to upload a list of files against an entity, no changes are required to your domain model. Simply add the `FileList` form component to your form and bind it to your entity as illustrated below:
``` 
TODO: INSERT SCREENSHOT WITH FILE COMPONENT
```

The `FileList` component will automatically track which files are part of the list using the `OwnerType`, `OwnerId` and `Category` properties of the `StoredFile` entity.
Note that the `FileList` component will only be able to update these properties accurately if properly configured. Refer for the [FileList form component](/front-end-basics/form-components/Entity-References/files.md) for more details on how to configure the component.

**Note:** In cases where files are upload files before the owner entity has been persisted and therefore assigned an Id, the dynamically generated Create end-point will automatically the update of `OwnerType`, `OwnerId` and `Category` properties for all previously created `StoredFile` entities created once the owner entity has been persisted and assigned an Id. If you are not using the default Create end-point, you will need to ensure that these properties are updated manually on your custom end-point using the `TODO: Ask Ernest for the name of the method` method.

# StoredFile Entity and File Metadata
The `StoredFile` entity is used to store metadata about files uploaded into the application and has the following properties:

| Property          | Type    | Description       |
|-------------------|---------|-------------------|
| OwnerId           | string  | The ID of the owner of the file. |
| OwnerType         | string  | The type of the owner of the file. |
| FileName          | string  | The original name of the file. When saved in the system's storage location the original file name is replaced by a Guid to avoid name clashes. This therefore provides a view of the original name of the file. |
| FileType          | string  | **TODO: Confirm usage** The type of the file. |
| Category          | Int64?  | **TODO: Confirm usage and if maps to a reference list** The category of the file. |
| Description       | string  | The description of the file. |
| SortOrder         | int     | The sort order of the file. |
| ParentFile        | StoredFile | **TODO: Confirm usage** The parent file of the current file. |
| Folder            | string  | The folder where the file is stored relative to root location of the file storage location. |
| IsVersionControlled | bool  | Indicates whether the file is version controlled. |
| TenantId          | int?    | The ID of the tenant. |


### StoredFileVersion

| Property     | Type       | Description       |
|--------------|------------|-------------------|
| File         | StoredFile | The StoredFile this version relates to. |
| VersionNo    | int        | The version number. |
| FileSize     | Int64      | The size of the file stored in Bytes. |
| FileName     | string     | The name of the file on the storage location. Note this will differ from the original name of the file as it is replaced with a Guid when stored to ensure uniqueness. |
| FileType     | string     | The type of the file as per the file extension of the file when uploaded. |
| Description  | string     | An optional description for the file version. |
| IsSigned     | bool       | **TODO: Confirm usage** |
| IsLast       | bool       | If true, indicates that this is the latest version for the file. |


# File management API
[TODO]


# Storage of files
Uploaded files are not stored in the database, but rather as separate binary files in a file storage location. Shesha provides for the storage of files in the following types of locations:
- Local disk	
- Azure Blob Storage	

Additional storage locations can be added by implementing the `IFileStorageProvider` interface.

## Local file storage
Uploaded files will be store Local file. To use local file storage update the `AppSettings.json` as follows
```
TODO
```

## Azure Blob Storage
Uploaded files will be store Azure Blob Storage. To use Azure Blob Storage:
 update the configuration `AppSettings.json` as follows
 ```
TODO
```

# See Also
- Configuring the [File/FileList form component](/front-end-basics/form-components/Entity-References/files.md)

