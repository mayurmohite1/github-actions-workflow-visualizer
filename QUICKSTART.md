# 🚀 Quick Start - GitHub Actions Workflow Visualizer

## Installation (Already Done ✓)

```bash
cd /home/mayur/github-actions

# Backend dependencies already installed
cd backend && npm install

# Frontend dependencies already installed
cd frontend && npm install
```

## Running the App

### Terminal 1: Start Backend
```bash
cd /home/mayur/github-actions/backend
npm run dev

# Output: ✓ Server running on http://localhost:3000
```

### Terminal 2: Start Frontend
```bash
cd /home/mayur/github-actions/frontend
npm run dev

# Output: ✓ Local: http://localhost:5173
```

### Step 3: Open in Browser
Visit: **http://localhost:5173**

## First Time Using?

1. Click **📋 Load Sample** to see an example workflow
2. Click **✨ Visualize** to parse it
3. Toggle between:
   - **📊 Dependency Graph** - See job relationships
   - **⏱️ Execution Timeline** - See execution order
4. Click on any job to see its steps and details

## Upload Your Own Workflow

1. Click **📁 Upload File** and select a `.yml` or `.yaml` file
2. Or **paste** your workflow YAML directly
3. Click **✨ Visualize**

## What You Can See

- **Jobs**: Displayed as interactive nodes
- **Dependencies**: Shown as arrows between jobs
- **Execution Order**: Which jobs run first, in parallel, or sequentially
- **Steps**: Click a job to see all its steps
- **Conditional Logic**: Highlighted with warning badges

## Common Issues

### Backend won't start
```bash
cd backend
npm run build    # Check for TypeScript errors
npm run dev
```

### Frontend shows "Cannot find module"
```bash
cd frontend
npm install      # Reinstall dependencies
npm run dev
```

### API not responding
1. Make sure backend is running on http://localhost:3000
2. Check browser console (F12) for network errors
3. Verify both servers are running

## File Locations

- Backend: `/home/mayur/github-actions/backend/src/`
- Frontend: `/home/mayur/github-actions/frontend/src/`
- Documentation: `/home/mayur/github-actions/README.md`

## Full Documentation

See `README.md` in the project root for:
- Complete feature list
- API documentation
- Technology stack
- Advanced usage

## Build for Production

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
# Serve dist/ folder with any web server
npx http-server dist
```

---

**Need help?** Check the README.md or see the detailed documentation in the project root. 🎯
