## application.entities  

The **application.entities** object provides access to the entities API (all the different functions you can use to interact with entities).
Shesha uses modules to group different parts of the application. In this fashion, shesha uses modules to group
entities.

To get the entities from a specific module, you use this pattern with:  
> `application.entities.[module-name-here].[entiy-name-here]`  

For example, to access the entity `Shesha.Core.Organisation` from the `Shesha` module, you use this pattern: 
> `application.entities.shesha.Organisation`.

To use the different functions, you can use the following pattern:  
> `application.entities.[module-name-here].[entiy-name-here].[function-name-here]`

![accessing-entities](./images/accessing-entities-api.png)

For example all the functions available for the `Shesha.Core.Organisation` entity are:
> `Create`: `application.entities.shesha.Organisation.createAsync`
> `Read / Get`: `application.entities.shesha.Organisation.getAsync`
> `Update`: `application.entities.shesha.Organisation.updateAsync`
> `Delete`: `application.entities.shesha.Organisation.deleteAsync`
> `Get API Endpoints that are available for this entity`: `application.entities.shesha.Organisation.getApiEndpointsAsync`

### `createAsync`

Create a new entity, see code example below:

```typescript
console.log('LOG: create temporary person...');
try {
 const newPerson = await application.entities.shesha.Person.createAsync({
  firstName: 'Jane',
  lastName: 'Doe',
  emailAddress1: 'test@mail.com',
  mobileNumber1: '1234567890',
 });
 console.log('✅LOG: create person - success', newPerson);
}
catch (error) {
 console.error('❌LOG: create person - failed', error);
}
```

### `getAsync`

Fetch entity data from the back-end

```typescript
const personId = '...';
try {
 const person = await application.entities.shesha.Person.getAsync(personId);
 // access person data
 const { firstName, lastName } = person;
        console.log(`✅LOG: data fetched. Person marked as deleted successfully, firstName: '${firstName}', lastName : '${lastName}'`);
}
catch (error) {
 console.error('❌LOG: fetch of deleted person - failed', error);
}
```

### `updateAsync`

Update entity

```typescript
console.log('LOG: update person...');
try {
 const updatedPerson = await application.entities.shesha.Person.updateAsync({
  id: personId,
  emailAddress1: 'newemail@mail.com',
  mobileNumber1: '5555555555',
 });
 console.log('✅LOG: update person - success', updatedPerson);
}
catch (error) {
 console.error('❌LOG: update person - failed', error);
}
```

### `deleteAsync`

Delete entity

```typescript
console.log(`LOG: delete person, id = '${personId}'`);
try {
        await application.entities.shesha.Person.deleteAsync(personId);
        console.log('✅LOG: delete person - success');
}
catch (error) {
        console.error('❌LOG: delete person - failed', error);
}
```

