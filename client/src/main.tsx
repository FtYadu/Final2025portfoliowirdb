/**
 * @fileoverview This is the entry point of the React application.
 * It renders the root `App` component into the DOM.
 */
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create the root of the React application and render the App component.
createRoot(document.getElementById("root")!).render(<App />);
