import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

export const genericAgent = new Agent({
    id: 'generic-agent',
  name: 'Generic Agent',
  instructions: `
    Analyze this podcast episode transcript and create a neutral, generic summary (2-3 sentences) that could come from any AI tool. Focus on main themes and insights without applying any specific game lens.
  `,
  model: 'openai/gpt-5-nano',
  memory: new Memory({
    options: {
      generateTitle: true,
    },
  }),
});
