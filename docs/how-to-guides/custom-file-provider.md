---
sidebar_label: Custom File Storage Provider
---

# Implementing a Custom File Storage Provider

Shesha ships with two file storage providers — local file system and Azure Blob Storage. If your application needs to store files in a different environment (e.g., Amazon S3, Google Cloud Storage, SFTP, or a custom archive system), you can implement your own provider.

## Architecture overview

The file storage system is built around these key types:

```
IStoredFileService                          ← Marker interface (inject this)
    └── IStoredFileServiceBase<StoredFile>   ← Full service contract
            └── StoredFileServiceBase        ← Abstract base class
                    ├── StoredFileService         (Local disk)
                    ├── AzureStoredFileService     (Azure Blob Storage)
                    └── YourCustomService          (Your implementation)
```

`StoredFileServiceBase` implements all the metadata, versioning, attachment, and copy logic. Your custom provider only needs to implement **seven abstract methods** that handle physical storage I/O:

| Method | Description |
| ------ | ----------- |
| `GetStreamAsync(StoredFileVersion)` | Read file content from storage and return as a `Stream`. |
| `GetStream(StoredFileVersion)` | Synchronous version of the above. |
| `UpdateVersionContentAsync(StoredFileVersion, Stream)` | Write file content to storage. |
| `FileExistsAsync(Guid)` | Check whether a file exists in storage. |
| `CopyFile(StoredFileVersion, StoredFileVersion)` | Copy a file from one version to another in storage. |
| `DeleteFromStorageAsync(StoredFileVersion)` | Delete a file from storage (async). |
| `DeleteFromStorage(StoredFileVersion)` | Delete a file from storage (sync). |

## Sample: Amazon S3 provider

Below is a complete example of a custom provider that stores files in Amazon S3. You can adapt this pattern for any storage backend.

### Step 1: Create the service class

```csharp
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Abp.Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Shesha.Domain;
using Shesha.Services.StoredFiles;
using System;
using System.IO;
using System.Threading.Tasks;

namespace YourApp.Services.StoredFiles
{
    public class S3StoredFileService : StoredFileServiceBase, IStoredFileService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _prefix;

        public S3StoredFileService(
            IRepository<StoredFile, Guid> fileRepository,
            IRepository<StoredFileVersion, Guid> versionRepository,
            IRepository<StoredFileVersionDownload, Guid> downloadRepository,
            IAmazonS3 s3Client,
            IConfiguration configuration)
            : base(fileRepository, versionRepository, downloadRepository)
        {
            _s3Client = s3Client;
            _bucketName = configuration["S3Storage:BucketName"] ?? "app-files";
            _prefix = configuration["S3Storage:Prefix"] ?? "";
        }

        /// <summary>
        /// Build the S3 object key for a file version.
        /// Format: {prefix}/{folder}/{versionId}.{extension}
        /// </summary>
        private string GetObjectKey(StoredFileVersion version)
        {
            var folder = version.File?.Folder ?? "";
            var fileName = $"{version.Id}{version.FileType}";

            return string.IsNullOrWhiteSpace(_prefix)
                ? $"{folder}/{fileName}".TrimStart('/')
                : $"{_prefix}/{folder}/{fileName}".TrimStart('/');
        }

        public override async Task<Stream> GetStreamAsync(StoredFileVersion fileVersion)
        {
            if (fileVersion == null)
                return null;

            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = GetObjectKey(fileVersion)
            };

            var response = await _s3Client.GetObjectAsync(request);

            // Copy to MemoryStream so the S3 response can be disposed
            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }

        public override Stream GetStream(StoredFileVersion fileVersion)
        {
            // Synchronous wrapper — avoid in new code where possible
            return GetStreamAsync(fileVersion).GetAwaiter().GetResult();
        }

        public override async Task UpdateVersionContentAsync(
            StoredFileVersion version, Stream stream)
        {
            if (stream == null)
                throw new ArgumentNullException(nameof(stream));

            var key = GetObjectKey(version);

            using var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(stream, _bucketName, key);

            // Update the version metadata in the database
            version.FileSize = stream.Length;
            await VersionRepository.UpdateAsync(version);
        }

        public override async Task<bool> FileExistsAsync(Guid id)
        {
            var lastVersion = await GetLastVersionAsync(id);
            if (lastVersion == null)
                return false;

            try
            {
                await _s3Client.GetObjectMetadataAsync(_bucketName, GetObjectKey(lastVersion));
                return true;
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return false;
            }
        }

        protected override void CopyFile(
            StoredFileVersion source, StoredFileVersion destination)
        {
            var copyRequest = new CopyObjectRequest
            {
                SourceBucket = _bucketName,
                SourceKey = GetObjectKey(source),
                DestinationBucket = _bucketName,
                DestinationKey = GetObjectKey(destination)
            };

            _s3Client.CopyObjectAsync(copyRequest).GetAwaiter().GetResult();
        }

        protected override async Task DeleteFromStorageAsync(StoredFileVersion version)
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = GetObjectKey(version)
            };

            await _s3Client.DeleteObjectAsync(request);
        }

        protected override void DeleteFromStorage(StoredFileVersion version)
        {
            DeleteFromStorageAsync(version).GetAwaiter().GetResult();
        }
    }
}
```

