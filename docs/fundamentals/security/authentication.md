---
sidebar_label: Authentication
sidebar_position: 1
title: Authentication
---

# Authentication

Authentication is how Shesha confirms that a user is who they say they are before letting them into the application. Shesha's authentication framework is designed to provide a secure and flexible way to manage user authentication, supporting username/password login and passwordless one-time-pin (OTP) login out of the box, with an extension point for connecting your own external identity providers.

---

## Password-Based Login

Password login is the default authentication method. A user submits their username (or email) and password, Shesha verifies the credentials, and issues a signed JWT bearer token that the front end sends on every subsequent request. Logging out invalidates that token by blacklisting it, so it can't be reused even if a request is captured after the user has logged out.

---

## One-Time Pin (OTP) Login

Alongside password login, Shesha supports a passwordless login flow based on a one-time pin. A user requests a pin, receives it (for example via SMS), and submits it instead of a password to log in.

:::note
This OTP login is a passwordless alternative to entering a password, not multi-factor authentication. Shesha does not currently require a password and a second factor together as a combined login challenge. OTP is also used separately for password reset and for verifying a user's mobile number or email address during registration.
:::

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
| `MobileLoginPinLifetime` | How long the one-time pin used for [passwordless OTP login](#one-time-pin-otp-login) remains valid before it expires |
| `UseResetPasswordViaSecurityQuestions` | Whether a user can reset their password by answering security questions |
| `ResetPasswordViaSecurityQuestionsNumQuestionsAllowed` | How many security questions the user must answer correctly |

These are all **General** settings - they apply once across the whole application rather than being repeated per front-end. The same form also holds [`DefaultEndpointAccess`](/docs/fundamentals/security/endpoint-permissions), which is unrelated to authentication and covered on its own page.

<LayoutBanners url="https://app.guideflow.com/embed/0p0vo45bvk" type={1}/>

---

## Password Policy and Account Lockout

Administrators can configure how strict passwords need to be, and how the system responds to repeated failed login attempts. These are managed through Shesha's settings mechanism rather than a configuration file, so they can be changed without redeploying the application. The settings below live in two different categories on the Settings page (`/shesha/settings`), each as its own row rather than a single shared form.

Every setting in this table is **front-end specific**: it appears under a selected front-end (for example Default UI) rather than under the General view, so each registered front-end can enforce its own password and lockout policy. See [Settings Page Overview](/docs/settings/settings-overview) for how General and front-end-specific settings differ.

| Setting (as labelled on screen) | Category | What it controls |
|---|---|---|
| **Require digit** (`RequireDigit`) | Password complexity | Whether a password must contain at least one digit |
| **Require lowercase** (`RequireLowercase`) | Password complexity | Whether a password must contain at least one lowercase letter |
| **Require upper case** (`RequireUppercase`) | Password complexity | Whether a password must contain at least one uppercase letter |
| **Require non alphanumeric** (`RequireNonAlphanumeric`) | Password complexity | Whether a password must contain at least one non-alphanumeric character |
| **Require length** (`RequiredLength`) | Password complexity | The minimum number of characters a password must have |
| **Is user lockout enabled** (`UserLockOutEnabled`) | Security | Whether accounts are locked out after repeated failed login attempts |
| **Max failed login attempts before lockout** (`MaxFailedAccessAttemptsBeforeLockout`) | Security | How many failed attempts are allowed before the account is locked |
| **User lockout (sec)** (`DefaultAccountLockoutSeconds`) | Security | How long a locked account stays locked before it can be tried again |

<LayoutBanners url="https://app.guideflow.com/embed/5pvnm0gtxk" type={1}/>

---

## External Login Providers

Shesha defines a pluggable interface for connecting external identity providers, so you can add support for a provider your application needs (for example a corporate identity provider) without changing Shesha's core login flow.

To add a provider, implement the extension point that plugs into the external login flow, and register your provider with Shesha's external authentication configuration.

:::note
Shesha does not ship with any external providers pre-configured. You need to implement and register your own provider implementation before external login becomes available in your application.
:::

---

## Custom Authentication Providers

The framework's external-login extension point is also the supported way to add a custom authentication provider, for example to integrate with an identity system that isn't a standard OAuth provider. You implement the provider interface to describe how Shesha should validate a user against your system and how to look up the corresponding Shesha user, then register it so it appears as a login option.

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
