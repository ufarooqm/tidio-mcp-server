#!/usr/bin/env node
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Try to load credentials from file, fallback to hardcoded values
let CLIENT_ID, CLIENT_SECRET;
try {
  const credentials = require('./credentials.js');
  CLIENT_ID = credentials.CLIENT_ID;
  CLIENT_SECRET = credentials.CLIENT_SECRET;
} catch (error) {
  // Fallback for users who haven't created credentials.js yet
  CLIENT_ID = 'your_client_id_here';
  CLIENT_SECRET = 'your_client_secret_here';
}
const BASE_URL = 'https://api.tidio.com';

const server = new Server(
  { name: 'tidio-mcp', version: '1.0.0' },
  { 
    capabilities: { 
      tools: {} 
    } 
  }
);

// Helper function for API calls with error handling
async function tidioAPI(endpoint, options = {}) {
  try {
    const response = await axios({
      method: options.method || 'GET',
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'X-Tidio-Openapi-Client-Id': CLIENT_ID,
        'X-Tidio-Openapi-Client-Secret': CLIENT_SECRET,
        'Accept': 'application/json; version=1',
        ...(options.headers || {})
      },
      data: options.body,
      params: options.params
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error ${error.response.status}: ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Tidio API request failed: ${error.message}`);
    }
  }
}

// Add tools for different endpoints
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_contacts',
      description: 'Get Tidio contacts (customers who have interacted with chat). Supports pagination with cursor.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { 
            type: 'number', 
            description: 'Number of contacts to return (max 100)', 
            default: 50 
          },
          cursor: { 
            type: 'string', 
            description: 'Pagination cursor for next page of results' 
          }
        }
      }
    },
    {
      name: 'get_contact_messages',
      description: 'Get conversation messages for a specific contact by contact ID. This shows the full conversation transcript.',
      inputSchema: {
        type: 'object',
        properties: {
          contact_id: { 
            type: 'string', 
            description: 'The contact ID to get messages for',
            required: true
          },
          limit: { 
            type: 'number', 
            description: 'Number of messages to return (max 100)', 
            default: 100 
          }
        },
        required: ['contact_id']
      }
    },
    {
      name: 'get_operators',
      description: 'Get list of Tidio operators/agents who handle customer support',
      inputSchema: { 
        type: 'object', 
        properties: {} 
      }
    },
    {
      name: 'search_contacts',
      description: 'Search contacts by email, name, or other criteria',
      inputSchema: {
        type: 'object',
        properties: {
          email: { 
            type: 'string', 
            description: 'Search by email address' 
          },
          first_name: { 
            type: 'string', 
            description: 'Search by first name' 
          },
          last_name: { 
            type: 'string', 
            description: 'Search by last name' 
          },
          limit: { 
            type: 'number', 
            description: 'Number of results to return', 
            default: 50 
          }
        }
      }
    },
    {
      name: 'get_tickets',
      description: 'Get support tickets from Tidio',
      inputSchema: {
        type: 'object',
        properties: {
          status: { 
            type: 'string', 
            description: 'Filter by ticket status (open, closed, etc.)' 
          },
          limit: { 
            type: 'number', 
            description: 'Number of tickets to return', 
            default: 50 
          }
        }
      }
    },
    {
      name: 'get_ticket_details',
      description: 'Get detailed information about a specific ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { 
            type: 'string', 
            description: 'The ticket ID to get details for',
            required: true
          }
        },
        required: ['ticket_id']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'get_contacts': {
        let endpoint = '/contacts';
        const params = new URLSearchParams();
        
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.cursor) params.append('cursor', args.cursor);
        
        if (params.toString()) {
          endpoint += '?' + params.toString();
        }
        
        const data = await tidioAPI(endpoint);
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      }

      case 'get_contact_messages': {
        if (!args.contact_id) {
          throw new Error('contact_id is required');
        }
        
        let endpoint = `/contacts/${args.contact_id}/messages`;
        if (args.limit) {
          endpoint += `?limit=${args.limit}`;
        }
        
        const data = await tidioAPI(endpoint);
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      }

      case 'get_operators': {
        const data = await tidioAPI('/operators');
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      }

      case 'search_contacts': {
        // For search, we'll get all contacts and filter client-side
        // This is a limitation of the current Tidio API
        const data = await tidioAPI('/contacts?limit=100');
        
        let filteredContacts = data.contacts || [];
        
        if (args.email) {
          filteredContacts = filteredContacts.filter(contact => 
            contact.email && contact.email.toLowerCase().includes(args.email.toLowerCase())
          );
        }
        
        if (args.first_name) {
          filteredContacts = filteredContacts.filter(contact => 
            contact.first_name && contact.first_name.toLowerCase().includes(args.first_name.toLowerCase())
          );
        }
        
        if (args.last_name) {
          filteredContacts = filteredContacts.filter(contact => 
            contact.last_name && contact.last_name.toLowerCase().includes(args.last_name.toLowerCase())
          );
        }
        
        if (args.limit) {
          filteredContacts = filteredContacts.slice(0, args.limit);
        }
        
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              contacts: filteredContacts, 
              total_found: filteredContacts.length 
            }, null, 2) 
          }] 
        };
      }

      case 'get_tickets': {
        let endpoint = '/tickets';
        const params = new URLSearchParams();
        
        if (args.status) params.append('status', args.status);
        if (args.limit) params.append('limit', args.limit.toString());
        
        if (params.toString()) {
          endpoint += '?' + params.toString();
        }
        
        const data = await tidioAPI(endpoint);
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      }

      case 'get_ticket_details': {
        if (!args.ticket_id) {
          throw new Error('ticket_id is required');
        }
        
        const data = await tidioAPI(`/tickets/${args.ticket_id}`);
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return { 
      content: [{ 
        type: 'text', 
        text: `Error: ${error.message}` 
      }] 
    };
  }
});

// Connect server to stdio transport
const transport = new StdioServerTransport();
server.connect(transport);