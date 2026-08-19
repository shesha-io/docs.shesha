---
sidebar_label: Authentication
sidebar_position: 1
title: Authentication
---

# Authentication

Shesha's authentication framework provides a secure and flexible way to manage how users log in to an application. Out of the box it authenticates users with a username and password over JWT bearer tokens, backs that up with one-time-password (OTP) verification for password resets and mobile login, and gives you an extension point for plugging in your own external identity provider.

---

## Authentication Settings

Authentication and account security are governed by application settings, managed from the Settings page (`/shesha/settings`) rather than a configuration file, so they can be changed without redeploying the application. They are split across two categories in the settings menu:

- **Password complexity** - password strength rules.
- **Security** - session timeout, account lockout, and the password-reset options described later in this page.

The Settings page also splits settings by scope: a **General** view that applies once across the whole application, and a per-front-end view (for example Default UI) for settings that can differ between registered front-ends. Password complexity, and the account lockout settings within Security, are per-front-end; session timeout and the password-reset settings within Security are General. See [Settings Page Overview](/docs/settings/settings-overview) for how that split works.

<LayoutBanners url="https://app.guideflow.com/embed/ok8ve9ysqp" type={1}/>

### Password Complexity

Password strength is controlled by a set of complexity rules, each its own setting under the **Password complexity** category. These are per-front-end settings, so you'll find them under a selected front-end rather than under General:

| Setting (as labelled on screen) | Property | What it controls |
|---|---|---|
| **Require digit** | `RequireDigit` | Whether a password must contain at least one digit |
| **Require lowercase** | `RequireLowercase` | Whether a password must contain at least one lowercase letter |
| **Require upper case** | `RequireUppercase` | Whether a password must contain at least one uppercase letter |
| **Require non alphanumeric** | `RequireNonAlphanumeric` | Whether a password must contain at least one non-alphanumeric character |
| **Require length** | `RequiredLength` | The minimum number of characters a password must have |

### Account Lockout

Shesha can automatically lock an account out for a period of time after too many failed login attempts. This is controlled by three individual settings under the **Security** category. Like Password complexity, these are per-front-end settings:

| Setting (as labelled on screen) | Property | What it controls |
|---|---|---|
| **Is user lockout enabled** | `UserLockOutEnabled` | Whether accounts are locked out after repeated failed login attempts |
| **Max failed login attempts before lockout** | `MaxFailedAccessAttemptsBeforeLockout` | How many failed attempts are allowed before the account is locked |
| **User lockout (sec)** | `DefaultAccountLockoutSeconds` | How long a locked account stays locked before it can be tried again |

:::note
Password complexity and account lockout are each their own setting row under their category - they are not part of the Security Settings form described below.
:::

### Session Timeout

