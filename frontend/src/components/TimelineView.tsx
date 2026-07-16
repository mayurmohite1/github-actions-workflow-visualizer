import { WorkflowGraph } from '../types';
import { Badge } from './Badge';

interface TimelineViewProps {
  graph: WorkflowGraph;
  selectedJobId?: string;
  onJobSelect: (jobId: string) => void;
}

export const TimelineView = ({ graph, selectedJobId, onJobSelect }: TimelineViewProps) => {
  const jobMap = new Map(graph.jobs.map((job) => [job.id, job]));

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
      <div className="space-y-4">
        {graph.executionOrder.map((level, levelIndex) => (
          <div key={levelIndex}>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                {levelIndex + 1}
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {level.length === 1 ? 'Sequential job' : 'Parallel jobs'}
              </div>
            </div>

            <div className="ml-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {level.map((jobId) => {
                const job = jobMap.get(jobId);
                if (!job) return null;

                const isSelected = selectedJobId === jobId;

                return (
                  <div
                    key={jobId}
                    onClick={() => onJobSelect(jobId)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                      }`}
                  >
                    <div className="font-semibold text-gray-900 mb-2">{job.name}</div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Runner: {job.runsOn}</div>
                      <div>{job.steps.length} step{job.steps.length !== 1 ? 's' : ''}</div>
                    </div>
                    {job.hasCondition && (
                      <div className="mt-2">
                        <Badge variant="warning">Conditional</Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {graph.hasCycles && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-semibold">⚠️ Circular dependencies detected</div>
          <div className="text-red-700 text-sm mt-1">
            This workflow contains circular dependencies that would prevent execution.
          </div>
        </div>
      )}
    </div>
  );
};
