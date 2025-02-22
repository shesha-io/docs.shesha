---
sidebar_label: Json Entities to Form
title: Json Entities to Form
---

Forms can now automatically bind to JSON properties without additional code, preserving the Low-Code development experience.

### Configuring the Backend

We are using a Entity class that has a `JsonEntity` property. In the example, we use only two properties `TestProp` - as a text name and `JsonProp` - as storage of any `JsonEntity` objects.

```cs
    [Table("SheshFunctionalTests_TestClasses")]
    [Entity(TypeShortAlias = "Boxfusion.SheshFunctionalTests.Domain.TestClass")]
    public class TestClass : Entity<Guid>
    {
        public virtual string TestProp { get; set; }

        public virtual JsonEntity JsonProp { get; set; }
    }
```

We're going to use several classes created from `JsonEntity`

```cs
    public class JsonHouse : JsonEntity
    {
        public Address Address { get; set; }

        public string Name { get; set; }

        public Person Person { get; set; }
    }
```

```cs
    public class JsonCar
    {
        public virtual string Make { get; set; }

        public virtual string  Model { get; set; }

        public virtual string VinNumber { get; set; }

        public virtual IList<JsonWheel> Wheels { get; set; }
    }
```

```cs
    public class JsonWheel : JsonEntity
    {
        public virtual string Type { get; set; }

        public virtual long Size { get; set; }

        [SaveAsJson]
        public virtual IList<JsonSpoke> Spoke { get; set; }
    }
```

```cs
    public class JsonSpoke
    {
        public virtual double Length { get; set; } 
        public virtual string Material { get; set; } 
        public virtual double Thickness { get; set; }
    }
```

```cs
    public class TestJsonEntity : JsonEntity
    {
        public virtual Organisation SomeOrganisaion { get; set; }

        public virtual string SomeName { get; set; }
    }
```