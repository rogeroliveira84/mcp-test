import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'mcp-test',
  version: '1.0.0',
  capabilities: {
    prompts: {},
    resources: {},
    tools: {},
  }
});

// Add an addition tool
server.tool(
  'add',
  {
    parameters: {
      a: z.number(),
      b: z.number()
    },
  },
  async ({ a, b }) => {    
    return {
      content: [
        {
          type: 'text',
          text: String(a + b),
        },
      ],
    };
  },
);

// Add a dynamic greeting resource
server.resource(
  'greeting',
  new ResourceTemplate('greeting://{name}', { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};
main().catch(error => {
  console.error('Error starting MCP server:', error);
  process.exit(1);
});
