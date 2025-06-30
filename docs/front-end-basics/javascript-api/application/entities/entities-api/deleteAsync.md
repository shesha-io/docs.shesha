# deleteAsync

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