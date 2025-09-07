# Page context

Accessed via `contexts.pageContext`  

Contexts for storing temporary data for page.

`pageContext` - page level context. All the data stored in this context is available inside the open page and the forms used on this page (Sub forms, Modal dialogs, Form cells, Data list items, etc.). It can be used to save any temporary data used on the page, transfer data between the forms used on the page. When closing/changing a page, all the page context data is cleared.

## How to use

To save data in the context of any of these types, it is enough to specify a variable name and assign a value to it.

Setting a value

```Javascript
contexts.pageContext.myPageAvailable = 'test data`;
```

To use data from the context of any of these types, it is also enough to use the variable name.

Reading a value 

```Javascript
const getPlaceHolder = () => {
	return contexts.pageContext.myPageAvailable;
}
```

## The specifics of form contexts

Please note that one `appContext` and one `pageContext` are always available for use. However, there may be multiple `formContext`. For example, if two SubForms are used on a main form, then the main form has its own `formContext`, and each subform has its own `formContext`. The components on each of the forms (SubForms) will only have access to the `formContext` of their form.
