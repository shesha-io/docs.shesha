---
sidebar_label: Permission Based Security Model
sidebar_position: 10
title: Permission Based Security Model
---

# Permission Based Security Model

Shesha adopts a permission-based model, which means users can only perform restricted actions if they've been granted that specific permission. Think of it like having different keys for different doors in a building - you can only enter the rooms you're authorised to access.

This walkthrough shows how to create a new permission, assign it to a role, and use it to restrict a menu item. For the underlying concepts (roles, role types, and how RBAC works in Shesha), see [Authorization and Access Control](./access-control.md).

This article assumes you have configured your Shesha project so that it's up and running. If you haven't, you can set up your project [here](../../get-started/setting-up.md).

---

## Creating a Permission

From the homepage, navigate to the **Permissions Configurator** by clicking the **Permissions** button.

![Image](./images/permission-based-security-images/permission1.png)

On the **Permissions Configurator** page, create a new permission by clicking **Create root**.

![Image](./images/permission-based-security-images/permission2.png)

This opens a modal where you specify:

1. The module you want to apply the permission to.
2. The name of the permission.
3. The display name of the permission, as shown in the list alongside other permissions.
4. A description of what the permission does.

![Image](./images/permission-based-security-images/permission3.png)

Click **Save** to create the new permission. It now appears in the permissions list.

![Image](./images/permission-based-security-images/permission4.png)

You can also define a permission without a module.

![Image](./images/permission-based-security-images/permission5.png)

A permission created this way appears under the **no-module** section of the list.

![Image](./images/permission-based-security-images/permission6.png)

---

## Assigning a Permission to a Role

Next, assign the newly created permission to a role. Navigate to the **Roles** modal by clicking the **Roles** button to see the available roles.

![Image](./images/permission-based-security-images/permission7.png)

Click the magnifier icon next to a role, for example **System Administrator**, to open it.

![Image](./images/permission-based-security-images/permission8.png)

Click **Edit**.

![Image](./images/permission-based-security-images/permission9.png)

Select the checkbox for the newly created permission and click **Save**.

![Image](./images/permission-based-security-images/permission10.png)

---

## Restricting a Menu Item to the Permission

To make an area of the application, such as an administration menu group, available only to users whose role has the permission you just created, switch the application to **Edit Mode**. Click the **Live Mode** toggle in the top menu bar to switch it.

![Image](./images/permission-based-security-images/permission11.png)

Once switched, the top menu bar changes and a notification confirms the application is now in **Edit Mode**. See [Toggling Edit Mode](../../front-end-basics/configured-views/toggling-edit-mode.md) for more on this toggle.

![Image](./images/permission-based-security-images/permission12.png)

While in Edit Mode, click the **Permissions** button in the sidebar again to bring up the edit-mode permissions modal.

![Image](./images/permission-based-security-images/permission13.png)

Add the newly created permission to the menu group.

![Image](./images/permission-based-security-images/permission14.png)

:::note
Assigning permissions this way also applies to individual form components within a form - see the [Permissions](../../front-end-basics/form-components/common-component-properties.md#permissions) common property.
:::