An idle session can be configured to log the user off automatically after a period of inactivity. This is the **Auto Logoff Timeout** field on the **Security Settings** form, under the Security category. That same form also holds the password-reset configuration described under [Security Settings (General)](#security-settings-general) below.

Unlike Password complexity and Account Lockout above, the Security Settings form is a **General** setting. It applies once across the whole application, so you'll find it under the Settings page's General view rather than under a selected front-end.

---

## One-Time Password (OTP) Verification

Shesha uses one-time passwords as a step-up verification method in a few places, rather than a traditional authenticator-app style two-factor login. This includes resetting a forgotten password using an emailed link, an SMS one-time password, or security questions, as well as verifying a mobile login pin. Each of these methods has its own configurable lifetime, so a link or code can only be used for a limited window before it expires.

---

## Security Settings (General)

The **Security** category's General settings all live together as fields on one compound **Security Settings** form, rather than as separate setting rows. Listed in the order they appear on that form:

| Setting | What it controls |
|---|---|
| `AutoLogoffTimeout` | How long a session can sit idle before Shesha automatically logs the user out. This is enforced in the browser, so an idle session ends even if the user simply leaves the tab open |
| `UseResetPasswordViaEmailLink` | Whether a user can reset their password using a link sent to their email address |
| `ResetPasswordEmailLinkLifetime` | How long that emailed link remains valid before it expires |
| `UseResetPasswordViaSmsOtp` | Whether a user can reset their password using a one-time password sent by SMS |
| `ResetPasswordSmsOtpLifetime` | How long that SMS one-time password remains valid before it expires |
| `MobileLoginPinLifetime` | How long the one-time pin used for mobile OTP login remains valid before it expires |
| `UseResetPasswordViaSecurityQuestions` | Whether a user can reset their password by answering security questions |
| `ResetPasswordViaSecurityQuestionsNumQuestionsAllowed` | How many security questions the user must answer correctly |

These are all **General** settings - they apply once across the whole application rather than being repeated per front-end. The same form also holds [Default Endpoint Access](/docs/fundamentals/security/endpoint-permissions), which is unrelated to authentication and covered on its own page.

<LayoutBanners url="https://app.guideflow.com/embed/1pzw2oltmp" type={1}/>

---

## Custom Authentication Providers

The framework gives you an extension point for implementing your own external identity provider (for example, a corporate identity provider or a social login), rather than shipping a specific provider such as Azure AD or OAuth out of the box.

To add a custom provider, you implement the provider's user lookup logic against an abstract base class, and register your provider so the framework knows it exists. At login time, the framework resolves the correct provider implementation by name and uses it to validate the user and retrieve their details.

:::note
No external identity providers are bundled with Shesha by default. This mechanism exists purely as an extension point for you to implement the providers your application needs.
:::

### Worked Example: A Custom "Acme SSO" Provider

Suppose your organisation has its own identity system, "Acme SSO", that issues an access code your front-end can exchange for the logged-in user's details. Here is how to plug it in as a custom provider.

#### Step 1 - Implement the Provider API

Create a class that extends `ExternalAuthProviderApiBase` and implements `GetUserInfoAsync`, the one method you need to fill in. It receives the access code your front-end obtained from Acme SSO, and must return an `ExternalAuthUserInfo` describing the user:

```cs
using Shesha.Authentication.External;
using System.Net.Http;
using System.Threading.Tasks;

namespace YourApp.Authentication
{
    public class AcmeSsoProviderApi : ExternalAuthProviderApiBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public AcmeSsoProviderApi(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public override async Task<ExternalAuthUserInfo> GetUserInfoAsync(string accessCode)
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetFromJsonAsync<AcmeUserProfile>(
                $"https://sso.acme.example/api/userinfo?code={accessCode}&client_id={ProviderInfo.ClientId}");

            return new ExternalAuthUserInfo
            {
                Provider = ProviderInfo.Name,
                ProviderKey = response.Id,
                Name = response.FirstName,
                Surname = response.LastName,
                EmailAddress = response.Email
            };
        }

        private class AcmeUserProfile
        {
            public string Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }
    }
}
```

:::note
`ExternalAuthProviderApiBase` already implements `IsValidUserAsync` for you, by calling your `GetUserInfoAsync` and comparing the returned `ProviderKey` to the one the client sent. You only need to implement `GetUserInfoAsync`. `ProviderInfo`, populated from the registration in Step 2, is available to read from inside it.
:::

#### Step 2 - Register the Provider

Add the provider to `IExternalAuthConfiguration.Providers`, a singleton list that Shesha resolves the provider type from at login time. Do this in your module's `Initialize` method, alongside your other module registrations:

```cs
using Shesha.Authentication.External;

public override void Initialize()
{
    var thisAssembly = Assembly.GetExecutingAssembly();
    IocManager.RegisterAssemblyByConvention(thisAssembly);

    var externalAuthConfiguration = IocManager.Resolve<IExternalAuthConfiguration>();
    externalAuthConfiguration.Providers.Add(new ExternalLoginProviderInfo(
        name: "AcmeSso",
        clientId: "your-acme-client-id",
        clientSecret: "your-acme-client-secret",
        providerApiType: typeof(AcmeSsoProviderApi)
    ));
}
```

`name` is the value the front-end passes as `authProvider` when it logs a user in, so it must match whatever your login button is configured to send. `clientId`/`clientSecret` are stored on `ProviderInfo` for your provider implementation to use however it needs them - they are not otherwise interpreted by the framework.

#### Step 3 - Call It From the Front End

Once registered, the provider appears in the list returned by `GET /api/TokenAuth/GetExternalAuthenticationProviders`. After your front-end completes Acme SSO's own login flow and obtains an access code, exchange it for a Shesha session by calling `POST /api/TokenAuth/ExternalAuthenticateAsync`:

```json
{
  "authProvider": "AcmeSso",
  "providerKey": "<the user id Acme SSO returned>",
  "providerAccessCode": "<the access code Acme SSO returned>"
}
```

Shesha calls your `GetUserInfoAsync` with the access code, checks that the returned `ProviderKey` matches the one the client sent, and then either logs the user in, if a Shesha user is already linked to this provider key, or registers a new one automatically using the returned name and email address.

:::warning
If no Shesha user is linked to this provider key yet, `ExternalAuthenticateAsync` registers one automatically, with a random password and its email address marked as confirmed. If your organisation's user provisioning should not create local accounts without a review step, add that check inside your own provider implementation or front-end flow.
:::
