---
sidebar_label: Integration Testing
sidebar_position: 10
title: Integration Testing
---

# Integration Testing

An integration test runs your application service against a real database rather than a mock, so it exercises the same NHibernate mappings, migrations, and transaction behaviour your application uses in production. Shesha ships the infrastructure for this as a NuGet package, `Shesha.Testing`, so you add a reference rather than hand-rolling test setup in every solution.

---

## What the Package Gives You

`Shesha.Testing` provides the base classes, xUnit fixtures, and helpers needed to write NHibernate-backed integration tests against ABP modules.

| Component | What it does |
|---|---|
| `ShaIntegratedTestBase<TStartupModule>` | The ABP test base. Gives you the IoC container, unit-of-work helpers, and `Resolve<T>()` |
| `SheshaNhTestBase<TStartupModule>` | Builds on the above with NHibernate session helpers and login helpers |
| `SheshaTestModuleHelper.ConfigureForTesting()` | An extension method that applies the common test module configuration, so your test module stays short |
| `UnitTestHelper` | Mock helpers for `IWebHostEnvironment`, the API explorer, and registering fake services |

---

## Choosing a Database Fixture

A fixture decides where the test database comes from. Pick the one that matches how the tests will be run.

| Fixture | Where the database runs | When to use it |
|---|---|---|
| `LocalSqlServerFixture` | A SQL Server instance already on your machine | Fastest local loop, when you already run SQL Server locally |
| `SqlServerFixture` | SQL Server in a container, started by Testcontainers | CI, and local runs where you would rather not depend on a local install |
| `PostgreSqlFixture` | PostgreSQL in a container, started by Testcontainers | Confirming your application works on PostgreSQL |

Each fixture has a matching xUnit collection (`LocalSqlServerCollection`, `SqlServerCollection`, `PostgreSqlCollection`) so the database is created once and shared across the tests in that collection, rather than being rebuilt per test class.

:::warning Testcontainers needs Docker
`SqlServerFixture` and `PostgreSqlFixture` start a database in a container, so the Docker daemon has to be running before the tests do. Without it, the tests fail at start-up rather than reporting an assertion failure.
:::

---

## Adding It to a Project

Add a reference to the `Shesha.Testing` package from your test project, then derive your test classes from `SheshaNhTestBase<TStartupModule>`, passing your own test module as the startup module.

Because the base class resolves services from the same IoC container the application uses, a test can resolve an application service and call it exactly as the API would.

:::tip Test the service, not the endpoint
Resolving the application service directly gives you the same business logic the API runs, without the HTTP layer in the way. That keeps the test focused on behaviour and makes failures much easier to read.
:::

---

## See Also

- [Domain Services](./domain-services.md) - the services these tests usually target.
- [CRUD APIs](./crud-apis.md) - the dynamically generated endpoints backed by the same services.
