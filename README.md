# Visual Portfolio & Blog

A full-stack application designed as a personal portfolio and blog for a creative professional. It showcases photography and videography, features a blog for sharing insights, and includes a comprehensive rate card for services. The frontend is built with React (Vite) and TypeScript, styled with Tailwind CSS and shadcn/ui. The backend is an Express.js server with a PostgreSQL database managed by Drizzle ORM.

## Key Features

- **Dynamic Portfolio Gallery:** Fetches and displays images and videos from an API, with category filtering and a "load more" feature.
- **Interactive Lightbox:** Full-screen viewer for portfolio items with keyboard navigation.
- **Blog Platform:** A complete blog with posts fetched from the backend.
- **Services Rate Card:** An animated, accordion-style display of services and pricing.
- **Theming:** Light and dark mode support.
- **Animations:** Smooth and engaging UI animations powered by GSAP and Framer Motion.
- **Contact Form:** Integrated with a backend API and Formspree for submissions.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, GSAP, Framer Motion
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Deployment:** Vercel (example)

## Project Structure

-   `server/`: Contains the backend Express.js application code, including route definitions, database logic, and server setup.
-   `client/`: Contains the frontend React application, built with Vite. This includes all components, pages, hooks, and utility functions.
-   `shared/`: Contains code shared between the client and server. Its primary role is to house the Drizzle ORM database schema (`schema.ts`), ensuring type safety and consistency across the full stack.
-   `drizzle.config.ts`: Configuration file for Drizzle Kit, used for database migrations and schema management.
-   `vite.config.ts`: Configuration file for the Vite bundler, used for the frontend development server and build process.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This project uses `npm`. Run the following command to install all the necessary packages for both the server and the client.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project by copying the example: `cp .env.example .env` (if an example file is provided).
    - Add your database connection string to the `.env` file:
      ```env
      DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
      ```
    - The application port can also be configured via the `PORT` environment variable. It defaults to `5000`.

4.  **Set up the database:**
    - This project uses a PostgreSQL database. Ensure you have PostgreSQL installed and running.
    - With your `DATABASE_URL` configured, push the schema to your database using Drizzle Kit:
      ```bash
      npm run db:push
      ```

## Usage

-   **Development:**
    To run the application in development mode with hot reloading for both the client and server, use:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

-   **Build for Production:**
    To build the client and server for production, run:
    ```bash
    npm run build
    ```
    This command will create a `dist` directory with the compiled server code and the static client assets.

-   **Start in Production:**
    To start the production server, use:
    ```bash
    npm start
    ```