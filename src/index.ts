#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

// Base URL for Northwind OData API
const BASE_URL = 'https://services.odata.org/v2/northwind/northwind.svc';

// Create axios instance for Northwind API
const northwindApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Generic OData response interface
interface ODataResponse<T> {
  d: {
    results: T[];
  };
}

// Helper function to handle OData queries
async function queryOData<T>(
  endpoint: string,
  filter?: string,
  top?: number,
  skip?: number,
  orderby?: string,
  select?: string
) {
  try {
    const params: Record<string, string | number> = {
      '$format': 'json',
    };

    if (filter) params['$filter'] = filter;
    if (top !== undefined) params['$top'] = top;
    if (skip !== undefined) params['$skip'] = skip;
    if (orderby) params['$orderby'] = orderby;
    if (select) params['$select'] = select;

    const response = await northwindApi.get<ODataResponse<T>>(endpoint, { params });

    if (!response.data?.d?.results) {
      return {
        content: [{
          type: "text" as const,
          text: "Error: Invalid response structure from Northwind API",
        }],
        isError: true,
      };
    }

    const results = response.data.d.results;
    const resultText = `Found ${results.length} record(s):\n\n${JSON.stringify(results, null, 2)}`;

    return {
      content: [{
        type: "text" as const,
        text: resultText,
      }],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message?.value
        ?? error.response?.statusText
        ?? error.message
        ?? "Unknown error occurred";
      
      return {
        content: [{
          type: "text" as const,
          text: `Northwind API error: ${errorMessage}`,
        }],
        isError: true,
      };
    }
    
    return {
      content: [{
        type: "text" as const,
        text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    };
  }
}

// Common query parameters schema
const commonQuerySchema = {
  filter: z.string().optional().describe("OData filter expression (e.g., \"Country eq 'USA'\")"),
  top: z.number().min(1).max(100).optional().describe("Number of records to return (1-100)"),
  skip: z.number().min(0).optional().describe("Number of records to skip"),
  orderby: z.string().optional().describe("OData orderby expression (e.g., \"CompanyName desc\")"),
  select: z.string().optional().describe("Comma-separated list of fields to select"),
};

// Create an MCP server
const server = new McpServer({
  name: "northwind-server",
  version: "0.2.0"
});

// 1. Customers
server.tool("get_customers", commonQuerySchema, async (params) => 
  queryOData('/Customers', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 2. Products
server.tool("get_products", commonQuerySchema, async (params) => 
  queryOData('/Products', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 3. Orders
server.tool("get_orders", commonQuerySchema, async (params) => 
  queryOData('/Orders', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 4. Order Details
server.tool("get_order_details", commonQuerySchema, async (params) => 
  queryOData('/Order_Details', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 5. Employees
server.tool("get_employees", commonQuerySchema, async (params) => 
  queryOData('/Employees', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 6. Categories
server.tool("get_categories", commonQuerySchema, async (params) => 
  queryOData('/Categories', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 7. Suppliers
server.tool("get_suppliers", commonQuerySchema, async (params) => 
  queryOData('/Suppliers', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 8. Shippers
server.tool("get_shippers", commonQuerySchema, async (params) => 
  queryOData('/Shippers', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 9. Regions
server.tool("get_regions", commonQuerySchema, async (params) => 
  queryOData('/Regions', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 10. Territories
server.tool("get_territories", commonQuerySchema, async (params) => 
  queryOData('/Territories', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 11. Customer Demographics
server.tool("get_customer_demographics", commonQuerySchema, async (params) => 
  queryOData('/CustomerDemographics', params.filter, params.top, params.skip, params.orderby, params.select)
);

// Views/Reports

// 12. Alphabetical List of Products
server.tool("get_alphabetical_products", commonQuerySchema, async (params) => 
  queryOData('/Alphabetical_list_of_products', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 13. Category Sales for 1997
server.tool("get_category_sales_1997", commonQuerySchema, async (params) => 
  queryOData('/Category_Sales_for_1997', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 14. Current Product List
server.tool("get_current_product_list", commonQuerySchema, async (params) => 
  queryOData('/Current_Product_Lists', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 15. Customer and Suppliers by City
server.tool("get_customers_suppliers_by_city", commonQuerySchema, async (params) => 
  queryOData('/Customer_and_Suppliers_by_Cities', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 16. Invoices
server.tool("get_invoices", commonQuerySchema, async (params) => 
  queryOData('/Invoices', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 17. Order Details Extended
server.tool("get_order_details_extended", commonQuerySchema, async (params) => 
  queryOData('/Order_Details_Extendeds', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 18. Order Subtotals
server.tool("get_order_subtotals", commonQuerySchema, async (params) => 
  queryOData('/Order_Subtotals', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 19. Orders Query
server.tool("get_orders_query", commonQuerySchema, async (params) => 
  queryOData('/Orders_Qries', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 20. Product Sales for 1997
server.tool("get_product_sales_1997", commonQuerySchema, async (params) => 
  queryOData('/Product_Sales_for_1997', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 21. Products Above Average Price
server.tool("get_products_above_average_price", commonQuerySchema, async (params) => 
  queryOData('/Products_Above_Average_Prices', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 22. Products by Category
server.tool("get_products_by_category", commonQuerySchema, async (params) => 
  queryOData('/Products_by_Categories', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 23. Sales by Category
server.tool("get_sales_by_category", commonQuerySchema, async (params) => 
  queryOData('/Sales_by_Categories', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 24. Sales Totals by Amount
server.tool("get_sales_totals_by_amount", commonQuerySchema, async (params) => 
  queryOData('/Sales_Totals_by_Amounts', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 25. Summary of Sales by Quarter
server.tool("get_sales_by_quarter", commonQuerySchema, async (params) => 
  queryOData('/Summary_of_Sales_by_Quarters', params.filter, params.top, params.skip, params.orderby, params.select)
);

// 26. Summary of Sales by Year
server.tool("get_sales_by_year", commonQuerySchema, async (params) => 
  queryOData('/Summary_of_Sales_by_Years', params.filter, params.top, params.skip, params.orderby, params.select)
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Northwind MCP server running on stdio with 26 tools');

// Made with Bob
