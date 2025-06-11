# Tidio MCP Server for Claude Desktop

A Model Context Protocol (MCP) server that connects Claude Desktop to Tidio's API, allowing you to access chat conversation data, customer support tickets, and operator information directly from Claude.

## 🚀 Quick Start for Colleagues

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Claude Desktop** - [Download here](https://claude.ai/download)
- **Tidio Account** with API access (Plus or Premium plan required)

### Step 1: Get Your Tidio API Credentials

1. Log into your Tidio dashboard
2. Go to **Settings** → **Developer** → **OpenAPI**
3. Copy your:
   - **Client ID** (starts with `ci_`)
   - **Client Secret** (starts with `cs_`)

### Step 2: Install the MCP Server

```bash
# Clone this repository
git clone https://github.com/ufarooqm/tidio-mcp-server.git
cd tidio-mcp-server

# Install dependencies
npm install

# Test the server works
npm test
```

### Step 3: Configure Your Credentials

Edit the `tidio-mcp.js` file and replace the credentials:

```javascript
// Replace these with your actual Tidio credentials
const CLIENT_ID = 'your_client_id_here';
const CLIENT_SECRET = 'your_client_secret_here';
```

### Step 4: Configure Claude Desktop

1. **Find your Claude Desktop config file:**
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

2. **Add this configuration** (replace `/path/to/` with your actual path):

```json
{
  "mcpServers": {
    "tidio-mcp": {
      "command": "node",
      "args": [
        "/path/to/tidio-mcp-server/tidio-mcp.js"
      ]
    }
  }
}
```

**Example for Mac:**
```json
{
  "mcpServers": {
    "tidio-mcp": {
      "command": "node",
      "args": [
        "/Users/yourname/tidio-mcp-server/tidio-mcp.js"
      ]
    }
  }
}
```

### Step 5: Restart Claude Desktop

1. **Quit Claude Desktop completely**
2. **Reopen Claude Desktop**
3. **Start a new conversation**

## 🛠 Available Tools

Once configured, you'll have access to these tools in Claude:

- **`get_contacts`** - Get customer contacts who have interacted with your chat
- **`get_contact_messages`** - Get full conversation transcripts by contact ID
- **`get_operators`** - List all Tidio operators/agents
- **`search_contacts`** - Search contacts by email, name, or other criteria
- **`get_tickets`** - Retrieve support tickets with filtering options
- **`get_ticket_details`** - Get detailed information about specific tickets

## 📝 Example Usage in Claude

```
"Can you get my recent Tidio contacts and show me the conversation transcript for the most recent one?"

"Show me all open support tickets from the last week"

"Search for contacts with email containing '@gmail.com' and analyze their common issues"
```

## 🔧 Troubleshooting

### "Server failed to start" error
- Make sure Node.js 18+ is installed: `node --version`
- Check that all dependencies are installed: `npm install`
- Verify your credentials are correct in `tidio-mcp.js`

### "No tools available" in Claude
- Ensure the file path in `claude_desktop_config.json` is correct
- Restart Claude Desktop completely after making config changes
- Check that the server starts without errors: `npm test`

### API Rate Limiting
- Tidio has rate limits on API calls
- If you get 429 errors, wait a few minutes before trying again

## 🔒 Security Notes

- **Never commit your actual API credentials to Git**
- Consider using environment variables for credentials in production
- Keep your `CLIENT_SECRET` private and secure

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Tidio plan includes API access
3. Test the server independently: `npm test`

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ for better customer support analysis** 