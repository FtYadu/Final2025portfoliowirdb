/**
 * @fileoverview This file defines the main application component and its router.
 * It sets up the routing for the entire application and wraps it with necessary context providers.
 */
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import Packages from "@/pages/packages";
import NotFound from "@/pages/not-found";

/**
 * Defines the application's routing structure using `wouter`.
 * It maps URL paths to their corresponding page components.
 * @returns {JSX.Element} The router component with all defined routes.
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/packages" component={Packages} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * The main App component that serves as the root of the application.
 * It sets up all the necessary providers for React Query, theming, tooltips, and toasts.
 * @returns {JSX.Element} The fully-wrapped application component.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="yadu-portfolio-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
