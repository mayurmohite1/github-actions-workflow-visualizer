import { JobNode } from '../types';
import { Badge } from './Badge';

interface JobDetailsProps {
  job: JobNode | null;
}

export const JobDetails = ({ job }: JobDetailsProps) => {
  if (!job) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.name}</h3>
        <Badge>{job.id}</Badge>
      </div>

      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-600 font-semibold">Runs on:</span>
          <span className="ml-2 text-gray-900">{job.runsOn}</span>
        </div>

        {job.dependencies.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-600 font-semibold">Dependencies:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {job.dependencies.map((dep) => (
                <Badge key={dep}>{dep}</Badge>
              ))}
            </div>
          </div>
        )}

        {job.hasCondition && (
          <div className="text-sm">
            <span className="text-gray-600 font-semibold">Condition:</span>
            <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded font-mono text-xs text-gray-900">
              {job.conditionText}
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Steps ({job.steps.length})</h4>
        <div className="space-y-2">
          {job.steps.map((step, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-sm text-gray-900">
                  {index + 1}. {step.name || `Step ${index + 1}`}
                </div>
                <Badge
                  variant={
                    step.type === 'run' ? 'success' : step.type === 'uses' ? 'default' : 'warning'
                  }
                >
                  {step.type}
                </Badge>
              </div>
              <div className="text-xs text-gray-600 font-mono mb-1">
                {step.description}
              </div>
              {step.condition && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">if:</span> {step.condition}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
