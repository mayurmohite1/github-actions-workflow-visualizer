import { JobNode } from '../types';
import { Badge } from './Badge';

interface DAGVisualizationProps {
  jobs: JobNode[];
  selectedJobId?: string;
  onJobSelect: (jobId: string) => void;
}

export const DAGVisualization = ({ jobs, selectedJobId, onJobSelect }: DAGVisualizationProps) => {
  const calculateNodePosition = (jobId: string, index: number) => {
    const cols = Math.ceil(Math.sqrt(jobs.length));
    const col = index % cols;
    const row = Math.floor(index / cols);
    return { x: col * 180, y: row * 140 };
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 min-h-96 relative overflow-auto">
      <svg className="absolute inset-0" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
          </marker>
        </defs>
        {jobs.map((job) =>
          job.dependencies.map((dep) => {
            const sourceJob = jobs.find((j) => j.id === dep);
            if (!sourceJob) return null;

            const sourceIdx = jobs.indexOf(sourceJob);
            const targetIdx = jobs.indexOf(job);
            const sourcePos = calculateNodePosition(dep, sourceIdx);
            const targetPos = calculateNodePosition(job.id, targetIdx);

            return (
              <line
                key={`${dep}->${job.id}`}
                x1={sourcePos.x + 90}
                y1={sourcePos.y + 60}
                x2={targetPos.x + 90}
                y2={targetPos.y}
                stroke="#9CA3AF"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })
        )}
      </svg>

      <div className="relative" style={{ minHeight: `${Math.ceil(Math.sqrt(jobs.length)) * 140}px` }}>
        {jobs.map((job, index) => {
          const pos = calculateNodePosition(job.id, index);
          const isSelected = selectedJobId === job.id;

          return (
            <div
              key={job.id}
              onClick={() => onJobSelect(job.id)}
              className={`absolute w-44 p-3 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-400 bg-white hover:border-blue-400 hover:shadow-md'
                }`}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            >
              <div className="font-semibold text-gray-900 truncate">{job.name}</div>
              <div className="text-xs text-gray-600 mt-1 truncate">{job.runsOn}</div>
              {job.hasCondition && (
                <div className="mt-2">
                  <Badge variant="warning">Has condition</Badge>
                </div>
              )}
              {job.dependencies.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Needs: {job.dependencies.join(', ')}
                </div>
              )}
              <div className="mt-2 text-xs text-blue-600 font-medium">
                {job.steps.length} step{job.steps.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
