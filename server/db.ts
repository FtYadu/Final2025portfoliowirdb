/**
 * @fileoverview This file sets up the database connection using Neon's serverless driver
 * and Drizzle ORM. It reads the database connection string from the environment variables,
 * configures the WebSocket constructor for the Neon driver, and exports the database
 * connection pool and the Drizzle instance.
 */
import dotenv from "dotenv";
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure the WebSocket constructor for the Neon serverless driver.
neonConfig.webSocketConstructor = ws;

// Ensure the DATABASE_URL environment variable is set.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

/**
 * The database connection pool.
 * @type {Pool}
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * The Drizzle ORM instance, configured with the Neon serverless client and the application schema.
 * @type {drizzle}
 */
export const db = drizzle({ client: pool, schema });