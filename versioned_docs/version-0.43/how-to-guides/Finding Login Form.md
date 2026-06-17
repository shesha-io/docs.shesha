---
sidebar_label: Finding the Login Form
title: Finding and Editing the Login Form
---

# Finding and Editing the Login Form

Shesha ships with a default login form. To customise it - change the layout, add fields, restyle elements - you first need to find it in the Forms list and open it in the designer. The login form lives in the standard forms table, but it is filtered out of the default view, so you also have to remove that filter before you can see it. This guide walks through both steps.

---

## 1. Open Configurations

From the home page, click the **Configurations** button in the top navigation.

![Image](./images/login%20form/Configurations.png)

---

## 2. Open the Forms Section

From the Configurations area, click **Forms**.

![Image](./images/login%20form/Form-button.png)

---

## 3. Switch to Edit Mode

The Forms list filters out a number of internal forms (including the login form) by default. To see and edit those, you need to switch the application from **Live Mode** to **Edit Mode** using the toggle button at the top.

![Image](./images/login%20form/Edit-mode.png)

---

## 4. Open the Forms Table Configuration

Hover over the **Forms** title - a small popup appears. Click the pencil icon to open the table's configuration.

![Image](./images/login%20form/shesha.Comp.png)

You should now be on the popup configuration page:

![Image](./images/login%20form/PopPage.tsx.png)

---

## 5. Clear the Default Filter

Hover and click on the **DataTable Context** in the designer. A **Properties** panel appears on the right side.

- Click **Clear** to remove the default filter that hides the login form.
- Save the change.

![Image](./images/login%20form/DataTable-Contex.png)

---

## 6. Find and Open the Login Form

Close the popup tab (or navigate back to the Forms page) and search for **login** in the search bar. The table now shows the login form entries. Pick the one with **Module = shesha** and **Name = login** and click it.

![Image](./images/login%20form/FormDesign.png)

On the left, click the designer button (the square-grid icon) to open the form in the designer.

![Image](../front-end-basics/form-components/login/images/login-page-design.png)

---

## 7. Customise and Save

You can now edit the login form like any other configurable form. Make your changes and click **Save**.

:::tip
Once you have cleared the filter on the Forms table, you can come back and edit the login form at any time without going through Edit Mode again. The cleared filter is persisted with the table configuration.
:::
