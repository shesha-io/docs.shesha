# On Initialized

In Shesha, the execution of queries and JavaScript functions can be automated at the time a page loads. This feature is essential for initializing the page state, fetching data, and preparing the UI for interaction with the user. Automatically running queries and functions provides a smooth user experience by ensuring necessary data is available right from the start.

Developers use the `on initialized` event handler to execute specific tasks or operations that need to happen as part of the initialization process. This might include setting up initial state, fetching initial data, configuring dependencies, or performing other actions needed for the component to function correctly.

- **Benefit 1: Initialization Tasks:**

  - The `onInitialized` event handler allows you to execute tasks or set up initial conditions when a component or feature is initialized. This is useful for performing actions that should occur once during the component's lifecycle, such as setting default values, configuring dependencies, or connecting to external resources.

- **Benefit 2: Avoiding Race Conditions:**

  - By providing a designated point for initialization tasks, you can avoid race conditions where certain actions need to be completed before the component is used. This ensures that the component is in a stable and consistent state.

- **Benefit 3: Code Organization:**
  - Event handlers contribute to a clean and organized code structure. Initialization-related tasks are encapsulated within the `onInitialized` function, making the codebase more readable and maintainable.

## When does it get triggered?

This action will be executed the first time the page loads, just before any API call has been made. At this stage, the form data has no data except for `initialValues`, if passed.

**Usage Examples:**

<!-- Provide usage examples here -->
