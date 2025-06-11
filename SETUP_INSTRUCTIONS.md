# Tidio MCP Server - Setup Instructions

## 🚀 Quick Setup for Claude Desktop

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Claude Desktop** - [Download here](https://claude.ai/download)
- **Tidio Account** with API access (Plus or Premium plan required)

### Step 1: Install the MCP Server

**Option A: Clone from GitHub**
```bash
git clone https://github.com/ufarooqm/tidio-mcp-server.git
cd tidio-mcp-server
./install.sh
```

**Option B: Manual Installation**
```bash
# Navigate to your project directory
cd /path/to/tidio-mcp-server
npm install
npm test
```

### Step 2: Configure Your Tidio Credentials

1. **Get your Tidio API credentials:**
   - Log into Tidio → Settings → Developer → OpenAPI
   - Copy your Client ID and Client Secret

2. **Add credentials to the server:**
   - Edit `tidio-mcp.js` 
   - Replace the CLIENT_ID and CLIENT_SECRET with your actual credentials:
   ```javascript
   const CLIENT_ID = 'your_client_id_here';
   const CLIENT_SECRET = 'your_client_secret_here';
   ```

### Step 3: Verify the Server Works
Test that your server starts without errors:
```bash
node tidio-mcp.js
```
It should start without errors. Press `Ctrl+C` to stop it.

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

3. **Save the file** and **completely restart Claude Desktop** (quit and reopen).

### Step 5: Test in Claude Desktop

After restarting Claude Desktop, try asking Claude:

> "Can you get my recent Tidio contacts?"

You should see a list of your customer contacts!

## 🛠 What You Can Do Now

Ask Claude things like:
- "Show me my recent customer conversations"
- "Get the conversation transcript for contact ID [ID]"
- "Search for contacts with Gmail addresses"
- "Show me all open support tickets"
- "Analyze common customer issues from recent chats"

## 📝 Example Usage

```
"Can you get my recent Tidio contacts and show me the conversation transcript for the most recent one?"

"Show me all open support tickets from the last week"

"Search for contacts with email containing '@gmail.com' and analyze their common issues"
```

## 🛠 Available Tools

Your MCP server provides these tools:

1. **get_contacts** - Get customer contacts with pagination
2. **get_contact_messages** - Get full conversation transcripts by contact ID
3. **get_operators** - List all Tidio operators/agents
4. **search_contacts** - Search contacts by email, name, etc.
5. **get_tickets** - Get support tickets (if available)
6. **get_ticket_details** - Get detailed ticket information

## 🔧 Troubleshooting

### "No tools available" in Claude
- Ensure the file path in `claude_desktop_config.json` is correct
- Restart Claude Desktop completely after making config changes
- Check that the server starts without errors: `npm test`

### "Server failed to start" error
- Make sure Node.js 18+ is installed: `node --version`
- Check that all dependencies are installed: `npm install`
- Verify your credentials are correct in `tidio-mcp.js`

### API Rate Limiting
- Tidio has rate limits on API calls
- If you get 429 errors, wait a few minutes before trying again

### If Claude Desktop shows "Server disconnected":
1. Check the file path in the config points to your actual `tidio-mcp.js` location
2. Make sure you completely restarted Claude Desktop
3. Test the server manually: `node tidio-mcp.js`

## 📋 What You Can Do Now

With this MCP server, you can:

- **Analyze conversation patterns** - Get transcripts and see where chatbots fail
- **Track operator performance** - See who's handling what conversations
- **Search for specific issues** - Find conversations by customer email or name
- **Monitor support tickets** - Track ticket status and details
- **Generate reports** - Ask Claude to analyze the data and create summaries

## 🎯 Example Analysis Queries

Try these in Claude Desktop:

```
Get the last 20 contacts and analyze the most common issues mentioned in their conversations
```

```
Search for contacts with "refund" in their email and show me their conversation history
```

```
Get all operators and tell me who has been most active recently
```

```
Find contacts who visited the cart but didn't complete purchase and analyze their conversations
```

## 🔒 Security Notes

- **Never commit your actual API credentials to Git**
- Consider using environment variables for credentials in production
- Keep your `CLIENT_SECRET` private and secure

## ✨ Success!

Your Tidio MCP server is now ready! You have direct access to:
- ✅ Real conversation transcripts
- ✅ Customer contact data  
- ✅ Operator information
- ✅ Support ticket details

This gives you the data needed to analyze where chatbots are failing and make informed decisions about customer support automation.

---

**Made with ❤️ for better customer support analysis** 