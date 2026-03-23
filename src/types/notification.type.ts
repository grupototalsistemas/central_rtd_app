import { LogSystem } from './log-system.type';

type AppNotification = {
  id: number;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  logData: LogSystem;
};

export default AppNotification;
