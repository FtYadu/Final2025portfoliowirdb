/**
 * @fileoverview This file configures the TanStack Query client for the application.
 * It sets up a global QueryClient instance with default options and provides
 * utility functions for making API requests and handling query functions.
 */
import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Checks if a Response object's status is 'ok'. If not, it throws an error
 * with the status code and response text.
 * @param {Response} res - The Response object from a fetch call.
 * @throws {Error} If the response status is not ok.
 * @async
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * A generic utility function for making API requests using fetch.
 * It automatically handles JSON stringification, content type headers,
 * and response status checking.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {string} url - The URL to make the request to.
 * @param {unknown} [data] - The data to be sent in the request body.
 * @returns {Promise<Response>} A promise that resolves to the Response object.
 * @async
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * A factory function that creates a default query function for TanStack Query.
 * It constructs the fetch URL from the query key and handles unauthorized (401) responses.
 * @template T
 * @param {object} options - Configuration options.
 * @param {UnauthorizedBehavior} options.on401 - How to handle a 401 response ('returnNull' or 'throw').
 * @returns {QueryFunction<T>} A query function compatible with TanStack Query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * @description The global instance of QueryClient for the application.
 * It is configured with default options for queries and mutations to ensure
 * consistency across the app (e.g., no retries, infinite stale time).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
