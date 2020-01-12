# Frontend

## Naming convention

**Suffix GraphQL data interfaces with `Data`**

Given the situation where you have Appointment data from the database and an Appointment component to render that data, we need a way to differentiate the two. Since the frontend is a React app where components are first-class citizens, they get to keep their regular name. Any TypeScript interfaces for GraphQL data that is representing a database entity must therefore be suffixed with `Data`.

Note: This goes against [the standard TypeScript guidelines](https://stackoverflow.com/a/41967120/684353).

**Prefix Styled Components with `Styled`**

This fixes the problem of naming things where you have a Navigation component providing functionality and you want to turn it into a styled component for local usage.

Related:

- https://medium.com/inturn-eng/naming-styled-components-d7097950a245
