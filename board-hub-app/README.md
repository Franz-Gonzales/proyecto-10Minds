# Board Hub - Games Management App

Board Hub is a modern Angular-based web application designed for managing board game libraries. It allows users to track their games, manage client records, organize games into categories, and handle loan operations with ease.

## Features

- **Games Management**: Browse, filter, and manage your board game collection.
- **Client Records**: Maintain a database of clients who borrow games.
- **Loan Tracking**: Sophisticated loan management with filters for games, clients, and date ranges.
- **Categories**: Organize your games collection by categories (e.g., Strategy, Party, Family).
- **Modern UI**: A clean, responsive interface built with Tailwind CSS, DaisyUI, and Angular Material.
- **GraphQL Integration**: Robust data fetching and state management using Apollo GraphQL.

## Tech Stack

- **Framework**: [Angular](https://angular.dev/) (Standalone components & Signals)
- **State & Data**: [Apollo GraphQL](https://www.apollographql.com/docs/angular/)
- **UI Frameworks**: [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), and [Angular Material](https://material.angular.io/)
- **Icons**: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)
- **Notifications**: [ngx-sonner](https://github.com/tutkli/ngx-sonner)
- **Utilities**: [date-fns](https://date-fns.org/)
- **Testing**: [Vitest](https://vitest.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Angular CLI](https://angular.dev/tools/cli)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd board-hub-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run start
    ```
    or
    ```bash
    ng serve
    ```

2.  **Access the app:**
    Open your browser and navigate to `http://localhost:4200`.

*Note: This application expects a GraphQL API running at `http://localhost:3000/graphql` by default (configurable in `src/environments/environment.ts`).*

## 🏗️ Project Structure

```text
src/app/
├── core/           # Core services, GraphQL config, and interceptors
├── features/       # Feature-based modules (games, clients, loans, categories)
│   ├── components/ # Feature-specific components
│   ├── graphql/    # GQL queries and mutations
│   ├── models/     # TypeScript interfaces and models
│   ├── pages/      # Feature page components
│   └── services/   # Feature-specific business logic
├── layout/         # Main application layout components
├── shared/         # Reusable UI components (buttons, dialogs, pipes)
└── app.routes.ts   # Main routing configuration
```

## Testing

To run the unit tests:
```bash
npm run test
```

## Scripts

- `npm run start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run test`: Executes unit tests via Vitest.
- `npm run watch`: Builds the app and watches for changes.
