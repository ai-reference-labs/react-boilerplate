export type Priority = 'standard' | 'high' | 'urgent';

export interface IntakeRequest {
  title: string;
  requester: string;
  description: string;
  priority: Priority;
}

export interface IntakeReceipt {
  id: string;
  status: 'accepted';
  submittedAt: string;
  summary: string;
}

export interface PlanItem {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  target: string;
  progress: number;
  status: 'discovery' | 'ready' | 'scheduled';
}

export interface PlanningQueueResponse {
  generatedAt: string;
  items: PlanItem[];
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  version: string;
  timestamp: string;
}
