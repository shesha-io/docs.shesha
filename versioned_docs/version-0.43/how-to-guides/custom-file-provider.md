---
sidebar_label: Custom File Storage Provider
title: Implementing a Custom File Storage Provider
---

# Implementing a Custom File Storage Provider

Shesha ships with two built-in file storage providers - local disk and Azure Blob Storage. If your application needs to store files somewhere else (Amazon S3, Google Cloud Storage, SFTP, a custom archive system), you can plug in your own provider without changing the rest of the framework. The base class handles all of the metadata, versioning, and attachment logic for you; your provider only needs to read and write bytes.

This guide walks through the architecture, shows a complete S3 example, and lists the rules to follow for any other backend.

---

## Architecture Overview

The file storage system is built around a small set of types:

```text
IStoredFileService                          - marker interface (inject this)
    -- IStoredFileServiceBase<StoredFile>   - full service contract
            -- StoredFileServiceBase        - abstract base class (metadata, versioning, copy)
                    -- StoredFileService         (local disk)
                    -- AzureStoredFileService    (Azure Blob Storage)
                    -- YourCustomService         (your implementation)
```

The relevant source files on `releases/0.43`:

| Type | Source |
|---|---|
| `IStoredFileService` | `shesha-core/src/Shesha.Framework/Services/IStoredFileService.cs` |
| `StoredFileServiceBase` | `shesha-core/src/Shesha.Framework/Services/StoredFiles/StoredFileServiceBase.cs` |
| `StoredFileService` | `shesha-core/src/Shesha.Framework/Services/StoredFiles/StoredFileService.cs` |
| `AzureStoredFileService` | `shesha-core/src/Shesha.Framework/Services/StoredFiles/AzureStoredFileService.cs` |

`StoredFileServiceBase` already implements all the metadata, versioning, attachment, and copy logic. Your custom provider only needs to implement **seven abstract methods** that handle physical storage I/O.

| Method | Description |
|---|---|
| `GetStreamAsync(StoredFileVersion)` | Read file content from storage and return as a `Stream`. |
| `GetStream(StoredFileVersion)` | Synchronous version of the above. |
| `UpdateVersionContentAsync(StoredFileVersion, Stream)` | Write file content to storage. |
| `FileExistsAsync(Guid)` | Check whether a file exists in storage. |
| `CopyFile(StoredFileVersion, StoredFileVersion)` | Copy a file from one version to another in storage. |
| `DeleteFromStorageAsync(StoredFileVersion)` | Delete a file from storage (async). |
| `DeleteFromStorage(StoredFileVersion)` | Delete a file from storage (sync). |

---

## Sample - Amazon S3 Provider

Below is a complete example of a custom provider that stores files in Amazon S3. The same pattern adapts to any other backend.

### Step 1 - Create the Service Class

**Example - A full S3 storage service:**

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
            // Synchronous wrapper - avoid in new code where possible
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

### Step 2 - Configure S3 Settings

Add S3 connection details to `appsettings.json`:

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

### Step 3 - Register the Provider

Register the service in your application's module. The registration follows the same pattern Shesha uses for its built-in providers - a factory method on `IStoredFileService` that selects the implementation based on configuration.

**Example - Register the S3 service alongside the built-in providers:**

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
If you only ever use one provider (for example, your project always uses S3), simplify the factory to always return your implementation. The switch-based factory is useful when you want to choose providers per environment via configuration.
:::

---

## Implementing Your Own Provider

For any other backend, follow the same shape:

1. **Create a class** that extends `StoredFileServiceBase` and implements `IStoredFileService`.
2. **Implement the seven abstract methods** listed above. Each receives a `StoredFileVersion` that exposes the file's Id, file type (extension), and the parent `StoredFile` (which has the `Folder` property).
3. **Build a storage key or path** from the version's properties. The convention is `{folder}/{versionId}.{extension}`, but any scheme works as long as it is deterministic.
4. **Register your service** in your module's `Initialize` method as shown above.

### Things to Watch Out For

| Topic | Guidance |
|---|---|
| `Stream handling` | When returning streams from `GetStreamAsync`, copy into a `MemoryStream` first so the underlying connection or SDK response can be disposed. Returning the raw response stream often leads to lock or connection-leak bugs. |
| `Version metadata` | After writing content in `UpdateVersionContentAsync`, update `version.FileSize` and call `VersionRepository.UpdateAsync(version)` so the database stays in sync with what is actually in storage. |
| `Error handling` | The base class does not catch exceptions from your storage methods. If S3 (or whatever backend) is unavailable, the exception propagates to the caller. Add retry or circuit-breaker logic in your implementation if you need resilience. |
| `Synchronous methods` | `GetStream` and `DeleteFromStorage` are sync counterparts required by the interface. If your SDK only exposes async APIs, wrapping with `.GetAwaiter().GetResult()` (as shown in the sample) is acceptable. |
| `Dependency injection` | Your service receives the same repositories (`IRepository<StoredFile, Guid>`, and so on) as the built-in providers. Pass them through to the base constructor. Add storage-specific dependencies (SDK clients, configuration) to your own constructor. |

:::warning .GetAwaiter().GetResult() can deadlock
Blocking sync-over-async calls (`.GetAwaiter().GetResult()`) are convenient but can deadlock if the application uses a synchronisation context that captures the calling thread (for example, classic ASP.NET or WinForms). ASP.NET Core does not capture context by default, so it is safe in a typical Shesha host - but be aware of the risk if you reuse the provider elsewhere.
:::

---

## See Also

- [File Storage](../fundamentals/file-storage.md) - overview of Shesha's file storage system
- [File / FileList form component](/front-end-basics/form-components/Entity-References/files.md) - the front-end components for uploading and displaying files
