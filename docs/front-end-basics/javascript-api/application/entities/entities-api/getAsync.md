# getAsync

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
