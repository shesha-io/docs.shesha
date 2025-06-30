## application.settings

The **application.settings** object allows to read and write values of application settings. Shesha uses modules to group different settings. Every application has a default module called `Shesha` that contains all the basic and essential settings.

> Shesha Settings: `application.settings.shesha`  
> ![shesha-settings](./images/shesha-settings.png)  

> You can use the `getValueAsync` and `setValueAsync` functions to read and write the values of the settings.

## `application.settings.email`  

This object contains the following settings accesssors that can be used to read and write email settings:  

```typescript
{
  emailSettings: {
    getValueAsync,
    setValueAsync
  },
  smtpSettings: {
    getValueAsync,
    setValueAsync
  }
}
```  

## `application.settings.frontend`  

This object contains the following settings accesssors that can be used to read and write frontend settings:  

```typescript
{
  theme: {
    getValueAsync,
    setValueAsync
  },
  mainMenu: {
    getValueAsync,
    setValueAsync
  },
  defaultUrl: {
    getValueAsync,
    setValueAsync
  },
  publicUrl: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.otp`  

This object contains the following settings accesssors that can be used to read and write OTP settings:  

```typescript
{
  oneTimePins: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.notification`  

This object contains the following settings accesssors that can be used to read and write notification settings:

```typescript
{
  notificationSettings: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.security.passwordComplexity`  

This object contains the following settings accesssors that can be used to read and write password complexity settings:

```typescript
{
  requireDigit: {
    getValueAsync,
    setValueAsync
  },
  requireLowercase: {
    getValueAsync,
    setValueAsync
  },
  requireNonAlphanumeric: {
    getValueAsync,
    setValueAsync
  },
  requireUppercase: {
    getValueAsync,
    setValueAsync
  },
  requiredLength: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.security`  

This object contains the following settings accesssors that can be used to read and write security settings:

```typescript
{
  userLockOutEnabled: {
    getValueAsync,
    setValueAsync
  },
  maxFailedAccessAttemptsBeforeLockout: {
    getValueAsync,
    setValueAsync
  },
  defaultAccountLockoutSeconds: {
    getValueAsync,
    setValueAsync
  },
  securitySettings: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.shesha`  

This objects contains addional settings accesssors that can be used to read and write additional settings:

```typescript
{
  uploadFolder: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.sms` 

This object contains the following settings accesssors that can be used to read and write SMS settings:

```typescript
{
  smsSettings: {
    getValueAsync,
    setValueAsync
  }
}
```

## `application.settings.shesha.userManagement`  

This object contains the following settings accesssors that can be used to read and write user management settings:

```typescript
{
  userManagementSettings: {
    getValueAsync,
    setValueAsync
  }
}
```
