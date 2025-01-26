---
sidebar_label: Inline Editing Initialization
title: Inline Editing Initialization
---

Let's say you're on a details view of a specific member, this details view has a Membership payments child table which ìs filtered to only display the payments made by that specific member.

![Image](./images/inline-editing-initialization/inlineEditing1.png)

How do we then link the Member to a membership payment if we're on a child table ?

We can navigate to that our form designer and click on the specific dataTable element, and then the **New row init** property.

![Image](./images/inline-editing-initialization/inlineEditing2.png)

It is important to note that, when you're on a child table that exists on a details view, while inline Editing, we can access our Main form inclination using the form data object to initialize each new row on the table with a member **Id** to bind the payment to the member whose details we are currently viewing.

![Image](./images/inline-editing-initialization/inlineEditing3.png)

We can then save our form and go create a new member payment.

![Image](./images/inline-editing-initialization/inlineEditing4.png)

And then we see that the Membership payment has been successfully created.

![Image](./images/inline-editing-initialization/inlineEditing5.png)

