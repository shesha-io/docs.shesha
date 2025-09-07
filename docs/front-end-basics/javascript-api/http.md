# HTTP Requests

HTTP is the object that provides access to the HTTP API that can be used to make HTTP requests. HTTP Requests are the lifeblood of a Shesha application. In order for the application to function well, the front-end needs to send data to the backend, for that data to be saved in the database. This is where HTTP requests come in. The Shesha front-end uses axios under the hood, and an axios instance is exposed on almost all the available `Scripts` on the configurator. For more on Shesha Scripts, see [here](/docs/front-end-basics/configured-views/client-side-scripting/basic-scripting/).

## GET Method

This type of request is used to retrieve data from the backend server. The `GET` method returns a JavaScript promise (_see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)_). This means that as the developer, you need to write the code that will be executed once the promise is fulfilled. Say for example, you have an API that allows you to fetch user details provided with an ID. In order to make a request for a user with ID #1, you would typically do it like this:

```JavaScript
const userId = 1;
const apiUrl = `/api/services/app/User/Get?id=${userId}`;

// Make the http request
// The `http` instance is already provided for you on the Shesha Script and you don't need to
// redefine it
http.get(apiUrl)
	.then(response => {
		// do something with the response here
		return Promise.resolve(response);
	})
	.catch(error => {
		// do something with the error caught
		return Promise.reject(error);
	});
```

The `Promise.resolve` and `Promise.reject` are used to return a promise object when resolution of the said promise has been fulfilled or rejected. The `.then()` method is used to "fulfill" the promise, while the `.catch()` is used when handling resultant errors.

## POST Method

This type of request is used to send data to the backend server. It is usually used for creating resources, or even for doing certain operations on the server. Like the `GET` method, the `POST` method returns a promise as well. A very good example of a `POST` request in action, would be the `LOGIN` functionality. If you want a person to login to your application, they have to provide you with a username/password combination, and you would send that to the server, where you get a response from the server either as a success or a failure.

```JavaScript
// The values of the username and password could be retrieved from the form data object.
// Assume the form data object looks like this: {username: "userx@somecompany.com", "password987"}
const loginPayload = {
	username: data.username,
	password: data.password
}
const loginUrl = `/api/TokenAuth/Authenticate`
http.post(loginUrl, loginPayload)
	.then(response => {
		// do something with the response here
		return Promise.resolve(response);
	})
	.catch(error => {
		// do something with the error here
		return Promise.reject(error);
	});
```

Another example is when you want to create a user, on the backend. This can be done through the following http request:

```JavaScript
// Assume the data object looks like this:
// { firstname: "Lloyd", middlename: "Awesome", lastname: "Frontera", password: "Javier123", otherData: { usefulness: 1, awesomeness: -5 } }
// If you only want specific items from the data object, it's better to use the rest operator
// like below:
const { otherData, ...userData } = data;
const userCreationUrl = `/api/services/app/User/Create`
http.post(userCreationUrl, userData)
	.then(response => {
		// do something with the response here
		return Promise.resolve(response);
	})
	.catch(error => {
		// do something with the error here
		return Promise.reject(error);
	});
```

## PUT Requests

A `PUT` request is usually used to update a specific resource on the server. The client sends the representation of the resource to be updated / replaced, and the server will updated. This request is similar to a `POST` request in the sense that data needs to be sent to the server.

```JavaScript
// assume we have a data object like { id: 5, firstname: "Verence" }
const userUpdateUrl = `/api/services/app/User/Update`
http.put(userUpdateUrl, data)
	.then(response => {
		// do something with the response
		return Promise.resolve(response);
	})
	.catch(error => {
		// do something with the error here
		return Promise.reject(error);
	});
```

The above request will update the user with the `id` 1, with the supplied details, which in case it's the first name will be changed to Verence.

## DELETE Requests

As the name implies, `DELETE` requests are used for removing resources on the server. The method has no defined semantics for the message body, so it should be empty.

```JavaScript
// assume the user id you want to delete is 5
const deleteUserUrl = `/api/services/app/User/Delete?id=${id}`
http.delete(deleteUserUrl)
	.then(response => {
		// do something with the response
		return Promise.resolve(response);
	})
	.catch(error => {
		// do something with the error
		return Promise.reject(error);
	});
```

