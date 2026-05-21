---
sidebar_label: What is Shesha
sidebar_position: 1
title: What is Shesha
---

import Banner from '@site/src/components/docs/Banner';
import Card from '@site/src/components/docs/Card';

# What is Shesha

Shesha is a Low Code Application Framework designed to significantly reduce the effort needed for typical business application implementation by over 80%. By leveraging frameworks like ASP.NET Core, Abp.io, React, and Next.js, it adds low-code capabilities to speed up the development of business applications. It is ideal for those familiar with ASP.NET Core and React who dislike mundane tasks, so you can skip the repetitive parts of building line-of-business systems: CRUD screens, lookup tables, role-based menus, audit history, and so on.

Shesha caters to both developers and less technical users. It serves as a rapid application delivery platform, allowing agile enterprises to swiftly build, model, and deploy multi-experience apps - all while keeping the full power of ASP.NET Core and React underneath, so anything Shesha cannot do out of the box can still be built with normal code.

<Banner url="https://www.youtube.com/embed/JGy7lc5WAwE?autoplay=1&controls=0" type={1}/>

---

## Why Choose Shesha

Shesha takes the work that usually slows down a business application - hooking a form to a database, generating an API, wiring up authentication - and turns it into configuration. You can build straightforward CRUD screens or multi-step workflows by combining the same four ingredients:

| Step | What it means |
|---|---|
| `1. Connect Datasource` | Define your domain model (or extend the base model that already includes common entities like Person, Organisation, and Address). Shesha automatically generates CRUD APIs and GraphQL endpoints, and applies authentication and authorisation through configuration. |
| `2. Build UI` | Use built-in or custom React components to lay out your screens in the form designer. |
| `3. Write Logic` | Express business rules using JavaScript snippets and queries inside the designer. |
| `4. Collaborate, Deploy, Share` | Configuration changes are version-controlled with Git, so teams can use branches, pull requests, and rollback the same way they do with code. |

:::info Built on technologies you already know
The backend is ASP.NET Core with Abp.io. The frontend is React with Next.js. If your team can read these stacks, they can extend Shesha by writing plain C# or TypeScript when needed.
:::

---

## Get Started

1. Download the <a href="https://www.shesha.io/download-shesha">Shesha Starter template</a>. The download includes three fully customisable pieces:

| Piece | What it is |
|---|---|
| `Adminportal (Frontend)` | A React.js solution that hosts the configured forms, designer, and admin pages. |
| `Backend` | An ASP.NET Core solution that exposes the APIs, applies migrations, and runs the business logic. |
| `Database` | A seeded SQL Server database (delivered as a `.bacpac` file) with sample data so the starter runs end-to-end on first launch. |

2. Take the quick tutorial below to walk through configuring your first view, extending the domain model, adding a child table, and calling a custom API.

<Card title='Build your first app' url='/docs/get-started/tutorial/the-basics' description='A quickstart guide to help you build an app using Shesha'/>
