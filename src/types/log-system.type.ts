export interface LogSystem {
  id_log_system: number;
  endpoint_name?: string;
  action_page: string;
  table_name?: string;
  error_status: number;
  error_menssage?: string;
  created_at: string;
}

export interface LogNotification {
  id: number;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  logData: LogSystem;
}
