# User

#### Current user API – application.user
An object that contains following properties:

1. isLoggerIn (`bool`) – is true of the user is currently logged in
2. id (`string`) – id of the current logged in user (Id of the User entity)
3. firstName (`string`) – first name of the current user
4. lastName (`string`) – last name of the current user
5. userName (`string`) – user name of the current user
6. hasPermissionAsync (`function(permission: string, permissionedEntity?: IEntityReferenceDto) => Promise<boolean>`) – asynchronous function that check is the current user granted a specified permission. It allows to provide Permissioned Entity reference (`id` and `_className`) to checking for permissions scoped by Permissioned Entity
7. hasRoleAsync (`function(role: string) => Promise<boolean>`) – asynchronous function that check is the current user appointer to a specified role
8. personId (`string`) - personId of the current user

#### Example of the usage:
```javascript
const onAfterDataLoad = async (): Promise<void> => {
    const { user } = application;
    if (user.isLoggedIn) {
        console.log('User is logged in ');
        console.log("Current user is: ", user);
        console.log(`user id: ${user.id}`);
        console.log(`userName: ${user.userName}`);
        console.log(`firstName: ${user.firstName}`);
        console.log(`lastName: ${user.lastName}`);
        console.log(`person id: ${user.personId}`);

        const adminRole = 'System Administrator';
        console.log(`Check is user granted role '${adminRole}' ... `);

        try {
            const isGranted = await user.hasRoleAsync(adminRole);
            console.log(`Check is user granted role "${adminRole}" - ${isGranted ? "✅" : "❌"}`);
        }
        catch (error) {
            console.log("Failed to check role", error);
        }
    }
    else {
        console.log('User is NOT logged in');
    }
};
```
