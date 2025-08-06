---
sidebar_position: 4
---

# Setting Up Your Mac OS Machine to Run Shesha Applications Locally

## Tools We Need

* **Git** - Accessing code from both git-based version control systems will require the use of git
* **Docker** - We will run the Microsoft SQL Server as a containerized application
* **.NET 8** - The backend is a .NET application as such will need the .NET SDK and runtime, we use .Net 8 because SQL-Package will require .Net 8 runtime.
* **Node.js 22** - The Shesha frontend is a Node.js application as such will need the Node.js runtime environment
* **SQL-Package** - Once we have SQL Server running, we will need to import the starter database from a `.bacpac` file
* **Visual Studio Code** / any of the new AI-infused forks of VSCode - Any IDE would probably do but we stick to VSCode for familiarity. This is where you will be writing all your full stack code. (Visual Studio is no longer supporting Mac OS)
* **Azure Data Studio** - You will use this to connect to your SQL Server and see your databases and tables etc.

## Setting Up

### 1. Download & Install Docker

Use this link and pick the macOS one: https://www.docker.com

* Once you have installed Docker, you can start making `docker ...` commands on the terminal to create images, pull images, instantiate containers from images, kill containers etc.
* You can dive deeper about the process here: https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver17\&tabs=cli\&pivots=cs1-bash
* We shall summarize the process here:

#### Pull SQL Server Image

```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest
```

#### Run the Container

Once the image has been fully downloaded and saved on the local docker engine, we are now ready to use it to create a container, the running Microsoft SQL Server application inside of the local docker engine, and this is how:

```bash
docker run -d -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=@123Shesha" \
-p 1433:1433 --name SQL_Server_Docker \
mcr.microsoft.com/mssql/server:2022-latest
```

After this, you should have a running containerized SQL Server application with the following credentials:

> **User ID:** `sa`\
> **Password:** `@123Shesha`

Make sure to enable host netowrking on your docker engine to make sure that machine network calls can access the docker container network thus:

![enable host networking](./enable-host-networking.png)

### 2. Importing the Starter Database into SQL Server

On Windows we would just open Microsoft SQL Server Management Studio, and right click on Databases and select Import Data-tier application and follow the wizard steps, but we are working on Mac OS, so we cannot use the management studio thus we cannot use the import wizard.

We are going to have to use [SQL-Package](https://learn.microsoft.com/en-us/sql/tools/sqlpackage/sqlpackage?view=sql-server-ver17). By this point you should have .NET SDK installed, if not download the Arm64 version here: https://dotnet.microsoft.com/en-us/download/dotnet/8.0.

You can dive deeper on the process here: https://learn.microsoft.com/en-us/sql/tools/sqlpackage/sqlpackage-download?view=sql-server-ver17

#### Install SQL-Package

The installation is cross-platform and will allow us to access it from the terminal:

```bash
dotnet tool install -g microsoft.sqlpackage
```

Follow the terminal's instructions immediately after to globally expose the sqlpackage tool

> **Note:** Close the terminal and open it again after installation.

#### Creating the Shesha-Starter project

1. Download the [Shesha Starter template](https://www.shesha.io/download-shesha?_gl=1*1brs2vj*_ga*NTYwNjU0MjAxLjE3NTQ0NzMwMDE.*_ga_NKYL5VXNHY*czE3NTQ0NzMwMDAkbzEkZzEkdDE3NTQ0NzMyNjEkajMxJGwwJGgw), which provides fully customizable artifacts:

   * Adminportal (Frontend): A React.js solution for the frontend.
   * Backend: An ASP.Net Core Solution fot the backend.
   * Database: A seeded SQL database with sample data.

Once you have unzipped your Shesha fullstack project, we can now begin.

Going forward, make sure to to substitue terms like `ProjectName` and `OrganisationName` to the appropriate names that you set when you generated the starter project.

#### Importing the Database

**Location:** ~/Downloads/\<OrganisationName.ProjectName>

In the project directory above you will see a .bacpac file bearing the name of the project as you generated it on the Shesha starter webpage -- ProjectName.bacpac

Go into your user root directory as such:

```bash
cd into ~ your user root directory
```

Import the data-tier application (the starter database):

```bash
sqlpackage /Action:Import /SourceFile:"./Downloads/<OrganisationName.ProjectName>/<ProjectName>.bacpac" /TargetConnectionString:"Server=localhost,1433;Initial Catalog=ProjectName;Persist Security Info=False;User ID=sa;Password=@123Shesha;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"
```

After this command, on your Azure Data Studio, you should see a new database by the name `ProjectName`.

***

With both Node.js 22 and .NET 8 installed, and we know that SQL Server is running, we can now go ahead to pull and run backend and frontend projects.

### 5. Running the Backend

* Open `backend` project on your code editor
* You need to edit a few files in order for the application to restore, build and run successfully.

#### Required File Changes

##### 1. Update Connection String

This file `/src/OrganisationName.ProjectName.Web.Host/appsettings.json` must be edited to use a different connection string:

```json
{
    "ConnectionStrings": {
        "Default": "Server=localhost,1433;Initial Catalog=ProjectName;Persist Security Info=False;User ID=sa;Password=@123Shesha;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"
    },
    ...
}
```

#### Build and Run

With all these file changes in place, you can now run shesha-core on your Mac OS machine.

**Working Directory Structure:**

```
backend
├── src
├── nupkg
├── .nuget
├── test
└── ...
```

##### Build

```bash
dotnet build
```

##### Run

```bash
dotnet run --project src/OrganisationName.ProjectName.Web.Host --urls "http://localhost:21021;https://localhost:44362"
```

> **Note:** If you do not have a local certificate for SSL, you will need to install the default development certificate and trust it:
>
> ```bash
> dotnet dev-certs https --trust
> ```

### 6. Running the Frontend

* Go into the `adminportal` directory and install then run:

```bash
cd adminportal
npm i
npm run dev
```
