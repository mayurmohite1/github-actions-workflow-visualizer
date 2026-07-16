import { JobNode } from '../types';
import { Badge } from './Badge';

interface DAGVisualizationProps {
  jobs: JobNode[];
  selectedJobId?: string;
  onJobSelect: (jobId: string) => void;
}

export const DAGVisualization = ({ jobs, selectedJobId, onJobSelect }: DAGVisualizationProps) => {
  const calculateNodePosition = (_jobId: string, index: number) => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(jobs.length)));
    const col = index % cols;
    const row = Math.floor(index / cols);
    return { x: col * 240, y: row * 180 };
  };

  const getNodeLevel = (jobId: string): number => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return 0;
    return job.dependencies.length === 0 ? 0 : Math.max(...job.dependencies.map((dep) => getNodeLevel(dep))) + 1;
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 min-h-96 relative overflow-auto">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <Badge variant="default">Blue = selected</Badge>
        <Badge variant="warning">Yellow = conditional</Badge>
        <Badge>Arrows show dependency flow</Badge>
      </div>

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

      <div className="relative" style={{ minHeight: `${Math.max(1, Math.ceil(Math.sqrt(jobs.length))) * 180}px` }}>
        {jobs.map((job, index) => {
          const pos = calculateNodePosition(job.id, index);
          const isSelected = selectedJobId === job.id;
          const level = getNodeLevel(job.id);

          return (
            <div
              key={job.id}
              onClick={() => onJobSelect(job.id)}
              className={`absolute w-56 p-3 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-400 bg-white hover:border-blue-400 hover:shadow-md'
                }`}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 truncate">{job.name}</div>
                <div className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                  L{level + 1}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">Runner: {job.runsOn}</div>
              {job.hasCondition && (
                <div className="mt-2">
                  <Badge variant="warning">Conditional</Badge>
                </div>
              )}
              {job.dependencies.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Depends on: {job.dependencies.join(', ')}
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
