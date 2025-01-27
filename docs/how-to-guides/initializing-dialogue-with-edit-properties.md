---
sidebar_label: Initializing dialog with edit properties
title: Initializing dialog with edit properties
---

Consider a situation where you made an error on a table and you don't want to drill all the way down into the details view to be able to edit your information. 

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue1.png)

If you need to edit your table row information on a dialogue, we need to initialize that dialogue with the following row information. We can do that by navigating to the specific form;

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue2.png)

From there, click on the dataTable Component and then the **Configure Columns** button under properties

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue3.png)

Once, there add a new Column and move it to the top of the list

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue4.png)

Then, configure it by first setting the **Type** to **Action** and removing the column caption

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue5.png)

Click the **Select Icon** button to add an Icon. On the Icon search screen, search *Edit* and use the *EditOutlined* icon.

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue6.png)

Next add an **Action Configuration** of **Show Dialog**, a **Title** of **Edit Payment**, the **Modal form** will be the membership payment we created earlier and the **Submit Http Verb** will be **PUT**

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue7.png)

Next, under the **Additional Properties** section, click the **Click to Add Items** button 

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue8.png)

Then, add a new KeyValue pair of `id` and `{{selectedRow.id}}`

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue9.png)

Finally, toggle the **Handle Success** property to true and set its Action Name to `Form: Refresh`

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue10.png)

Then save the configuration and your form.

Now we can edit our payment Amount or Date

![Image](./images/initilizing-dialogue-with-edit-properties/initilizingdialogue11.png)


