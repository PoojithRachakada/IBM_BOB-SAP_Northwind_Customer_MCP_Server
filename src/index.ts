#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

// Base URL for Northwind OData API
const BASE_URL = 'https://services.odata.org/v2/northwind/northwind.svc';

// Define types for Northwind API responses
interface Customer {
  CustomerID: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string;
}

interface CustomersResponse {
  d: {
    results: Customer[];
  };
}

// Create an MCP server
const server = new McpServer({
  name: "northwind-server",
  version: "0.1.0"
});

// Create axios instance for Northwind API
const northwindApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Add a tool for getting customers
server.tool(
  "get_customers",
  {
    filter: z.string().optional().describe("OData filter expression (e.g., \"Country eq 'USA'\")"),
    top: z.number().min(1).max(100).optional().describe("Number of customers to return (1-100)"),
    skip: z.number().min(0).optional().describe("Number of customers to skip"),
  },
  async ({ filter, top, skip }) => {
    try {
      const params: Record<string, string | number> = {
        '$format': 'json',
      };

      if (filter) {
        params['$filter'] = filter;
      }
      if (top !== undefined) {
        params['$top'] = top;
      }
      if (skip !== undefined) {
        params['$skip'] = skip;
      }

      const response = await northwindApi.get<CustomersResponse>('/Customers', {
        params,
      });

      // Validate response structure
      if (!response.data || !response.data.d || !response.data.d.results) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Invalid response structure from Northwind API",
            },
          ],
          isError: true,
        };
      }

      const customers = response.data.d.results;

      // Check if we got any customers
      if (!customers || customers.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No customers found matching the criteria.",
            },
          ],
        };
      }

      // Format the response with customer count
      const resultText = `Found ${customers.length} customer(s):\n\n${JSON.stringify(customers, null, 2)}`;

      return {
        content: [
          {
            type: "text",
            text: resultText,
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message?.value
          ?? error.response?.statusText
          ?? error.message
          ?? "Unknown error occurred";
        
        return {
          content: [
            {
              type: "text",
              text: `Northwind API error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
      
      // Handle non-axios errors
      return {
        content: [
          {
            type: "text",
            text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Northwind MCP server running on stdio');

// Made with Bob
