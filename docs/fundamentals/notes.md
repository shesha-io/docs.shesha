---
sidebar_label: Notes
---

# Notes

The ability to capture notes arbritrarily against almost any entity is such a common requirement that the Shesha framework provides a generic Notes component and `Note` entity and API to store and manage captured notes.

Allowing notes to be captured on a form is as simple as	adding the `Notes` component to the form. The `Notes` component will automatically display any notes that have been captured against the entity that the form is bound to. 

[INSERT NOTES SCREEN SHOT OF A FORM WITH A NOTES]

More details on how to use and configure the `Notes` component can be found [here](/front-end-basics/form-components/Entity-References/notes.md).


# The Note entity

Any notes captured are stored in the `Note` entity. The `Note` entity has the following properties:

| Property          | Type    | Description       |
|-------------------|---------|-------------------|
| OwnerType         | string  | The type of the owner of the note. |
| OwnerId           | string  | The ID of the owner of the note. The Owner will be some entity that the note is associated with. For example this may be an `Organisation`, `Person` or any other entity against which it may be useful to add a note. |
| Category          | RefList(NoteType)  | The category of the note. This is used to differentiate between different sets of notes that may be associated with the same owner. |
| Priority          | RefList(NotePriority)  | Allows a note to be flagged as important. |
| Parent            | Note  | The parent note of the current note. This is useful when there is a need for 'threaded' notes or discussions. |
| NoteText          | string  | The text content of the note. |
| Author            | Person  | The author of the note. |
| HasAttachment     | bool  | Indicates whether the note has one ore more attachments associated with it. |
| VisibilityType    | RefList(VisibilityType) | Specifies the visibility of the note e.g. Private, Public. |
| CreationTime         | DateTime  | The date and time the note was created. |
| CreatorUserId         | long?  | Id of the user who created the note. |
| LastModificationTime        | DateTime?  | The date and time the note was last modified. |
| LastModifierUserId        | long?  | Id of the user who last modified the note. |


# See Also
- Configuring the [Notes form component](../front-end-basics/form-components/Entity-References/notes.md)
