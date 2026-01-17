
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
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
const postgresStorage = new PostgresStore({
  id: 'mastra-storage',
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
} as any);

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { 
    weatherAgent, 
    gameAnalyzerAgent,
    genericAgent,
    audienceSimulatorAgent
  },

  storage: postgresStorage,
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
