# GitHub Actions Workflow Visualizer

A web application that helps developers understand and visualize GitHub Actions workflows. Upload or paste your workflow YAML files to see a visual representation of job dependencies, execution order, and step details.

## 🎯 Features

- **YAML Upload & Paste**: Upload `.yml`/`.yaml` files or paste workflow content directly
- **Dependency Graph Visualization**: Interactive DAG showing job relationships and dependencies
- **Execution Timeline**: See the sequential and parallel execution phases
- **Step Details**: Click on any job to view all its steps and configurations
- **Conditional Logic**: Identify conditional jobs and view their conditions
- **Error Detection**: Automatic detection of circular dependencies and invalid syntax
- **Sample Workflows**: Load pre-built example workflows

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe backend
- **js-yaml** - YAML parsing and validation
- **CORS** - Cross-origin request handling

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe components
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

## 📦 Project Structure

```
github-actions/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── types.ts          # Type definitions
│   │   └── services/
│   │       └── workflowParser.ts  # YAML parsing logic
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   ├── types.ts          # Shared types
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── components/
│   │       ├── WorkflowParser.tsx    # Input component
│   │       ├── DAGVisualization.tsx  # Dependency graph
│   │       ├── TimelineView.tsx      # Execution timeline
│   │       ├── JobDetails.tsx        # Job info panel
│   │       └── Badge.tsx             # UI component
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
cd github-actions
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Start the backend server:**
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:3000`

**Terminal 2 - Start the frontend dev server:**
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:5173`

## 📖 Usage

1. **Load a Sample Workflow**
   - Click the "📋 Load Sample" button to see an example workflow

2. **Upload a Workflow File**
   - Click "📁 Upload File" and select a `.yml` or `.yaml` file from your GitHub Actions repository

3. **Paste Workflow Content**
   - Paste your workflow YAML directly into the text area

4. **Visualize**
   - Click "✨ Visualize" to parse and visualize the workflow

5. **Explore**
   - Switch between **Dependency Graph** and **Execution Timeline** views
   - Click on any job to see its details, steps, and conditions

## 🔍 Understanding the Visualization

### Dependency Graph (DAG)
- **Nodes**: Each job in the workflow
- **Edges**: Dependency relationships (arrows point to dependent jobs)
- **Badges**: Show runner type and conditional flags
- **Interactive**: Click to see detailed information

### Execution Timeline
- **Phases**: Grouped by execution level (sequential vs parallel)
- **Level 1**: Jobs with no dependencies (run immediately)
- **Level N**: Jobs that depend on Level N-1 jobs
- **Parallel Jobs**: Multiple jobs in the same level run in parallel

### Job Details Panel
- Job name and ID
- Runner configuration
- All dependencies
- Conditional expressions
- Complete list of steps with:
  - Step type (run/uses/other)
  - Step description
  - Individual step conditions

## 🧪 API Endpoints

### POST `/api/parse-workflow`
Parse and visualize a GitHub Actions workflow.

**Request:**
```json
{
  "yamlContent": "name: CI\non: push\njobs: { ... }"
}
```

**Response:**
```json
{
  "success": true,
  "workflow": { ... },
  "graph": {
    "jobs": [ ... ],
    "executionOrder": [ ... ],
    "hasCycles": false
  }
}
```

### GET `/api/sample-workflow`
Get a sample workflow for demonstration.

**Response:**
```json
{
  "yamlContent": "name: CI/CD Pipeline\n..."
}
```

## 🎨 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with your web server
```

## 📝 Supported Workflow Features

The visualizer recognizes and displays:
- ✅ Job names and runner types
- ✅ Job dependencies (`needs`)
- ✅ Conditional jobs (`if`)
- ✅ Steps with run/uses/other types
- ✅ Step conditions
- ✅ Environment variables
- ✅ Timeouts
- ✅ Job strategies (matrix builds)
- ⚠️ Circular dependency detection

## 🐛 Limitations

- Matrix strategy job expansion is shown as a single job
- Container and service configurations are not visualized
- Secrets and sensitive values are not resolved
- Reusable workflows are treated as uses actions

## 📄 Example Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - run: npm run test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploying..."
```

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Support for reusable workflows
- Matrix job expansion visualization
- Export to image/PDF
- Dark mode toggle
- Performance optimization for large workflows

## 📄 License

MIT

## 🙋 Support

For issues or questions, please open an issue in the repository.

---

**Made with ❤️ for GitHub Actions developers**
