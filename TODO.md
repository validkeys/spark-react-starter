## Documentation (In Progress)

We will update this readme to reflect our latest structural patterns

### Folder Structure

#### Assets

- Public Assets

#### Components

- Shared Util / UI Components

#### Mocks

- Mock Server Worker Setup

#### Router

- Exports the router definition file
- Router = React Router
- Uses route level lazy loading for code splitting

#### Routes

- Folder structure to map to URL hierarchy
- Each route contained in a folder with at least an index.tsx file
- index.tsx file need to have a named export of "Component"

#### State

- Storage for items related to state management
- Queries: Singular place to define queries
- Hooks: Singular place to define state hooks

### Patterns

#### Contract

- Attempt to write all code for a component within the component without pre-maturely abstracting
- If code is reused / will become reused, consider abstraction
- If code is verbose and unrelated to the operation of the component itself, consider abstraction

... [TODO]

## TODOs

Items to flush out:

- [ ] Folder Structure
- [ ] State, Queries and Data Management
- [ ] Ui / Shared Components
- [ ] Components only use in specific routes
- [ ] Testing
