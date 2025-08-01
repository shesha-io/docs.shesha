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