## Request Parameters

There are some times when you need to change request headers, or add new ones. In order to do that, you can specify parameters in your request. For example, let's say you want to send a custom header to the server, or change the "Accept" header to "text/html" instead of "application/json", you can do it through the following code:

```JavaScript
// send custom header called X-Custom-Header to the server in a GET / POST / PUT / DELETE request along with changing the Accept header to text/html
const requestHeaders = { 'X-Custom-Header': 'Some header value', 'Accept': 'text/html' };
const url = '/api/services/app/User';

http.get(`${url}`, { headers: requestHeaders })
// assuming data has already been defined
http.post(url, data, { headers: requestHeaders })
http.put(`${url}`, data, { headers: requestHeaders })
http.delete(`${url}`, { headers: requestHeaders })
...
```

By default, Shesha application endpoints require JWT authentication using Bearer tokens. However, **as long as the user is authenticated on the front-end, the Shesha framework will automatically append the bearer token to the http request**, so the developer doesn't have to worry about authentication.

There are some scenarios where you would want your response to come back as a `blob` instead if a `string` or `json`. In these cases, you would have to change the response type to the appropriate type. Current options for response types are: `json` (_which is the default_), `arraybuffer`, `document`, `text`, `stream`, `blob`. However, the `blob` option is only available in the browser.

A good example of a scenario where you would need to use different response types, is when your server returns a `Stream` or `File`. Imagine if you have the following C# code on a certain API endpoint:

```C#
// generate pdf content
...
var fileContents = await _fileService.GenerateFileStreamAsync(...);
return new FileStreamResult(fileContents, "application/pdf")
{
	FileDownloadName: "Some-pdf-report-file.pdf"
};
```

In your http request, you would then do the following:

```JavaScript
// specify file url and download the specified file through an http request
...
const fileDownloadUrl = `/api/services/Reports/DownloadReport`;
http.get(fileDownloadUrl, {
	headers: {
		"Content-Type": "application/json-patch+json"
	},
	responseType: "blob"
})
...
```

By specifying the response type as a blob, the response data will be formatted as a blob instead of a json string, which makes it easier to download from your code script.

## Dynamically adding headers

In some scenarios, you might want to execute custom logic that builds headers. Inside your `app-provider.tsx`, you would add the following code:

```JavaScript
...
const buildHttpHeaders = (): IHttpHeadersDictionary => {
	...

	// your code goes here
}

return (
	<GlobalStateProvider>
		<ShaApplicationProvider
			...
			buildHttpRequestHeaders={buildHttpHeaders}
			...
		>
		...
		// rest of code
		...
		</ShaApplicationProvider>
	</GlobalStateProvider>
)
```

This means before an Http request is made, the `buildHttpHeaders` function is called, and the result of the function is added to the http headers. For example, assume you have a variable called `OrganisationId` that is stored in local storage, and you want to inject it into every http request. You can do it this way:

```JavaScript
...
const buildHttpHeaders = (): IHttpHeadersDictionary => {
	const organisationId = localStorage.getItem('OrganisationId');
	return {
		'Organisation-Id': organisationId || ''
	};
}
```

The above code will get the organisation ID from local storage, and add it to the headers of every http request made by the application.

## Response

The axios response returns an object that looks like the following:

```JSON
{
	// `data` is the response that was provided by the server
	data: {},
	// `status` is the HTTP status code from the server response
	status: 200,
	// `statusText` is the HTTP status message from the server response
	// As of HTTP/2 status text is blank or unsupported.
	// (HTTP/2 RFC: https://www.rfc-editor.org/rfc/rfc7540#section-8.1.2.4)
	statusText: 'OK',
	// `headers` the HTTP headers that the server responded with
	// All header names are lower cased and can be accessed using the bracket notation.
	// Example: `response.headers['content-type']`
	headers: {},
	// `config` is the config that was provided to `axios` for the request
	config: {}, // `request` is the request that generated this response
	// It is the XMLHttpRequest instance in the browser
	request: {}
}
```
