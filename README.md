# Northwind MCP Server

An MCP server that provides access to the Northwind OData API for querying customer data.

## Prerequisites

Before using this MCP server, you need to install Node.js:

1. Download Node.js from: https://nodejs.org/
2. Install the LTS (Long Term Support) version
3. Verify installation by opening a new terminal and running:
   ```
   node --version
   npm --version
   ```

## Installation

Once Node.js is installed, navigate to this directory and run:

```bash
cd C:\Users\PoojithYallammagariR\AppData\Roaming\Bob-Code\MCP\northwind-server
npm install
```

## Building

After installing dependencies, build the project:

```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `build` directory.

## Configuration

The server is configured in Bob's MCP settings file at:
`C:\Users\PoojithYallammagariR\.bob\settings\mcp_settings.json`

Configuration entry:
```json
{
  "mcpServers": {
    "northwind": {
      "command": "node",
      "args": ["C:\\Users\\PoojithYallammagariR\\AppData\\Roaming\\Bob-Code\\MCP\\northwind-server\\build\\index.js"]
    }
  }
}
```

## Available Tools

### get_customers

Fetches customer data from the Northwind database.

**Parameters:**
- `filter` (optional): OData filter expression (e.g., "Country eq 'USA'")
- `top` (optional): Number of customers to return (1-100)
- `skip` (optional): Number of customers to skip for pagination

**Example usage:**
- Get all customers: `get_customers()`
- Get customers from USA: `get_customers(filter: "Country eq 'USA'")`
- Get first 10 customers: `get_customers(top: 10)`

## API Information

- **API**: Northwind OData Service
- **Base URL**: https://services.odata.org/v2/northwind/northwind.svc
- **Authentication**: None required (public API)
- **Format**: JSON

## Troubleshooting

If the server doesn't start:
1. Ensure Node.js is installed and in your PATH
2. Verify dependencies are installed: `npm install`
3. Rebuild the project: `npm run build`
4. Check that the build directory exists and contains index.js