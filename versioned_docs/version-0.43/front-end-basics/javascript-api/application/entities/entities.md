# Entities Actions

The **application.entities** object provides access to the entities API (all the different functions you can use to interact with entities).
Shesha uses modules to group different parts of the application. In this fashion, shesha uses modules to group
entities.

To get the entities from a specific module, you use this pattern with:  
 `application.entities.[module-name-here].[entiy-name-here]`  

To use the different functions, you can use the following pattern:  
 `application.entities.[module-name-here].[entiy-name-here].[function-name-here]`


For example, to access the entity `Shesha.Core.Organisation` from the `Shesha` module, you use this pattern: 
 `application.entities.shesha.Organisation`.


Each entity type contains 4 basic CRUD methods:

1. `createAsync`– create a new entity.
2. `getAsync`– fetch entity data from the back-end.
3. `updateAsync`– update entity.
4. `deleteAsync`– delete entity.

All listed operations use default CRUD API endpoints and don't require manual usage of urls.

![accessing-entities](./images/accessing-entities-api.png)

Get API Endpoints that are available for this entity: `application.entities.shesha.Organisation.getApiEndpointsAsync`

### `createAsync` - create a new entity

```typescript
try {
 const newPerson = await application.entities.shesha.Person.createAsync({
  firstName: 'Jane',
  lastName: 'Doe',
  emailAddress1: 'test@mail.com',
  mobileNumber1: '1234567890',
 });
 message.success('Person created successfully!');
}
catch (error) {
 console.error('Failed to create person.', error);
}
```

### `getAsync` - fetch entity data from the back-end

```typescript
const personId = '...';
try {
  const person = await application.entities.shesha.Person.getAsync(personId);
  const { firstName, lastName } = person;
  message.success(`Person data fetched. First name: '${firstName}', Last name: '${lastName}'`);
}
catch (error) {
  console.error('Failed to fetch person data. ', error);
}
```

### `updateAsync` - update existing entity

```typescript
try {
 const updatedPerson = await application.entities.shesha.Person.updateAsync({
  id: personId,
  emailAddress1: 'newemail@mail.com',
  mobileNumber1: '5555555555',
 });
  message.success('Updated person successfully.', updatedPerson);
}
catch (error) {
 console.error('Failed to update person.', error);
}
```

### `deleteAsync` - delete an entity


```typescript
try {
	await application.entities.shesha.Person.deleteAsync(personId);
	  message.success('Deleted person successfully.');
}
catch (error) {
	console.error('Failed to delete person.', error);
}
```
