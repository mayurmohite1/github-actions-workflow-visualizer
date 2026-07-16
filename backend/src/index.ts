import express, { Request, Response } from "express";
import cors from "cors";
import { WorkflowParser } from "./services/workflowParser.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Parse workflow YAML
app.post("/api/parse-workflow", (req: Request, res: Response) => {
  try {
    const { yamlContent } = req.body;

    if (!yamlContent || typeof yamlContent !== "string") {
      return res.status(400).json({ error: "Missing or invalid yamlContent" });
    }

    const parseResult = WorkflowParser.parseYAML(yamlContent);

    if (!parseResult.success || !parseResult.workflow) {
      return res.status(400).json({ error: parseResult.error });
    }

    const graph = WorkflowParser.buildGraph(parseResult.workflow);

    res.json({
      success: true,
      workflow: parseResult.workflow,
      graph,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error parsing workflow:", message);
    res.status(500).json({ error: `Server error: ${message}` });
  }
});

// Get sample workflow
app.get("/api/sample-workflow", (req: Request, res: Response) => {
  const sampleWorkflow = `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 18

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: \${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm run lint

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: \${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm run test:coverage

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: \${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm run build

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploying application..."
      - run: echo "Deploy completed!"
`;

  res.json({ yamlContent: sampleWorkflow });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "Internal server error" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
