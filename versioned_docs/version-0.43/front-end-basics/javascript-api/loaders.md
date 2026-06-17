# Loader API

The Shesha loader provides a full-page spinner overlay that you can trigger from **form scripts**, **custom actions**, and **data context expressions**. It is designed for async operations where you want to give the user visual feedback.

---

## Contexts and Access Points

Shesha exposes the loader through **two separate contexts** depending on where your script runs:

### Page-level loader — `pageContext` / `loader`

Available in data context scripts and page-level expressions. Supports blocking mode.

```js
// via pageContext
const instance = pageContext.showLoader(message?, isBlocking?)
pageContext.hideLoaders()

// via loader shorthand
const instance = loader.show(message?, isBlocking?)
loader.hide()
```

### Form-level loader — `form`

Available in form scripts. Simpler API — no blocking mode control (always non-blocking at the form level).

```js
const instance = form.showLoader(message?)
form.hideLoaders()
```

---

## API Reference

### Page-level: `showLoader(message?, isBlocking?)` → `LoaderInstance`

Shows a full-page loading overlay.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | `'Loading...'` | Text shown below the spinner |
| `isBlocking` | `boolean` | `true` | Whether to block all user interaction |

Returns a **`LoaderInstance`** you use to control the loader after showing it.

### `loader.show(message?, isBlocking?)` → `LoaderInstance`

Shorthand for `pageContext.showLoader()`. Same parameters and return value.

---

### Form-level: `form.showLoader(message?)` → `FormLoaderInstance`

Shows a loading overlay scoped to the form context.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | `'Loading...'` | Text shown below the spinner |

Returns a **`FormLoaderInstance`** — a simpler instance with only `updateMessage` and `close` (no `block`/`unblock`).

---

### `LoaderInstance` methods (page-level)

| Method | Description |
|---|---|
| `updateMessage(message)` | Updates the text displayed in the loader |
| `block()` | Switches to blocking mode — dims the page and prevents interaction |
| `unblock()` | Switches to non-blocking mode — loader appears but user can still interact |
| `close()` | Closes and removes this specific loader |

### `FormLoaderInstance` methods (form-level)

| Method | Description |
|---|---|
| `updateMessage(message)` | Updates the text displayed in the loader |
| `close()` | Closes and removes this specific loader |

> **Note:** `form.showLoader()` does not support `block()`/`unblock()`. Use `pageContext.showLoader()` when you need blocking mode control.

---

### `hideLoaders()` / `loader.hide()`

Immediately closes **all** active loaders at once. Use this as a safety net when you don't have a reference to individual instances.

```js
pageContext.hideLoaders()  // page-level
loader.hide()              // shorthand
form.hideLoaders()         // form-level
```

---

## Blocking vs Non-blocking

Applies to page-level (`pageContext` / `loader`) only.

| Mode | Backdrop | User Interaction | Cursor |
|---|---|---|---|
| **Blocking** (default) | Dark dimmed overlay | Prevented | `not-allowed` |
| **Non-blocking** | Transparent | Allowed | Normal |

Use **blocking** for destructive or irreversible operations (saves, deletes, submits). Use **non-blocking** for background refreshes where the user can keep working.

---

## Examples

### Basic usage — page-level show and close

```js
const loader = pageContext.showLoader('Saving your changes...');
try {
  await http.post('/api/save', data);
  loader.close();
  message.success('Saved!');
} catch (error) {
  loader.close();
  message.error('Something went wrong.');
}
```

> **Always call `loader.close()` in both success and error paths.** Forgetting to close it in the catch block will leave the overlay stuck on screen.

---

### Basic usage — form-level show and close

```js
const loader = form.showLoader('Saving...');
try {
  await http.post('/api/save', data);
  loader.close();
  message.success('Saved successfully!');
} catch (error) {
  loader.updateMessage('Failed to save');
  setTimeout(() => loader.close(), 2000);
}
```

---

### Using the `loader` shorthand

```js
const instance = loader.show('Hang tight whilst we update...');
try {
  await http.post('/api/update', data);
  instance.close();
  message.success('Updated!');
} catch (error) {
  instance.close();
  message.error('Update failed.');
}
```

---

### Progressive feedback — updating the message

```js
const loader = pageContext.showLoader('Fetching records...');

const records = await http.get('/api/records');

loader.updateMessage('Processing records...');
for (let i = 0; i < records.length; i++) {
  loader.updateMessage(`Processing record ${i + 1} of ${records.length}...`);
  await processRecord(records[i]);
}

loader.close();
```

---

### Non-blocking background refresh

```js
// Show without blocking so the user can keep reading the page
const loader = pageContext.showLoader('Refreshing data...', false);
await refreshDashboardData();
loader.close();
```

---

### Switching modes mid-operation

```js
// Start non-blocking for the fetch phase
const loader = pageContext.showLoader('Loading preview...', false);
const preview = await fetchPreview();

// Switch to blocking before committing
loader.block();
loader.updateMessage('Saving...');
await savePreview(preview);

loader.close();
```

---

### Emergency close — hide all loaders

```js
// If you've lost the loader reference or want to guarantee a clean state
pageContext.hideLoaders();
// or
loader.hide();
```

---

## Visual Behaviour

- The loader renders at **z-index 9999**, so it always appears above modals, dropdowns, and tooltips.
- The spinner uses the Shesha loading animation (`/images/SheshaLoadingAnimation.gif`). If that image is unavailable, it falls back to an Ant Design spinner.
- The overlay card has a smooth **0.3s transition** when switching between blocking and non-blocking modes — no flicker.
- Multiple loaders can be active simultaneously. The **most recently shown** loader's message is displayed. If any active loader is blocking, the page is blocked.

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Loader stays on screen after an error | Always call `loader.close()` in the `catch` block |
| Page feels unresponsive during a background refresh | Use `isBlocking: false` |
| Loader appears behind a modal | Already handled — z-index is 9999 by default |
| Lost the loader reference | Call `pageContext.hideLoaders()` or `loader.hide()` to clear all |
| Called `loader.block()` from a form script | `form.showLoader()` doesn't support `block()`/`unblock()` — use `pageContext.showLoader()` instead |
