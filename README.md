# GOG.com Storefront - Recruitment Task

This project is a high-fidelity implementation of a GOG.com-style storefront page, developed as a recruitment task. It showcases a modern, scalable, and well-tested approach to building applications with the latest version of Angular.

The application faithfully recreates the provided Figma design, focusing on clean architecture, component-based structure, and reactive state management.

---

## Key Features

- **Dynamic Product Grid:** Displays a list of products fetched from a mock service.
- **Interactive Product Cards:** Products can be in different states: available for purchase, already owned, or in the cart.
- **Reactive Shopping Cart:**
  - A cart icon in the header dynamically displays the number of items.
  - A hover-activated dropdown shows a detailed summary of the cart.
  - Functionality to remove individual items or clear the entire cart.
- **State Management:** The cart state is managed centrally and reactively, ensuring the UI is always in sync.
- **Dynamic Discounts:** Promotion badges (e.g., "-50%") are calculated dynamically based on product prices, not hardcoded.
- **Responsive Design:** A basic responsive layout has been implemented to ensure usability on smaller screens, as an enhancement to the original requirements.

---

## Tech Stack

- **Framework:** Angular v18+ (utilizing Standalone Components and new `@` Control Flow syntax)
- **State Management:** Angular Signals for simple, efficient, and fine-grained reactivity.
- **Styling:** SCSS with CSS Variables for a maintainable and consistent design system.
- **Language:** TypeScript
- **Testing:** Jasmine & Karma for unit tests.
- **Build Tool:** Angular CLI

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed:

- **Node.js:** `v20.x` (Project was tested with `v20.19.4`)
- **Angular CLI:** `v20.x` (Project was tested with `v20.3.5`)

You can check your versions using `node -v` and `ng --version`.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    ng serve
    ```
    The application will automatically open in your default browser at `http://localhost:4200/`. The app will also automatically reload if you change any of the source files.

---

## Running Tests

Unit tests are set up using Jasmine and Karma. To run them, execute the following command in the project root:

```bash
ng test
```

This command will launch the Karma test runner, execute all unit tests, and provide a summary in the console.

---

## Architectural Decisions

A few key decisions were made to ensure the application is scalable, maintainable, and follows modern best practices.

1.  **State Management (Angular Signals vs. NgRx):**
    For the scale of this application, a full-fledged state management library like NgRx would be over-engineering. We chose **Angular Signals** to manage the cart's state. It provides a simple, high-performance, and built-in solution for reactive state, perfectly suited for this use case.

2.  **Smart vs. Presentational Components:**
    The application is structured using the "Smart/Presentational" component pattern.
    - **Smart Components** (e.g., `product-list`) are responsible for fetching data and managing state.
    - **Presentational Components** (e.g., `product-card`) are "dumb" components that receive data via `@Input()` and emit events via `@Output()`, making them highly reusable and easy to test.

3.  **Data Flow (DTO vs. Domain Model):**
    To decouple the frontend from the backend's data structure, we introduced a two-step data model:
    - A **Data Transfer Object (DTO)** (`product.dto.ts`) mirrors the raw data from the API (including prices in cents).
    - A **Domain Model** (`product.model.ts`) represents the data in a clean, UI-friendly format.
    A **mapper function** in the `ProductsService` is responsible for the transformation, handling logic like price conversion (`/ 100`) and discount calculation. This keeps our components clean and free of business logic.

---

## Notes & Considerations

- **Assets Quality:** The image assets used in this project were extracted directly from the provided Figma file and may be of lower quality or imperfectly cropped. In a production environment, high-resolution, optimized assets provided by a design team would be used.