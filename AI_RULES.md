# AI Rules for Consumer App Web

This document outlines the technical stack and specific library usage guidelines for the `consumer-app-web` project. These rules are designed to maintain consistency, readability, and best practices across the codebase.

## Tech Stack Overview

The application is built using a modern web development stack, focusing on performance, maintainability, and a rich user experience.

*   **React 19:** The core JavaScript library for building user interfaces.
*   **Vite:** A fast build tool that provides an instant development server and bundles code for production.
*   **React Router DOM:** For declarative client-side routing within the application.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI elements.
*   **TypeScript (for new files):** While existing files are `.jsx`, all new components, hooks, and utility files should be written in TypeScript (`.tsx` or `.ts`) to leverage type safety and improve developer experience.
*   **Lucide React:** A library for easily integrating a wide range of SVG icons.
*   **React Hook Form & Zod:** For efficient form management, validation, and schema definition.
*   **Date-fns & React Day Picker:** For robust date manipulation and interactive date selection components.
*   **Framer Motion & tw-animate-css:** For declarative animations and transitions to enhance user interaction.
*   **Context API:** Used for global state management, such as authentication (`AuthContext`).

## Library Usage Rules

To ensure consistency and leverage the strengths of each library, follow these guidelines:

*   **UI Components:**
    *   Always prioritize `shadcn/ui` components for common UI elements (buttons, inputs, cards, dialogs, etc.).
    *   If a specific `shadcn/ui` component needs significant modification, create a new custom component in `src/components/` that wraps or extends the `shadcn/ui` component, rather than modifying the original `shadcn/ui` file.
*   **Styling:**
    *   Use **Tailwind CSS** classes exclusively for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for global styles (like `src/App.css` or `src/gdf-styles.css`).
    *   Utilize the `cn` utility function from `src/lib/utils.js` for conditionally applying and merging Tailwind classes.
*   **Icons:**
    *   Use icons from the `lucide-react` library.
*   **Forms:**
    *   Implement all forms using `react-hook-form` for state management and `zod` for schema validation.
*   **Routing:**
    *   Manage all application routes within `src/App.jsx` using `react-router-dom`.
*   **Date Handling:**
    *   For date selection, use `react-day-picker`.
    *   For date formatting and manipulation, use `date-fns`.
*   **Animations:**
    *   For complex or interactive animations, use `framer-motion`.
    *   For simple, predefined animations, leverage the classes provided by `tw-animate-css` as seen in `src/gdf-styles.css`.
*   **State Management:**
    *   For application-wide state (e.g., user authentication), use React's Context API. Create new contexts in `src/contexts/`.
*   **File Structure:**
    *   New components should reside in `src/components/`.
    *   New pages should reside in `src/pages/`.
    *   New hooks should reside in `src/hooks/`.
    *   New services should reside in `src/services/`.
    *   New utility functions should reside in `src/lib/` or a new `src/utils/` directory if more appropriate.
*   **Language:**
    *   All new files (components, hooks, utilities, etc.) should be written in **TypeScript** (`.tsx` or `.ts`). Existing `.jsx` files should remain as they are unless a specific refactor to TypeScript is requested.