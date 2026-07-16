import { Workflow, WorkflowGraph, WorkflowJob, WorkflowStep } from '../types';
import { Badge } from './Badge';

interface WorkflowExplanationProps {
    workflow: Workflow;
    graph: WorkflowGraph;
}

const formatStep = (step: WorkflowStep): string => {
    if (step.run) return step.run.split('\n')[0];
    if (step.uses) return step.uses;
    if (step.name) return step.name;
    return 'Unnamed step';
};

export const WorkflowExplanation = ({ workflow, graph }: WorkflowExplanationProps) => {
    const triggerList = workflow.on ? Object.keys(workflow.on) : [];
    const envEntries = workflow.env ? Object.entries(workflow.env) : [];

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-lg font-semibold text-blue-900">🧭 What this YAML is doing</h3>
                <p className="mt-2 text-sm text-blue-800">
                    This workflow defines when the pipeline should run, which jobs should execute, and how each job depends on the others.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="font-semibold text-gray-900">Workflow overview</h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        <li><span className="font-semibold">Name:</span> {workflow.name || 'Untitled workflow'}</li>
                        <li><span className="font-semibold">Triggers:</span> {triggerList.length > 0 ? triggerList.join(', ') : 'None declared'}</li>
                        <li><span className="font-semibold">Global env vars:</span> {envEntries.length > 0 ? envEntries.length : 0}</li>
                        <li><span className="font-semibold">Jobs:</span> {graph.jobs.length}</li>
                    </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="font-semibold text-gray-900">Execution phases</h4>
                    <div className="mt-3 space-y-2">
                        {graph.executionOrder.map((level, index) => (
                            <div key={index} className="rounded border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700">
                                <div className="font-semibold text-gray-900">Phase {index + 1}</div>
                                <div className="mt-1">{level.join(', ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="font-semibold text-gray-900">Job-by-job explanation</h4>
                <div className="mt-4 space-y-4">
                    {graph.jobs.map((job) => {
                        const jobDefinition = workflow.jobs[job.id] as WorkflowJob | undefined;
                        const steps = jobDefinition?.steps || [];

                        return (
                            <div key={job.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="font-semibold text-gray-900">{job.name}</h5>
                                    <Badge>{job.id}</Badge>
                                    {job.hasCondition && <Badge variant="warning">Conditional</Badge>}
                                </div>

                                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                    <li><span className="font-semibold">Runner:</span> {job.runsOn}</li>
                                    <li>
                                        <span className="font-semibold">Depends on:</span>{' '}
                                        {job.dependencies.length > 0 ? job.dependencies.join(', ') : 'No prior jobs'}
                                    </li>
                                    <li><span className="font-semibold">Steps:</span> {steps.length}</li>
                                    {job.hasCondition && (
                                        <li><span className="font-semibold">Condition:</span> {job.conditionText}</li>
                                    )}
                                </ul>

                                {steps.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step breakdown</div>
                                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                            {steps.map((step, index) => (
                                                <li key={index} className="rounded border border-gray-200 bg-white p-2">
                                                    <span className="font-semibold">{index + 1}.</span> {formatStep(step)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
