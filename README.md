# Northwind MCP Server

A Model Context Protocol (MCP) server that provides access to the Northwind OData API. This server exposes 26 tools for querying various Northwind database entities and views.

## Features

- **26 comprehensive tools** covering all Northwind endpoints
- **OData query support** with filtering, sorting, pagination, and field selection
- **Core entities**: Customers, Products, Orders, Employees, Categories, Suppliers, and more
- **Business views**: Sales reports, invoices, product analytics, and summaries

## Installation

```bash
npm install
npm run build
```

## Available Tools

### Core Entity Tools

1. **get_customers** - Query customer data
2. **get_products** - Query product catalog
3. **get_orders** - Query order headers
4. **get_order_details** - Query order line items
5. **get_employees** - Query employee information
6. **get_categories** - Query product categories
7. **get_suppliers** - Query supplier information
8. **get_shippers** - Query shipping companies
9. **get_regions** - Query geographic regions
10. **get_territories** - Query sales territories
11. **get_customer_demographics** - Query customer demographic data

### Business View Tools

12. **get_alphabetical_products** - Products sorted alphabetically
13. **get_category_sales_1997** - Sales by category for 1997
14. **get_current_product_list** - Current product listings
15. **get_customers_suppliers_by_city** - Customers and suppliers grouped by city
16. **get_invoices** - Invoice details
17. **get_order_details_extended** - Extended order details with calculations
18. **get_order_subtotals** - Order subtotal calculations
19. **get_orders_query** - Advanced order queries
20. **get_product_sales_1997** - Product sales for 1997
21. **get_products_above_average_price** - Products priced above average
22. **get_products_by_category** - Products grouped by category
23. **get_sales_by_category** - Sales grouped by category
24. **get_sales_totals_by_amount** - Sales totals by amount
25. **get_sales_by_quarter** - Quarterly sales summary
26. **get_sales_by_year** - Yearly sales summary

## Query Parameters

All tools support the following OData query parameters:

- **filter** (optional): OData filter expression
  - Example: `"Country eq 'USA'"`, `"UnitPrice gt 20"`
- **top** (optional): Number of records to return (1-100)
- **skip** (optional): Number of records to skip (for pagination)
- **orderby** (optional): Sort expression
  - Example: `"CompanyName desc"`, `"UnitPrice asc"`
- **select** (optional): Comma-separated list of fields to return
  - Example: `"CustomerID,CompanyName,City"`

## Usage Examples

### Get customers from USA
```json
{
  "filter": "Country eq 'USA'",
  "top": 10
}
```

### Get expensive products
```json
{
  "filter": "UnitPrice gt 50",
  "orderby": "UnitPrice desc",
  "top": 20
}
```

### Get orders with pagination
```json
{
  "top": 25,
  "skip": 50,
  "orderby": "OrderDate desc"
}
```

### Get specific customer fields
```json
{
  "select": "CustomerID,CompanyName,City,Country",
  "filter": "City eq 'London'"
}
```

## OData Filter Operators

- **Comparison**: `eq` (equals), `ne` (not equals), `gt` (greater than), `ge` (greater or equal), `lt` (less than), `le` (less or equal)
- **Logical**: `and`, `or`, `not`
- **String**: `startswith()`, `endswith()`, `substringof()`
- **Examples**:
  - `"Country eq 'USA' and City eq 'Seattle'"`
  - `"UnitPrice gt 20 and UnitPrice lt 50"`
  - `"startswith(CompanyName, 'A')"`

## Configuration

The server connects to the public Northwind OData API:
```
https://services.odata.org/v2/northwind/northwind.svc
```

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build

# The server runs via stdio transport
node build/index.js
```

## MCP Integration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "northwind": {
      "command": "node",
      "args": ["C:/Users/YOUR_USERNAME/AppData/Roaming/Bob-Code/MCP/northwind-server/build/index.js"]
    }
  }
}
```

## License

MIT

## Made with Bob