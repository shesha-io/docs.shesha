---
sidebar_label: The Basics
title: Tutorial - The Basics
---

import Banner from '@site/src/components/docs/Banner';

# The Basics

This tutorial walks you through building your first Shesha application from scratch. By the end you will have configured a working CRUD application with a custom domain model, a child table, and a custom API.

The tutorial assumes you already have the starter project running locally. If you do not, follow [Setting Up](../../setting-up.md) (Windows) or [Mac OS / Linux Setup](../../shesha-mac-setup-getting-started.md) first.

---

## What You Will Learn

The tutorial is split into four sections, each building on the previous one:

| Step | Section | What you build |
|---|---|---|
| `1` | [Configuring Your First View](./configuring-first-view.md) | Table view, create form, and details view for managing people. |
| `2` | [Extending the Domain Model](./extending-model.md) | New `Member` entity, reference list, and migration to extend the Person table. |
| `3` | [Adding New Entities and Child Tables](./new-entities.md) | New `MembershipPayment` entity wired to the member's details view as a child table. |
| `4` | [Custom APIs](./custom-api.md) | Custom app service that enforces business rules before activating a membership. |

---

## Prerequisites

To follow the tutorial comfortably you should have some experience with ASP.NET Core and React. You also need the following tools installed.

### Frontend

| Tool | Version | Notes |
|---|---|---|
| `Visual Studio Code` | latest | Free, lightweight code editor. [Download](https://code.visualstudio.com/Download). |
| `Node.js` | 20.11.1 | If you have a different version installed, use [nvm](https://github.com/nvm-sh/nvm) to switch between versions without conflicts. |
| `npm` | 10.2.4 | Comes with Node.js. |
| `Next.js` | 14.1.0 | Installed automatically via `npm install`. |

### Backend

| Tool | Version | Notes |
|---|---|---|
| `Visual Studio` | 2022 | Community edition is fine. [Download](https://visualstudio.microsoft.com/). |
| `.NET` | 8.0 | The framework runs on .NET 8. |

### Database

| Tool | Notes |
|---|---|
| `SQL Server Management Studio` | Used to restore the starter `.bacpac` and inspect tables. [Download](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16). |

:::tip Mac OS or Linux users
Visual Studio is not supported on Mac OS or Linux. Follow the [Mac OS / Linux Setup](../../shesha-mac-setup-getting-started.md) which uses VS Code, the .NET CLI, and Docker-hosted SQL Server instead.
:::

---

## Ready to Start?

Head to [Configuring Your First View](./configuring-first-view.md) to start building.
