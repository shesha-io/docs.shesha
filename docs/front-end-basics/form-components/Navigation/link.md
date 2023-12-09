# Link

Used to move between web pages, explore different sections of a website, or visit entirely different online resources. Links are formed by embedding hyperlinks within text. When users click on these links, they can access specified web pages or resources. This makes browsing the internet easier and more intuitive.

## Content Properties

These properties are customizable options present in the property pane of the component, allowing users to modify the component according to their preferences. All of the properties contain a Javascript editor which allows users to execute Javascript expressions to control the component.

### Content

The written content of hyperlink.

### Href

The href attribute (Hypertext Reference) is used to define the hyperlink reference, which is the address or URL of the linked resource. This can be a web page, an image, a downloadable file, or any other online resource.

### Target

The target attribute determines where the linked content will be displayed when the link is clicked. It is optional, and if not specified, the default behavior is usually to open the link in the same browser window or tab.

- **Values:**

  - \_self: Opens the linked document in the same frame or tab.
  - \_blank: Opens the linked document in a new browser window or tab.
  - \_parent: Opens the linked document in the parent frame (if the page is in a frame).
  - \_top: Opens the linked document in the full body of the window, breaking out of any frames.

### Has Children

When the 'Has Children' property is checked, the link transforms into a container that can have various elements nestled inside it. These elements could be additional content such as words, images, or even other interactive features. Essentially, the link evolves from a standalone entity to a versatile container capable of encapsulating and presenting a richer set of elements, making it a more dynamic and engaging component. However, when you click on any of these elements, it will still redirect you to a different location as specified by the link.
