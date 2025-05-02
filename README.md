# Project Matrix (Replace with your actual Project Name)

This project is a web application featuring interactive dashboards, data visualization with a distinctive matrix-inspired theme, user authentication, subscription management via Stripe, and a blog section.

## Features

- **Dashboards:** Configurable dashboards displaying various data charts.
- **Charts:** Multiple chart types (Line, Bar, Pie, Gauge, Table) powered by Highcharts, styled with a custom matrix theme.
- **Real-time Updates:** WebSocket integration for live data updates on charts (optional).
- **Authentication:** User login and registration (implementation details assumed).
- **Subscription:** Stripe integration for handling monthly, semi-annual, and yearly subscription plans (Basic, Pro, Enterprise).
- **Blog:** Section for displaying and managing blog posts with Markdown support.
- **Matrix Theme:** Unique visual theme inspired by "The Matrix" across the UI and charts.

## Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 with JIT, PostCSS, CSS Modules (as needed)
- **State Management:** Redux Toolkit (for matrix theme state, potentially more)
- **Data Fetching/Caching:** React Query (TanStack Query v5)
- **Charting:** Highcharts, highcharts-react-official
- **Routing:** React Router v6
- **API Client:** Axios
- **Real-time:** WebSockets
- **Linting:** ESLint
- **Formatting:** Prettier
- **Testing:** Jest, React Testing Library

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    - Create a `.env` file in the project root.
    - Copy the contents of `.env.example` (if you create one) or add the required variables. See the `env.d.ts` file for required variables like:
      - `VITE_API_URL`: URL for your primary API.
      - `VITE_BACKEND_URL`: Base URL for the backend (used by Axios).
      - `VITE_WEBSOCKET_URL`: URL for WebSocket connections (if applicable).
      - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key.
      - `VITE_STRIPE_..._PRICE_ID`: Various Stripe Price IDs for different plans and billing cycles.
      - `VITE_USE_MOCK_DATA`: Set to `true` to use mock data for charts, `false` to fetch real data.
    - **Example `.env` structure:**
      ```env
      VITE_BACKEND_URL=http://localhost:8080
      VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
      VITE_STRIPE_BASIC_MONTHLY_PRICE_ID=price_...
      # ... other variables
      VITE_USE_MOCK_DATA=true
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if specified).

## Available Scripts

- `npm run dev`: Starts the development server with hot module replacement.
- `npm run build`: Builds the application for production.
- `npm run preview`: Serves the production build locally for previewing.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the code using Prettier.
- `npm run check-format`: Checks if the code is formatted correctly according to Prettier rules.
- `npm run test`: Runs the test suite using Jest.
