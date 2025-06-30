# createAsync

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