### Step 2: Configure S3 settings

Add the following to your `appsettings.json`:

```json
{
  "S3Storage": {
    "BucketName": "my-app-files",
    "Prefix": "uploads"
  },
  "AWS": {
    "Region": "us-east-1"
  }
}
```

### Step 3: Register the provider

Register your service in your application's module class. The registration follows the same pattern Shesha uses for its built-in providers — a factory method on `IStoredFileService` that selects the implementation based on configuration.

```csharp
using Abp.Modules;
using Abp.Dependency;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace YourApp
{
    [DependsOn(typeof(SheshaFrameworkModule))]
    public class YourAppModule : AbpModule
    {
        public override void Initialize()
        {
            // Register the S3 service class
            IocManager.Register<S3StoredFileService, S3StoredFileService>(
                DependencyLifeStyle.Transient);

            // Override the IStoredFileService factory to include S3 as an option
            IocManager.IocContainer.Register(
                Component.For<IStoredFileService>()
                    .UsingFactoryMethod(f =>
                    {
                        var configuration = f.Resolve<IConfiguration>();
                        var storageProvider = configuration
                            .GetValue<string>("StorageProvider") ?? "local";

                        return storageProvider.ToLower() switch
                        {
                            "s3" => f.Resolve<S3StoredFileService>() as IStoredFileService,
                            "azure" => f.Resolve<AzureStoredFileService>() as IStoredFileService,
                            _ => f.Resolve<StoredFileService>() as IStoredFileService
                        };
                    })
                    .IsDefault()  // Override the default registration from SheshaFrameworkModule
            );
        }
    }
}
```

Then set the provider in `appsettings.json`:

```json
{
  "StorageProvider": "s3"
}
```

:::tip
If you only need to replace the default provider (e.g., you always use S3), you can simplify the factory method to always return your implementation. The factory pattern is useful when you want to support multiple providers selectable via configuration.
:::

## Implementing your own provider

To implement a provider for a different backend, follow the same pattern:

1. **Create a class** that extends `StoredFileServiceBase` and implements `IStoredFileService`.
2. **Implement the seven abstract methods** listed above. Each method receives a `StoredFileVersion` that contains the file's Id, file type (extension), and a reference to the parent `StoredFile` (which has the `Folder` property).
3. **Build a storage key/path** from the version's properties. The convention is `{folder}/{versionId}.{extension}`, but you can use any scheme.
4. **Register your service** in your module's `Initialize` method as shown above.

### Key considerations

- **Stream handling**: When returning streams from `GetStreamAsync`, copy to a `MemoryStream` first so the underlying connection/resource can be disposed. This prevents file locks and connection leaks.
- **Version metadata**: After writing content in `UpdateVersionContentAsync`, update `version.FileSize` and call `VersionRepository.UpdateAsync(version)` so the database stays in sync.
- **Error handling**: The base class does not catch exceptions from your storage methods — if S3/GCS/etc. is unavailable, the exception propagates to the caller. Add retry logic or circuit breakers in your implementation if needed.
- **Synchronous methods**: `GetStream` and `DeleteFromStorage` are synchronous counterparts required by the interface. If your storage SDK only provides async APIs, it is acceptable to use `.GetAwaiter().GetResult()` as shown in the example.
- **Dependency injection**: Your service receives the same repositories (`IRepository<StoredFile, Guid>`, etc.) as the built-in providers. Pass them to the base constructor. Add any storage-specific dependencies (SDK clients, configuration) to your own constructor.

# See Also
- [File Storage](../fundamentals/file-storage.md) — Overview of Shesha's file storage system
- [File/FileList form component](/front-end-basics/form-components/Entity-References/files.md) — Frontend file components
