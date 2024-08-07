---
sidebar_label: Notifications
---

# Notifications

Enterprise applications often need to send notifications through various channels such as SMS, Email, mobile Push, or WhatsApp. 

To cater to this need, Shesha offers robust and user-friendly features for sending notifications. These features are designed to be scalable, fault-tolerant, and auditable, ensuring reliable and efficient notification delivery. Shesha's notification framework provides the following benefits:

1. Supports queuing of notifications and automated retries in case of failure (e.g. network or gateway unavailability)
1. Provides an audit trail with visibility of all the notifications sent out
1. Provides a template manager to allow the notification text to be easily updated as requirements change
1. Supports plain text and rich text (i.e. HTML) notification template formats

# Implementing Notifications

At a high-level the sequence for implementing notifications are as follows:

1. Set-up the notification template
1. Implement the notification sender logic
1. Call notification sender 

Additional classes that may need to be added may look as follows:

![image](https://user-images.githubusercontent.com/85956374/222987435-2618ba19-486d-460c-8939-e60ab67b5663.png)

## Step 1 - Set-up the notification template(s)

### Step 1a
Create a utility class to provide the template GUIDs. Each of the GUIDs simply need to be unique and can be generated using a utility <a href="https://www.guidgenerator.com/" target="_blank">such as this</a>.

#### Example - NotificationTemplateIds.cs
```cs
namespace MyProject.Notifications
{
    /// <summary>
    /// Notification template identifiers
    /// </summary>
    public static class NotificationTemplateIds
    {
        /// <summary>
        /// All The Bursary Management Notifications Will be under this category of notifications
        /// </summary>
        public static Guid CompletionOfNewBooking = "643D0631-AD92-48C0-88CB-3BDA6AED8EC4".ToGuid();

        public static Guid BookingCancelled = "5766aaff-ecd6-4b69-a4ad-4fc5f1fb6c9e".ToGuid();

        public static Guid BookingRescheduled = "416dceb5-6e8e-40e2-b9bc-e1a243274d24".ToGuid();

        public static Guid AppointmentReminder = "a4cc40c7-7c85-44b3-a7cc-dc04d1c9ea24".ToGuid();
    }
}
```

### Step 1b
Implement the class(es) for the notification model. This class is used to pass data that will then be used to populate the dynamic parts of the notification template(s).
#### Example - AppointmentNotificationModel.cs
```cs
namespace MyProject.Notifications.Models
{
    /// <summary>
    /// Model for most/all notifications relating to appointments.
    /// </summary>
    public class AppointmentNotificationModel : NotificationData
    {
        /// <summary>
        /// Recipient name
        /// </summary>
        public string Fullname { get; set; }

        /// <summary>
        /// Facility name
        /// </summary>
        public string FacilityName { get; set; }

        /// <summary>
        /// Appointment start date
        /// </summary>
        public string StartDate { get; set; }
    }
}
```

**Note:** Instead of creating a separate notifications model class, it is also possible to use the `NotificationData` base class directly as it can store a dictionary of data elements for the template.
```
var notificationData = new NotificationData();
notificationData["FullName"] = "John Smith";
```

### Step 1c - Create Notification Templates
Notification Templates define the contents of the notifications that will be sent. Templates are saved in the database and are therefore added through Database Migration classes using special Helper methods.

#### Example - M20220316231301.cs
```cs
    /// <summary>
    /// Adding notification templates for new notifications
    /// </summary>
    [Migration(20220316231301)]
    public class M20220316231301 : Migration
    {
        public override void Down()
        {
            throw new NotImplementedException();
        }

        public override void Up()
        {
            this.Shesha().NotificationCreate("His", "Booking Cancelled")
                .SetDescription("Confirms cancellation of a booking.")
                .AddSmsTemplate(NotificationTemplateIds.BookingCancelled, "Booking Cancelled", "Dear {{Fullname}}, This is to confirm that your appointment at {{FacilityName}} for the {{StartDate}} has been cancelled.");

            this.Shesha().NotificationCreate("His", "Booking Rescheduled")
                .SetDescription("Confirms booking has been rescheduled.")
                .AddSmsTemplate(NotificationTemplateIds.BookingRescheduled, "Booking Rescheduled", "'Dear {{Fullname}}, This is to confirm that your appointment at {FacilityName}} has been rescheduled to {{StartDate}}.");

            this.Shesha().NotificationCreate("His", "Appointment Reminder")
                .SetDescription("Sends a reminder of an appointment.")
                .AddSmsTemplate(NotificationTemplateIds.AppointmentReminder, "Appointment Reminder", "Dear {{Fullname}}, This is a reminder of your appointment tomorrow at {{FacilityName}}.");
        }
    }
```

**Note:** Helper functions are also available for adding, updating and deleting templates (including for Email and Push notification templates) as per the example below:
```
    this.Shesha().NotificationCreate("Shesha", "TestNotification")
        .SetDescription("Example of notification")
        .AddEmailTemplate("70ADEAC2-BCCB-4650-88FE-9C64FF83AAEE".ToGuid(), "first email", "e1", "e2");

    this.Shesha().NotificationUpdate("Shesha", "TestNotification")
        .SetDescription("Lorem ipsum")
        .AddEmailTemplate("AC15AEB7-0101-4EC1-A096-EE6F2B5A7BF5".ToGuid(), "Email template 1", "Notification: your request approved", @"Hi {{FullName}}. Your request has been approved.")
        .AddSmsTemplate("BF447A5F-5195-4469-964D-77A9D32A7159".ToGuid(), "Sms template 1", "Your request has been approved")
        .AddEmailTemplate("962DE2AA-62C1-43C4-883F-4CEB2DB24A8C".ToGuid(), "Email template 2", "Notification: your request approved", @"Hi {{FullName}}. Your request has been approved.")
        .AddSmsTemplate("373D7C41-38D9-40AC-9906-E4FA42ECBFCA".ToGuid(), "Sms template 2", "Notification: your request approved")
        .AddPushTemplate("4A559653-F00B-43B3-B23E-A58656851EC7".ToGuid(), "push name", "push subject", "push body");
        //+.DeleteTemplates();

    this.Shesha().NotificationTemplateUpdate("BF447A5F-5195-4469-964D-77A9D32A7159".ToGuid())
        .SetName("new name")
        .SetBody("new body")
        .SetSubject("new subject")
        .SetBodyFormat(Domain.Enums.RefListNotificationTemplateType.PlainText)
        .SetSendType(Domain.Enums.RefListNotificationType.Push)
        .Disable();

    this.Shesha().NotificationTemplateDelete("962DE2AA-62C1-43C4-883F-4CEB2DB24A8C".ToGuid());
```


## Step 2 - Implement the notification sender logic
This class exposes simple methods to allow the application to send notifications. It performs any checks or validation logic that may be required prior to sending a notification, prepares the data required by the notification template then calls the underlying notification framework to generate and queue up the notification to be sent.

### Example - BookingNotificationSender.cs
```cs
namespace MyProject.Notifications
{
    /// <summary>
    /// Booking notification sender
    /// </summary>
    public class BookingNotificationSender : IBookingNotificationSender, ITransientDependency
    {
        private readonly INotificationAppService _notificationAppService;
        private readonly IRepository<Hospital, Guid> _hospitalRepository;

        public BookingNotificationSender(INotificationAppService notificationAppService, IRepository<Hospital, Guid> hospitalRepository)
        {
            _notificationAppService = notificationAppService;
            _hospitalRepository = hospitalRepository;
        }

        public async Task NotifyAppointmentReminderAsync(CdmAppointment appointment)
        {
            await SendNotificationAsync(appointment, NotificationTemplateIds.AppointmentReminder);
        }

        public async Task NotifyBookingCancelledAsync(CdmAppointment appointment)
        {
            await SendNotificationAsync(appointment, NotificationTemplateIds.BookingCancelled);
        }

        public async Task NotifyBookingRescheduledAsync(CdmAppointment appointment)
        {
            await SendNotificationAsync(appointment, NotificationTemplateIds.BookingRescheduled);
        }

        public async Task NotifyCompletionOfNewBookingAsync(CdmAppointment appointment)
        {
            await SendNotificationAsync(appointment, NotificationTemplateIds.CompletionOfNewBooking);
        }
        
        /// inheritedDoc
        private async Task SendNotificationAsync(CdmAppointment appointment, Guid notificationTemplateId)
        {
            if (appointment == null)
                throw new Exception($"{nameof(appointment)} must not be null");

            if (appointment.Start == null)
                throw new Exception($"{nameof(appointment.Start)} must not be null");

            var mobileNo = !string.IsNullOrWhiteSpace(appointment.ContactCellphone)
                ? appointment.ContactCellphone
                : appointment.Patient.MobileNumber;
            if (string.IsNullOrWhiteSpace(mobileNo))
                return;


            var healthFacility = appointment.Slot?.Schedule?.HealthFacilityOwner;

            if (healthFacility == null)
                return;

            var notificationData = new AppointmentNotificationModel
            {
                Fullname = !string.IsNullOrWhiteSpace(appointment.ContactName)
                    ? appointment.ContactName
                    : appointment.Patient.FullName,
                StartDate = appointment.Start?.FormatDate(),
                FacilityName = healthFacility?.Name
            };

            await _notificationAppService.PublishSmsNotificationAsync(
                templateId: notificationTemplateId,
                data: notificationData,
                mobileNo: mobileNo
            );
        }
    }
}
```

### Example - IBookingNotificationSender.cs
It's usually good practice to implement an interface to the notification sender in case where the notification logic may need to be overridden in the future. E.g. client specific notification logic beyond simple changes to the template.
```cs
namespace MyProject.Bookings.Notifications
{
    /// <summary>
    /// Booking notification sender interface
    /// </summary>
    public interface IBookingNotificationSender
    {
        /// <summary>
        /// 
        /// </summary>
        Task NotifyCompletionOfNewBookingAsync(CdmAppointment appointment);

        Task NotifyBookingCancelledAsync(CdmAppointment appointment);

        Task NotifyBookingRescheduledAsync(CdmAppointment appointment);

        Task NotifyAppointmentReminderAsync(CdmAppointment appointment);

    }
}
```

## Step 3 - Call notification sender 
Once the previous steps have been completed it is just a matter of calling the notification method from the appropriate points in the application.

### Example
```cs
    var appointment = new Appointment();
    ...

    // send notification
    var bookingNotificationSender = IocManager.Resolve<IBookingNotificationSender>();  // Instead of this can also be instantiated via the class constructor
    await bookingNotificationSender.NotifyBookingRescheduledAsync(appointment);
```
