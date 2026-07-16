// Workflow type definitions
export interface WorkflowStep {
  name?: string;
  run?: string;
  uses?: string;
  with?: Record<string, string | boolean | number>;
  if?: string;
  env?: Record<string, string>;
  id?: string;
}

export interface WorkflowJob {
  name?: string;
  "runs-on": string | string[];
  needs?: string | string[];
  if?: string;
  steps: WorkflowStep[];
  env?: Record<string, string>;
  permissions?: Record<string, string>;
  "timeout-minutes"?: number;
  strategy?: {
    matrix?: Record<string, (string | number)[]>;
    "fail-fast"?: boolean;
  };
}

export interface Workflow {
  name?: string;
  on?: Record<string, unknown>;
  env?: Record<string, string>;
  jobs: Record<string, WorkflowJob>;
}

export interface JobNode {
  id: string;
  name: string;
  runsOn: string;
  dependencies: string[];
  steps: StepInfo[];
  hasCondition: boolean;
  conditionText?: string;
}

export interface StepInfo {
  id?: string;
  name?: string;
  type: "run" | "uses" | "other";
  description: string;
  condition?: string;
}

export interface WorkflowGraph {
  jobs: JobNode[];
  executionOrder: string[][];
  hasCycles: boolean;
}
