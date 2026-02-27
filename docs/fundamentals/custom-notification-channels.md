---
sidebar_label: Custom Notification Channels
---

# Custom Notification Channels

This guide explains how to extend Shesha's [notification framework](notifications.md) with a custom delivery channel (e.g. Slack, Microsoft Teams, WhatsApp). If you only need to send notifications through the built-in Email and SMS channels, see the main [Notifications](notifications.md) page instead.

Adding a custom channel involves four steps:

1. Implement the `INotificationChannelSender` interface
2. Register it in your DI container
3. Create a `NotificationChannelConfig` record in the database
4. Add notification templates for the new channel

## Step 1 — Implement `INotificationChannelSender`

The interface defines two methods:

```csharp
public interface INotificationChannelSender
{
    /// <summary>
    /// Returns the channel-specific recipient identifier for a Person
    /// (e.g. email address, phone number, Slack user ID).
    /// </summary>
    string? GetRecipientId(Person person);

    /// <summary>
    /// Sends the notification message through this channel.
    /// </summary>
    Task<SendStatus> SendAsync(
        IMessageSender? sender,
        IMessageReceiver receiver,
        NotificationMessage message,
        List<EmailAttachment>? attachments = null);
}
```

| Method | Purpose |
|--------|---------|
| `GetRecipientId` | Maps a `Person` entity to the address this channel uses. The built-in `EmailChannelSender` returns `Person.EmailAddress1`; `SmsChannelSender` returns `Person.MobileNumber1`. Your implementation should return whatever identifier your channel needs (e.g. a Slack user ID, a WhatsApp number). |
| `SendAsync` | Performs the actual delivery. Return `SendStatus.Success()` on success or `SendStatus.Failed("reason")` on failure. When a failure is returned, the framework's retry mechanism will automatically re-attempt delivery (up to 3 times). The `NotificationMessage` parameter contains the already-rendered `Subject` and `Message` — all template placeholders have been resolved before your sender is called. |

### Example — Slack Channel

```csharp
using Shesha.Domain;
using Shesha.Email.Dtos;
using Shesha.Notifications;
using Shesha.Notifications.Dto;
using Shesha.Notifications.MessageParticipants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyProject.Notifications
{
    /// <summary>
    /// Sends notifications via Slack using incoming webhooks.
    /// </summary>
    public class SlackChannelSender : INotificationChannelSender
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _webhookUrl;

        public SlackChannelSender(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _webhookUrl = configuration["Notifications:Slack:WebhookUrl"];
        }

        public string? GetRecipientId(Person person)
        {
            // Return the channel-specific identifier for this person.
            // This could be a Slack user ID stored on a custom property,
            // or fall back to email for Slack's email-based lookup.
            return person.EmailAddress1;
        }

        public async Task<SendStatus> SendAsync(
            IMessageSender? sender,
            IMessageReceiver receiver,
            NotificationMessage message,
            List<EmailAttachment>? attachments = null)
        {
            var recipientAddress = receiver.GetAddress(this);
            if (string.IsNullOrWhiteSpace(recipientAddress))
                return SendStatus.Failed("No recipient address available");

            try
            {
                var payload = new
                {
                    text = $"*{message.Subject}*\n{message.Message}"
                };

                var client = _httpClientFactory.CreateClient();
                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    Encoding.UTF8,
                    "application/json");

                var response = await client.PostAsync(_webhookUrl, content);

                return response.IsSuccessStatusCode
                    ? SendStatus.Success(null)
                    : SendStatus.Failed($"Slack returned {response.StatusCode}");
            }
            catch (Exception ex)
            {
                return SendStatus.Failed(ex.Message);
            }
        }
    }
}
```

## Step 2 — Register the Channel Sender

Add the channel sender to your DI container in `Startup.cs`:

```csharp
services.AddTransient<INotificationChannelSender, SlackChannelSender>();
```

## Step 3 — Create the Channel Configuration Record

The framework needs a `NotificationChannelConfig` record in the database to know about your channel. You can create this through the **admin UI** or via a **database migration**.

The most important property is `SenderTypeName` — this must be the **fully qualified class name** of your `INotificationChannelSender` implementation. The framework uses this to resolve which sender to invoke at runtime.

```csharp
[Migration(20250227100000)]
public class M20250227100000 : Migration
{
    public override void Up()
    {
        Insert.IntoTable("Frwk_NotificationChannelConfigs")
            .Row(new
            {
                Id = "B1C2D3E4-F5A6-7890-1234-567890ABCDEF",
                Name = "Slack",
                Description = "Slack incoming webhook notifications",
                SupportedFormatLkp = 1,       // 1 = PlainText
                SupportedMechanismLkp = 1,    // 1 = Direct
                SenderTypeName = "MyProject.Notifications.SlackChannelSender",
                StatusLkp = 1,                // 1 = Enabled
                SupportsAttachment = false,
                CreationTime = DateTime.UtcNow
            });
    }

    public override void Down()
    {
        Delete.FromTable("Frwk_NotificationChannelConfigs")
            .Row(new { Id = "B1C2D3E4-F5A6-7890-1234-567890ABCDEF" });
    }
}
```

### Channel configuration properties

| Property | Column | Values |
|----------|--------|--------|
| SupportedFormat | `SupportedFormatLkp` | `1` = PlainText, `2` = RichText, `3` = EnhancedText |
| SupportedMechanism | `SupportedMechanismLkp` | `1` = Direct, `2` = BulkSend, `4` = Broadcast |
| MaxMessageSize | `MaxMessageSize` | Maximum character count (e.g. `160` for SMS, `0` for unlimited) |
| Status | `StatusLkp` | `1` = Enabled, `2` = Disabled, `3` = Suppressed |
| SupportsAttachment | `SupportsAttachment` | `true` or `false` |

## Step 4 — Create Templates for the New Channel

Add notification templates whose `MessageFormat` matches your channel's `SupportedFormat`. For a `PlainText` channel like Slack, use SMS-style templates:

```csharp
this.Shesha().NotificationUpdate("MyModule", "OrderConfirmed")
    .AddSmsTemplate(
        "C3D4E5F6-A7B8-9012-CDEF-123456789012".ToGuid(),
        "Order Confirmed Slack",
        "Order {{OrderNumber}} confirmed for {{CustomerName}}");
```

:::tip Avoiding template collisions
If your custom channel uses `PlainText` format, it will share templates with the SMS channel (both match on `PlainText`). If you need channel-specific templates, consider using `EnhancedText` as the supported format for your custom channel to keep its templates separate from SMS.
:::

## How the Framework Routes to Your Channel

When a notification is sent, the framework determines which channel(s) to use (see [Channel Selection Logic](notifications.md#channel-selection-logic) on the main notifications page). For each selected channel, it:

1. Looks up the `NotificationChannelConfig` record
2. Resolves the `INotificationChannelSender` implementation using the `SenderTypeName`
3. Finds a `NotificationTemplate` whose `MessageFormat` matches the channel's `SupportedFormat`
4. Renders the template placeholders against the notification data model
5. Calls your `SendAsync` method with the rendered `NotificationMessage`

If `SendAsync` returns a failure, the framework queues a retry (up to 3 attempts with delays of 10, 20, and 20 seconds).
