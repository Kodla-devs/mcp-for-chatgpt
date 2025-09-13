# MCP (Model Context Protocol) Server with Next.js

## 🚀 Overview

This project is a comprehensive **Model Context Protocol (MCP) Server** built with **Next.js 15**, designed to demonstrate how to create, deploy, and integrate MCP tools that can be consumed by AI assistants and language models. The MCP enables AI models to access external tools, data sources, and APIs in a standardized way.

### What is MCP?

The **Model Context Protocol (MCP)** is an open standard that enables secure connections between AI applications and external data sources and tools. It provides:

- **Standardized Communication**: A unified way for AI models to interact with external resources
- **Security**: Controlled access to tools and data with proper authentication
- **Extensibility**: Easy to add new tools and capabilities
- **Interoperability**: Works across different AI platforms and models

## 🏗️ Project Architecture

```
mcp-app/
├── app/
│   ├── api/mcp/
│   │   └── route.js          # MCP server endpoint
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── package.json              # Project dependencies
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Core Components

1. **MCP Handler** (`app/api/mcp/route.js`): The main MCP server implementation
2. **Next.js App Router**: Modern routing and API handling
3. **TypeScript Support**: Type-safe development environment
4. **Tailwind CSS**: Utility-first CSS framework

## 🛠️ Current Implementation

The current MCP server includes:

### Time Tool

- **Function**: `time_now`
- **Description**: Returns current time in Istanbul (Europe/Istanbul timezone)
- **Parameters**: None
- **Returns**: Formatted time string in Turkish locale

```javascript
server.tool(
  "time_now",
  "Returns the current time in Istanbul (Europe/Istanbul timezone)",
  {},
  async () => {
    const now = new Date();
    const options = {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const timeString = now.toLocaleString("tr-TR", options);
    return {
      content: [
        { type: "text", text: `Şu an İstanbul saatiyle: ${timeString}` },
      ],
    };
  }
);
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm**, **npm**, **yarn**, or **bun** package manager
- Basic understanding of JavaScript/TypeScript
- Familiarity with Next.js (optional but helpful)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd mcp-app
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Run the development server**:

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - MCP Endpoint: [http://localhost:3000/api/mcp](http://localhost:3000/api/mcp)

### Testing the MCP Server

You can test the MCP server using various methods:

1. **Direct API Call**:

   ```bash
   curl -X POST http://localhost:3000/api/mcp \
     -H "Content-Type: application/json" \
     -d '{"method": "tools/call", "params": {"name": "time_now", "arguments": {}}}'
   ```

2. **AI Assistant Integration**: Connect your MCP server to compatible AI assistants

## 🔧 Developing Your Own MCP

### Understanding MCP Structure

An MCP server consists of:

1. **Tools**: Functions that the AI can call
2. **Resources**: Data sources the AI can access
3. **Prompts**: Pre-defined prompts for specific tasks

### Step-by-Step Guide to Create Custom MCP Tools

#### 1. Basic Tool Structure

```javascript
server.tool(
  "tool_name", // Unique identifier
  "Tool description", // What the tool does
  {
    // Input schema (JSON Schema)
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "Parameter description",
      },
    },
    required: ["param1"],
  },
  async (args) => {
    // Implementation function
    // Your tool logic here
    return {
      content: [
        {
          type: "text",
          text: "Tool response",
        },
      ],
    };
  }
);
```

#### 2. Example: Weather Tool

```javascript
server.tool(
  "get_weather",
  "Get current weather for a city",
  {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City name",
      },
      country: {
        type: "string",
        description: "Country code (optional)",
        default: "TR",
      },
    },
    required: ["city"],
  },
  async (args) => {
    const { city, country = "TR" } = args;

    // Replace with actual weather API call
    const weatherData = await fetchWeatherData(city, country);

    return {
      content: [
        {
          type: "text",
          text: `Weather in ${city}: ${weatherData.temperature}°C, ${weatherData.description}`,
        },
      ],
    };
  }
);
```

#### 3. Example: Database Query Tool

```javascript
server.tool(
  "query_database",
  "Execute a safe database query",
  {
    type: "object",
    properties: {
      table: {
        type: "string",
        description: "Table name to query",
      },
      filters: {
        type: "object",
        description: "Query filters",
      },
    },
    required: ["table"],
  },
  async (args) => {
    const { table, filters = {} } = args;

    // Implement safe database querying
    const results = await executeQuery(table, filters);

    return {
      content: [
        {
          type: "text",
          text: `Query results: ${JSON.stringify(results, null, 2)}`,
        },
      ],
    };
  }
);
```

#### 4. Example: File Operations Tool

```javascript
server.tool(
  "read_file",
  "Read content of a file",
  {
    type: "object",
    properties: {
      filepath: {
        type: "string",
        description: "Path to the file to read",
      },
      encoding: {
        type: "string",
        description: "File encoding",
        default: "utf8",
      },
    },
    required: ["filepath"],
  },
  async (args) => {
    const { filepath, encoding = "utf8" } = args;

    try {
      const fs = require("fs").promises;
      const content = await fs.readFile(filepath, encoding);

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading file: ${error.message}`,
          },
        ],
      };
    }
  }
);
```

### Advanced MCP Features

#### 1. Resources

Resources provide access to data sources:

```javascript
server.resource(
  "config://database",
  "Database configuration",
  "application/json",
  async () => {
    return {
      contents: [
        {
          type: "text",
          text: JSON.stringify({
            host: "localhost",
            port: 5432,
            database: "myapp",
          }),
        },
      ],
    };
  }
);
```

#### 2. Prompts

Pre-defined prompts for specific tasks:

```javascript
server.prompt(
  "analyze_code",
  "Analyze code quality and suggest improvements",
  {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "Code to analyze",
      },
      language: {
        type: "string",
        description: "Programming language",
      },
    },
    required: ["code", "language"],
  },
  async (args) => {
    const { code, language } = args;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze this ${language} code and provide suggestions:\n\n${code}`,
          },
        },
      ],
    };
  }
);
```

### Security Considerations

1. **Input Validation**: Always validate and sanitize inputs
2. **Access Control**: Implement proper authentication and authorization
3. **Rate Limiting**: Prevent abuse with rate limiting
4. **Error Handling**: Don't expose sensitive information in errors
5. **Sandboxing**: Isolate dangerous operations

```javascript
// Example of secure input validation
server.tool(
  "secure_tool",
  "A secure tool with proper validation",
  schema,
  async (args) => {
    // Validate inputs
    if (!args.param || typeof args.param !== "string") {
      throw new Error("Invalid input parameter");
    }

    // Sanitize inputs
    const sanitizedParam = sanitizeInput(args.param);

    // Check permissions
    if (!hasPermission(sanitizedParam)) {
      throw new Error("Access denied");
    }

    // Proceed with operation
    return await safeOperation(sanitizedParam);
  }
);
```

### Testing Your MCP

#### 1. Unit Testing

```javascript
// test/mcp.test.js
import { createMcpHandler } from "mcp-handler";

describe("MCP Tools", () => {
  test("time_now returns valid time", async () => {
    // Test implementation
    const result = await timeNowTool();
    expect(result.content[0].text).toMatch(/Şu an İstanbul saatiyle:/);
  });
});
```

#### 2. Integration Testing

```bash
# Test MCP server endpoints
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list"}'
```

## 📚 Dependencies Explained

### Core Dependencies

- **@modelcontextprotocol/sdk**: Official MCP SDK for building MCP servers
- **mcp-handler**: Simplified wrapper for creating MCP servers in Next.js
- **next**: React framework for production-ready web applications
- **react** & **react-dom**: React library for building user interfaces

### Development Dependencies

- **typescript**: Type-safe JavaScript development
- **eslint**: Code linting and quality checking
- **tailwindcss**: Utility-first CSS framework
- **@types/\***: TypeScript type definitions

### Package Overrides

The project includes specific version overrides for zod to ensure compatibility:

```json
"overrides": {
    "mcp-handler": {
        "zod": "3.25.76"
    },
    "@modelcontextprotocol/sdk": {
        "zod": "3.25.76"
    }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** if needed
3. **Deploy**: Vercel automatically deploys on push to main branch

### Manual Deployment

1. **Build the application**:

   ```bash
   pnpm build
   ```

2. **Start production server**:
   ```bash
   pnpm start
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔗 Integration with AI Assistants

### Claude Desktop Integration

1. **Configure MCP in Claude Desktop**:
   ```json
   {
     "mcpServers": {
       "my-mcp-server": {
         "command": "node",
         "args": ["path/to/your/mcp/server.js"]
       }
     }
   }
   ```

### Custom AI Integration

Use the MCP SDK to integrate with any AI system:

```javascript
import { MCPClient } from "@modelcontextprotocol/sdk";

const client = new MCPClient();
await client.connect("http://localhost:3000/api/mcp");

// List available tools
const tools = await client.listTools();

// Call a tool
const result = await client.callTool("time_now", {});
```

## 🔄 Continuous Development

### Adding New Tools

1. **Plan your tool**: Define what it should do and what inputs it needs
2. **Design the schema**: Create JSON schema for input validation
3. **Implement the tool**: Write the actual functionality
4. **Test thoroughly**: Unit tests and integration tests
5. **Document**: Add clear documentation

### Best Practices

1. **Modular Design**: Keep tools small and focused
2. **Error Handling**: Comprehensive error handling and logging
3. **Documentation**: Clear descriptions and examples
4. **Testing**: Automated testing for all tools
5. **Security**: Always validate inputs and handle permissions
6. **Performance**: Optimize for speed and resource usage

## 📖 Additional Resources

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-tool`
3. **Commit your changes**: `git commit -m 'Add amazing tool'`
4. **Push to the branch**: `git push origin feature/amazing-tool`
5. **Open a Pull Request**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Join the community** discussions

---

**Happy coding! 🚀** Build amazing MCP tools and integrate them with AI assistants to create powerful, intelligent applications.
