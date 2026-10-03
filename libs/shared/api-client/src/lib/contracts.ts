export type Priority = 'standard' | 'high' | 'urgent';

export interface App1Request {
  title: string;
  requester: string;
  description: string;
  priority: Priority;
}

export interface App1Receipt {
  id: string;
  status: 'accepted';
  submittedAt: string;
  summary: string;
}

export interface App2Item {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  target: string;
  progress: number;
  status: 'discovery' | 'ready' | 'scheduled';
}

export interface App2QueueResponse {
  generatedAt: string;
  items: App2Item[];
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  version: string;
  timestamp: string;
}
