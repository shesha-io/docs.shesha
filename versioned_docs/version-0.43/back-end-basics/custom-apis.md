---
sidebar_label: Custom APIs
sidebar_position: 21
---
# Application Services and Custom APIs

To implement custom APIs, you need to create an Application Service by creating a class that inherits from the `SheshaAppServiceBase`. `SheshaAppServiceBase` class provides a lot of useful functionality.

Any public method in the class will be exposed as an API endpoint. The method name will be used as the endpoint name, and the method parameters will be used as the request body.

### Example
``` csharp
using Abp.Domain.Repositories;
using Abp.UI;
using NHibernate.Linq;
using Shesha.DynamicEntities.Dtos;
using Shesha.Enterprise.Domain.Orders;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Shesha.Enterprise.Application.Services.Orders
{
    public class OrderAppService : SheshaAppServiceBase
    {
        private readonly IOrderManager _orderManager;
        private readonly IRepository<Order, Guid> _orderRepo;
        private readonly IRepository<OrderLineItem, Guid> _orderLineItemRepo;

        public OrderAppService(IOrderManager orderManager,
                               IRepository<Order, Guid> orderRepo,
                               IRepository<OrderLineItem, Guid> orderLineItemRepo)
        {
            _orderManager = orderManager;
            _orderRepo = orderRepo;
            _orderLineItemRepo = orderLineItemRepo;
        }

        /// <summary>
        /// Gets the last order for the current user.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException"></exception>
        [HttpGet]
        public async Task<DynamicDto<Order, Guid>> GetLastOrderAsync()
        {
            var currentUser = GetCurrentUserAsync();

            var order = await _orderRepo.GetAll()
                .Where(o => o.CreatorUserId == currentUser.Id)
                .OrderByDescending(o => o.CreationTime)
                .FirstOrDefaultAsync();

            if (order == null)
                throw new UserFriendlyException("No orders found.");
            
            return await MapToDynamicDtoAsync<Order, Guid>(order);
        }


        /// <summary>
        /// Updates the quantity of a line item and recalculates the order and line item properties.
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<DynamicDto<OrderLineItem, Guid>> UpdateOrderLineItemAsync(Guid id, int quantity)
        {
            var orderItem = await _orderLineItemRepo.GetAsync(id);

            var updatedOrderItem = await _orderManager.UpdateOrderLineItemAsync(orderItem, quantity);

            return await MapToDynamicDtoAsync<OrderLineItem, Guid>(updatedOrderItem);
        }

        /// <summary>
        /// Delete existing order line item and recalculates related order properties,  
        /// including TotalExclTax, TaxAmount, and TotalInclTax.
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task DeleteOrderItemAsync(Guid Id)
        {
            await _orderManager.DeleteOrderItemAsync(Id);
        }
    }
}
```


## Useful Methods and Properties from `SheshaAppServiceBase`

### Getting the Current User: `GetCurrentPersonAsync()` and `GetCurrentUserAsync()`
There are two methods to get the current user making the calls:
- `GetCurrentPersonAsync()`: This method returns the current user as a `Person` object.
- `GetCurrentUserAsync()`: This method returns the current user as a `User` object.


### Returning Entities as Dtos: `MapToDynamicDtoAsync()`
End-points that need to return an entity should not return the entity directly. Instead, they use the `MapToDynamicDtoAsync()` method to return a `DynamicDto<TEntity, TPrimaryKey>` object which is a dynamically generated Dto for that entity. This helps handle potential serialization problems and also include additional information about the entity.

``` csharp
public async Task<DynamicDto<Person, Guid>> GetLastCreatedPerson()
{

    var lastPerson = await _personRepo.GetAll().OrderBy(b => b.CreationTime).FirstOrDefaultAsync();

    if (lastPerson is null) throw new Exception("Person does not exist.");

    **return await MapToDynamicDtoAsync<Person, Guid>(lastPerson);**
}
```

### Validating Entities: `ValidateEntityAsync()`
The `ValidateEntityAsync()` method can be used to validate an entity. It will return `true` if the entity is valid, and `false` if it is not. The validation results will be returned in the `validationResults` parameter.
See the [Validation](/docs/fundamentals/validation) section for more information on the various methods to defining validation rules.

``` csharp
public async Task<bool> ValidatePersonAsync(Person person)
{
	var validationResults = new List<ValidationResult>();
	var isValid = await ValidateEntityAsync(person, validationResults);

	if (!isValid)
	{
		foreach (var validationResult in validationResults)
		{
			Logger.Error(validationResult.ErrorMessage);
		}
	}

	return isValid;
}
```
 
### Checking Permissions: `IsGranted()`
The `IsGranted(string permissionName)` method can be used to check if the user has permission to access the API. This is useful for securing the API and ensuring that only authorized users can access it.

### Injecting Services: `IocManager`
The `IocManager` property can be used to resolve dependencies and register services. This is useful for creating APIs that need to use other services.

### Other Useful Properties Inherited from ABP Application Service
- `UnitOfWorkManager` and `CurrentUnitOfWork`: This property can be used to manage the unit of work. It is useful for ensuring that all changes are saved to the database in a single transaction.
- `Logger`: This property can be used to log messages. It is useful for debugging and troubleshooting.