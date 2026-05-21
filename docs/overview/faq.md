---
sidebar_label: FAQ
sidebar_position: 2
title: Frequently Asked Questions
---

# Frequently Asked Questions

This page answers the questions new users most often ask before adopting Shesha. 

---

## What kind of apps can I build on Shesha?

Shesha is designed for line-of-business applications - the kind of systems most internal teams need to run their operations. Typical examples include:

| Category | Examples |
|---|---|
| `CRM and case management` | Customer Relationship Management systems, Service Management, Case Management, complaints handling. |
| `HR and people processes` | Leave Management, performance reviews, onboarding, training records. |
| `Operational systems` | Supply Chain, asset tracking, inventory, scheduling. |
| `Admin and back-office tools` | Custom admin panels, dashboards, internal CRUD screens, approval workflows. |
| `Replacements for ad-hoc tools` | A clean UI on top of manually triggered scripts, deployment pipelines, or basic database CRUD. |

There are few limitations, allowing you to bring almost any idea to life, and the platform is optimised to make building internal tools a hassle-free experience where you control the schema, the users, and the deployment.

---

## How is Shesha different from other low-code or no-code tools?

Shesha stands out by being open source, enabling developers to easily adopt, extend, and use the platform without concerns about vendor lock-in. You have the flexibility to self-host and configure Shesha on your local machine or a hosting platform, giving you complete control over your data privacy, security, and integrity.

It is also built on ASP.NET Core and React - two of the world's most popular back-end and web front-end frameworks - and integrates with Git for seamless collaboration. If you are familiar with these technologies, Shesha provides a natural fit:

| Layer | Technology |
|---|---|
| `Backend` | ASP.NET Core (with Abp.io) |
| `Frontend` | React with Next.js |
| `Source control` | Plain Git |

While offering valuable drag-and-drop capabilities for rapid implementation, Shesha also allows you to revert to traditional custom coding approaches to ensure you are never restricted. When the designer cannot do what you need, you drop into ordinary C# or TypeScript code - no proprietary scripting language, no hidden runtime.

---

## Do I need to be a developer to use Shesha?

You will get the most out of Shesha if at least one person on your team can read and write basic ASP.NET Core and React. Less technical users can configure forms, tables, menus, and JavaScript snippets in the designer, but extending the domain model, writing custom APIs, and deploying the application require a developer.

---

## Is Shesha free to use?

Yes (for now). Shesha is open source under the GPLv3 license. You can download it, run it, modify it, and deploy it without paying for a license.

---

## What does the starter project include?

The Shesha Starter Template downloads as a single zip containing three runnable projects:

| Piece | What it is |
|---|---|
| `Adminportal` | A React.js (Next.js) frontend that hosts the designer, configured forms, and admin pages. |
| `Backend` | An ASP.NET Core solution with the API host, application layer, and domain layer pre-wired. |
| `Database` | A `.bacpac` file that restores into SQL Server with sample seed data so the app runs end-to-end on first launch. |

See [Setting Up](../get-started/setting-up.md) for the Windows install path, or [Mac OS / Linux Setup](../get-started/shesha-mac-setup-getting-started.md) for the Mac and Linux path.

---

## Which databases does Shesha support?

Shesha supports both Microsoft SQL Server and PostgreSQL. The starter template ships with a SQL Server `.bacpac` file, but the framework includes migration scripts and configuration for PostgreSQL as well.

---

## Can I version-control my configuration changes?

Yes. All form configurations, reference lists, permissions, and other configuration items are stored in the database but can be exported and imported as part of the standard configuration import/export workflow. Most teams version the exported configuration alongside their code so a single Git commit captures both code and configuration changes.

---

## What if I need a feature the designer cannot configure?

Drop into code. Because the frontend is plain React and the backend is plain ASP.NET Core, you can:

- Add custom React components and register them in the toolbox so they appear in the designer.
- Add custom application services that expose new endpoints alongside the auto-generated CRUD APIs.
- Override or extend any part of the framework using standard .NET dependency injection.

:::tip You are never locked in
The drag-and-drop designer is an accelerator, not a cage. Anything you can do in regular ASP.NET Core or React, you can do in a Shesha project.
:::

---

## How does Shesha handle authentication and authorisation?

Out of the box, Shesha ships with token-based authentication, role-based authorisation, and a permissions system that controls access to forms, endpoints, and UI elements. You can extend it with additional identity providers (such as Azure AD or any OpenID Connect provider) when needed.

See [Access Control](../fundamentals/security/access-control.md) for a deeper explanation.

---

## Where can I get help?

| Channel | What it is for |
|---|---|
| `Documentation` | This site - covers concepts, components, APIs, and how-to guides. |
| `GitHub Issues` | Bug reports and feature requests for the open source framework. |
| `Community channel (Discord)` | Ask questions, share what you are building, and chat with the Shesha team and community in real time. [Join the Discord](https://discord.com/invite/KBV4ZBwRbr). |

:::info Documentation is the fastest first stop
Almost every "how do I..." question is covered in the [Front-End Basics](../front-end-basics/) or [Back-End Basics](../back-end-basics/) sections. You can use the search bar at the top of the docs site to search specific concepts.
:::
