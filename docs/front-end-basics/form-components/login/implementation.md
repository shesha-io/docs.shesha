---
sidebar_label: Implementation
---

# Implementation

A Shesha starter project already wires its login route up to the configurable `Shesha/login` form. If your project's login page is not yet set up this way, open `src/app/login/page.tsx` in your frontend project, remove its entire content, and replace it with the snippet below.

---

## Locate the File

The file lives under your project's `src/app` folder, alongside the other route folders such as `account` and `dynamic`.

![Image](./images/nav-bar.png)

---

## Replace the Content

```tsx
"use client";

import React from "react";
import { ConfigurableForm, PageWithLayout } from "@shesha-io/reactjs";
import { ACTIVE_LOGIN } from "@/app-constants/layout";

interface IProps {}

const Login: PageWithLayout<IProps> = () => (
  <ConfigurableForm mode={"edit"} formId={ACTIVE_LOGIN} />
);

export default Login;
```

`ACTIVE_LOGIN` is defined in your project's own `src/app-constants/layout.ts` file, and by default it just points at `LOGIN_CONFIGURATION`, the `Shesha/login` form described in [Design](./design.md).

:::tip
If you want the login page to use a different form entirely, you don't need to touch `page.tsx`. Create your custom form in the form designer, then update `ACTIVE_LOGIN` in `src/app-constants/layout.ts` to point at it instead.
:::
