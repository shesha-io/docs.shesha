## Current user API – application.user

Requirements for this API available on [GitHub (issue 819)](https://github.com/shesha-io/shesha-framework/issues/819). It’s an object that contains following properties:

1. isLoggerIn (`bool`) – is true of the user is currently logged in
2. id (`string`) – id of the current logged in user (Id of the User entity)
3. firstName (`string`) – first name of the current user
4. lastName (`string`) – last name of the current user
5. userName (`string`) – user name of the current user
6. hasPermissionAsync (`function(permission: string, permissionedEntity?: IEntityReferenceDto) => Promise<boolean>`) – asynchronous function that check is the current user granted a specified permission. It allows to provide Permissioned Entity reference (`id` and `_className`) to checking for permissions scoped by Permissioned Entity
7. hasRoleAsync (`function(role: string) => Promise<boolean>`) – asynchronous function that check is the current user appointer to a specified role
8. personId (`string`) - personId of the current user

Example of the usage:
![image.png](../../images/image-c60cdf4b-985a-493e-b59e-1b3a739c0a43.png)
