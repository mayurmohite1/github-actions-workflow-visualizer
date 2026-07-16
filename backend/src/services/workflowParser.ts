import YAML from "js-yaml";
import {
  Workflow,
  WorkflowJob,
  JobNode,
  StepInfo,
  WorkflowGraph,
} from "../types.js";

export class WorkflowParser {
  static parseYAML(yamlContent: string): {
    success: boolean;
    workflow?: Workflow;
    error?: string;
  } {
    try {
      const parsed = YAML.load(yamlContent) as Workflow;
      if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "YAML must contain a workflow object" };
      }
      if (!parsed.jobs || typeof parsed.jobs !== "object") {
        return {
          success: false,
          error: "Workflow must contain a 'jobs' section",
        };
      }
      return { success: true, workflow: parsed };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Invalid YAML: ${message}` };
    }
  }

  static createJobNode(
    jobId: string,
    jobDef: WorkflowJob,
    allJobs: Record<string, WorkflowJob>
  ): JobNode {
    const dependencies = this.parseDependencies(jobDef.needs);
    const steps = this.parseSteps(jobDef.steps);

    return {
      id: jobId,
      name: jobDef.name || jobId,
      runsOn: Array.isArray(jobDef["runs-on"])
        ? jobDef["runs-on"].join(", ")
        : jobDef["runs-on"],
      dependencies,
      steps,
      hasCondition: !!jobDef.if,
      conditionText: jobDef.if,
    };
  }

  private static parseDependencies(needs?: string | string[]): string[] {
    if (!needs) return [];
    if (typeof needs === "string") return [needs];
    return needs;
  }

  private static parseSteps(steps: any[]): StepInfo[] {
    if (!Array.isArray(steps)) return [];

    return steps.map((step, index) => {
      let type: "run" | "uses" | "other" = "other";
      let description = `Step ${index + 1}`;

      if (step.run) {
        type = "run";
        description = step.name || step.run.split("\n")[0];
      } else if (step.uses) {
        type = "uses";
        description = step.name || step.uses;
      } else if (step.name) {
        description = step.name;
      }

      return {
        id: step.id || undefined,
        name: step.name,
        type,
        description: description.substring(0, 100),
        condition: step.if,
      };
    });
  }

  static buildGraph(workflow: Workflow): WorkflowGraph {
    const jobNodes: JobNode[] = [];
    const jobMap = new Map<string, JobNode>();

    // Create all nodes
    for (const [jobId, jobDef] of Object.entries(workflow.jobs)) {
      const node = this.createJobNode(jobId, jobDef, workflow.jobs);
      jobNodes.push(node);
      jobMap.set(jobId, node);
    }

    // Detect cycles
    const hasCycles = this.detectCycle(jobMap);

    // Calculate execution order (topological sort)
    const executionOrder = this.topologicalSort(jobMap, hasCycles);

    return {
      jobs: jobNodes,
      executionOrder,
      hasCycles,
    };
  }

  private static detectCycle(jobMap: Map<string, JobNode>): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (jobId: string): boolean => {
      visited.add(jobId);
      recursionStack.add(jobId);

      const job = jobMap.get(jobId);
      if (!job) return false;

      for (const dep of job.dependencies) {
        if (!visited.has(dep)) {
          if (hasCycleDFS(dep)) return true;
        } else if (recursionStack.has(dep)) {
          return true;
        }
      }

      recursionStack.delete(jobId);
      return false;
    };

    for (const jobId of jobMap.keys()) {
      if (!visited.has(jobId)) {
        if (hasCycleDFS(jobId)) return true;
      }
    }

    return false;
  }

  private static topologicalSort(
    jobMap: Map<string, JobNode>,
    hasCycles: boolean
  ): string[][] {
    if (hasCycles) {
      // If there are cycles, return jobs grouped by depth
      return Array.from(jobMap.keys()).map((id) => [id]);
    }

    const visited = new Set<string>();
    const order: string[][] = [];
    const inDegree = new Map<string, number>();

    // Calculate in-degrees
    for (const [jobId, job] of jobMap) {
      if (!inDegree.has(jobId)) {
        inDegree.set(jobId, 0);
      }
      for (const dep of job.dependencies) {
        inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
      }
    }

    // Kahn's algorithm for topological sort with levels
    while (visited.size < jobMap.size) {
      const currentLevel: string[] = [];

      for (const [jobId, job] of jobMap) {
        if (!visited.has(jobId) && job.dependencies.every((d) => visited.has(d))) {
          currentLevel.push(jobId);
        }
      }

      if (currentLevel.length === 0) break;

      for (const jobId of currentLevel) {
        visited.add(jobId);
      }

      order.push(currentLevel);
    }

    return order;
  }
}
