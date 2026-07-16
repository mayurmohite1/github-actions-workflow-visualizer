import './styles/globals.css';
import { useState } from 'react';
import { Workflow, WorkflowGraph } from './types';
import { WorkflowParser } from './components/WorkflowParser';
import { DAGVisualization } from './components/DAGVisualization';
import { TimelineView } from './components/TimelineView';
import { JobDetails } from './components/JobDetails';
import { WorkflowExplanation } from './components/WorkflowExplanation';

function App() {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [graph, setGraph] = useState<WorkflowGraph | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
  const [activeView, setActiveView] = useState<'dag' | 'timeline' | 'explain'>('dag');

  const handleParsed = (data: { workflow: Workflow; graph: WorkflowGraph }) => {
    setWorkflow(data.workflow);
    setGraph(data.graph);
    setSelectedJobId(undefined);
  };

  const selectedJob = selectedJobId && graph ? graph.jobs.find((j) => j.id === selectedJobId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔄 GitHub Actions Workflow Visualizer</h1>
          <p className="text-gray-300">Paste or upload a GitHub Actions workflow to visualize its execution flow</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Parser */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📝 Workflow Input</h2>
            <WorkflowParser onParsed={handleParsed} />
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-3 space-y-6">
            {workflow && graph ? (
              <>
                {/* View Toggle */}
                <div className="flex flex-wrap gap-2 bg-white rounded-lg p-2 shadow-lg">
                  <button
                    onClick={() => setActiveView('dag')}
                    className={`flex-1 min-w-[140px] py-2 px-4 rounded font-semibold transition-colors ${activeView === 'dag'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    📊 Dependency Graph
                  </button>
                  <button
                    onClick={() => setActiveView('timeline')}
                    className={`flex-1 min-w-[140px] py-2 px-4 rounded font-semibold transition-colors ${activeView === 'timeline'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    ⏱️ Execution Timeline
                  </button>
                  <button
                    onClick={() => setActiveView('explain')}
                    className={`flex-1 min-w-[140px] py-2 px-4 rounded font-semibold transition-colors ${activeView === 'explain'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    🧠 Explain YAML
                  </button>
                </div>

                {/* Visualization */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {activeView === 'dag' ? (
                    <div className="p-6">
                      <DAGVisualization
                        jobs={graph.jobs}
                        selectedJobId={selectedJobId}
                        onJobSelect={setSelectedJobId}
                      />
                    </div>
                  ) : activeView === 'timeline' ? (
                    <div>
                      <TimelineView
                        graph={graph}
                        selectedJobId={selectedJobId}
                        onJobSelect={setSelectedJobId}
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <WorkflowExplanation workflow={workflow} graph={graph} />
                    </div>
                  )}
                </div>

                {/* Workflow Info */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3">📋 Workflow Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">{graph.jobs.length}</div>
                      <div className="text-xs text-gray-600">Total Jobs</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">{graph.executionOrder.length}</div>
                      <div className="text-xs text-gray-600">Execution Phases</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {graph.jobs.reduce((sum, job) => sum + job.steps.length, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Total Steps</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {graph.jobs.filter((j) => j.hasCondition).length}
                      </div>
                      <div className="text-xs text-gray-600">Conditional Jobs</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflow loaded</h3>
                <p className="text-gray-600">Paste or upload a GitHub Actions workflow to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Panel */}
        {workflow && graph && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🔍 Job Details</h2>
            <JobDetails job={selectedJob || null} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
