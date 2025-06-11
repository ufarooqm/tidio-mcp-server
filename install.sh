#!/bin/bash

echo "🚀 Installing Tidio MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please update Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Test the server
echo "🧪 Testing MCP server..."
npm test

if [ $? -eq 0 ]; then
    echo "✅ MCP server test passed"
else
    echo "⚠️  MCP server test failed, but installation completed"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy credentials.example.js to credentials.js"
echo "2. Edit credentials.js with your Tidio API credentials"
echo "3. Configure Claude Desktop (see README.md)"
echo "4. Restart Claude Desktop"
echo ""
echo "For detailed instructions, see README.md" 