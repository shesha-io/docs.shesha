# updateAsync

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
