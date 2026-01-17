
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';

import { gameAnalyzerAgent } from './agents/game-analyzer-agent';
import { genericAgent } from './agents/generic-agent';
import { audienceSimulatorAgent } from './agents/audience-simulator-agent';
import { PostgresStore } from '@mastra/pg';
import {
  Observability,
  DefaultExporter,
  CloudExporter,
  SensitiveDataFilter,
} from '@mastra/observability';

// Shared PostgreSQL storage for all agents
// Only initialize PostgresStore if connection string is available
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

let postgresStorage: PostgresStore | undefined;
if (connectionString) {
  try {
    postgresStorage = new PostgresStore({
      id: 'mastra-storage',
      connectionString,
    } as any);
  } catch (error) {
    console.error('Failed to initialize PostgresStore:', error);
    // Continue without storage - agents will still work, just without persistence
  }
}

export const mastra = new Mastra({
  workflows: {},
  agents: { 
    gameAnalyzerAgent,
    genericAgent,
    audienceSimulatorAgent
  },

  storage: postgresStorage, // undefined if connection string missing, Mastra will handle gracefully
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'carousel-gen',
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
          new CloudExporter(), // Sends traces to Mastra Cloud (if MASTRA_CLOUD_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
