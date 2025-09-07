# Basic Scripting

Scripting can be added to your configured views to add more advanced functionality to your application. Scripts are typically added to the various events exposed by the form or form components. All scripting is done using JavaScript and a number of standard objects and functions are available to the script to facilitate the need to respond to various scenarios. 
Scripts are separated into 
1. Action Scripts - these are found on the `Action configuration` section of a clickable component (*e.g. buttons*).  Are asynchronous and return promises (*see [here](https://www.w3schools.com/js/js_async.asp)*). Most common usage of Action Scripts is making http calls.
2. Expression Scripts - are found on sections of components where dynamic validation is required, or dynamic configuration is done. For example, if you want a button to be hidden when a global state variable is set, you use an Expression Script. These start with `get` followed by what the script is supposed to do, e.g. for scripts that hide components, it will be `getHidden` etc.

Where to find Action Scripts
![[Action-Script-button-section.png]]


The sections below provides sample code for common use cases where scripting is typically required:

### Making API calls
For more information, see [here](/docs/front-end-basics/javascript-api/http).

Since Action Scripts are **asynchronous**, you need to return a **Promise**. For example, say you want to create a book on your API server, your action script would typically look like the following:
```JavaScript
// This is what the Action script looks like
// Notice the async() and the Promise<any> ?
const executeScriptAsync = async (): Promise<any> => {
  const bookData = { name: "Artemis Fowl", author: "Some Irish dude", genre: "dunno" };
  const bookCreationApi = `/api/services/app/Books/Create`;
  return http.post(bookCreationApi, bookData)
			  .then(response => {
					return Promise.resolve(response);			  
			  })
			  .catch(error => {
					return Promise.reject(error);
			  });
};
```

The reason for returning a `Promise.resolve` / `Promise.reject`, is as mentioned above the script. 

:::tip Response Actions
Instead of chaining requests or manually showing messages, it's better to make your script send a single request, then use the "Handle Success" action to perform a follow up action. For example, say you want to create a book on your API, and after creating the book, you want to  show the user a success / failure message. You would do the following:
-> On Action Configuration, you specify the Action Script which makes the http call
-> Select Handle Success / Handle Fail
-> On Success Handler / Fail handler, choose Common > Show message, and then input the message.

It is better to use this method, and limit one http call per script. This makes it easier to debug any issues that crop up, and avoids issues where the follow up call is finished before the subsequent call has finished executing. To share data across the scripts, you can use store the data in the `pageContext`. 
:::

:::tip
In other scenarios, you might want to use the configuration API Call (*see [here](/docs/front-end-basics/configured-views/action-configurations#api-call)*) instead of manually writing Execution Scripts. If you want to change the payload structure before submission, you can use the form's Prepared Values event. (*see [here](/docs/front-end-basics/configured-views/shesha-events/prepared-values)*)
:::

###  Useful data manipulation tricks
It is sometimes useful to modify the form data before submitting it to the back-end, for example to submit calculated values. This can be achieved in the following ways.

:::tip Use AppContexts
To avoid adding unnecessary data to the form that you then remove programmatically before posting to the back-end, you can also bind your form components to [appContexts](/docs/front-end-basics/configured-views/client-side-scripting/shesha-objects/app-context) instead.
:::

3. Object Destructuring (*see [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring)*)
```JavaScript
// Assume you have this data object coming from the form. I'm just going to declare it here
// to show what it looks like
const formData = { 
	name: "Lloyd", 
	middlename: "Something", 
	lastname: "Frontera", 
	gender: "Unknown", 
	age: 455, 
	dateOfBirth: "unknown", 
	organisation: {
		name: "Frontera Estate",
		parentOrganisation: "Magentano Kingdom"
	} 
};

// If our API accepts only the name, middlename, lastname, we can do the following
const { name, middlename, lastname, ...restOfStuff } = formData;
const payload = { name, middlename, lastname };

// Or if your API doesn't have the Organisation, but the other parameters, you can do this
const { organisation, ...apiStuff } = formData; 
// The following code will show
// { 
//	 name: "Lloyd", 
//	 middlename: "Something", 
//	 lastname: "Frontera", 
//	 gender: "Unknown", 
//	 age: 455, 
//	 dateOfBirth: "unknown"
// }
console.log(apiStuff); 
```

4. Object Re-assignment
There are cases where you would like to add a new property to your API payload before submitting. 
```JavaScript
// Assume you have your data object which looks like the following:
const formData = { 
	name: "Takumi", 
	middlename: "Drift-King", 
	lastname: "Fujiwara", 
	gender: "Male", 
	dateOfBirth: "22/01/1896",
	salary: 200
};

// Now you want to add tax calculations to the object because ... well, everybody pays taxes
// and your API would crash without them for some bad reason.
// Let's say the tax is at 50%
// The resulting object uses the rest operator (the funny dots before the formData) to copy
// the object's properties. So it contains all the form properties as well as the tax deduction.
const apiPayload = { ...formData, tax: 0.5 * formData.salary };
```


###  Hiding / Disabling buttons / components
As mentioned before, Expression Scripts provide a way to programmatically change a component. You could change anything from visibility to size to even the styling. ![[button_expose_script.png]]
![[button_script_after_toggle.png]]

For example, say you want to hide a button if a certain global state variable is set, in the code editor, you can use the following script:

```JavaScript
const getHidden = () => {
	// Assume the property in the globalState is a number called numTries, and you want 
	// to hide the button if the number of tries gets to a certain number.
	// You can do the following
	return globalState.numTries === 10;
};
```

**NB**: **All expression scripts must return a value, and while the nature of the value differs with the script, a value should be returned either way.**

### Script arguments
There are various objects which are part of Scripts. Shesha provides objects such as `globalState`, `pageContext`, `form`, `http`, etc. In order to check which objects are available in the script you wish to execute, you can log the `arguments` keyword.

```JavaScript

// In Action Scripts, you can do the following:
const executeScriptAsync = async () => {
    console.log("LOG::executeScript:arguments: ", arguments);
};

// Same thing to Expression Scripts
const getHidden = () => {
	console.log("LOG::getHidden:arguments: ", arguments);
};
```

If you view your browser's console, you should see something like the following:
![[form_arguments.png]]
Of course, the data shown will be different to what you see in the console window, but it doesn't really matter since the objects reflect the data that's on your system.

## Navigate to another page

### Using window.location.href

The `window.location` object provides information about the current URL and allows you to navigate to a new URL by setting the `href` property.

```javascript
window.location.href = "https://www.shesha.io";
```

### Using window.location.replace

This method is similar to setting window.location.href, but it does not create a new entry in the browser's navigation history. Instead, it replaces the current history entry.

```javascript
window.location.replace("https://www.shesha.io");
```

### Using window.location.assign

This method is also used for navigation and is similar to window.location.href. It loads a new document.

```javascript
window.location.assign("https://www.shesha.io");
```

## Reloading the current page

```javascript
window.location.reload();
```
