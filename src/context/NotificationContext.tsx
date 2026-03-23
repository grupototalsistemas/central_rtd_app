'use client';

import { useLogWebSocket } from '@/hooks/useLogWebSocket';
import { LogNotification, LogSystem } from '@/types/log-system.type';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// ⚠️ CONTROLE TEMPORÁRIO: Altere para true quando quiser reativar o WebSocket
const WEBSOCKET_ENABLED = false;

interface NotificationContextData {
  notifications: LogNotification[];
  unreadCount: number;
  isConnected: boolean;
  error: string | null;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: number) => void;
  toggleReadStatus: (id: number) => void;
  filterByType: (type: LogNotification['type'] | 'all') => LogNotification[];
  filterUnread: () => LogNotification[];
  searchNotifications: (query: string) => LogNotification[];
}

const NotificationContext = createContext<NotificationContextData | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
  websocketUrl: string;
  maxNotifications?: number;
}

/**
 * Provider para gerenciar notificações em tempo real via WebSocket
 */
export function NotificationProvider({
  children,
  websocketUrl,
  maxNotifications = 50,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<LogNotification[]>([]);

  // Função para processar log em notificação (sem dependências que mudam)
  const processLogToNotification = useCallback(
    (log: LogSystem, isError = false): LogNotification => {
      const type = isError || log.error_status !== 0 ? 'error' : 'success';

      let title = 'Nova atividade';
      let message = log.action_page;

      if (log.error_status !== 0 && log.error_menssage) {
        title = 'Erro na operação';
        message = log.error_menssage;
      } else if (log.table_name) {
        title = `Operação em ${log.table_name}`;
        message = `Ação: ${log.action_page}`;
      }

      return {
        id: log.id_log_system,
        type,
        title,
        message,
        timestamp: log.created_at,
        read: false,
        logData: log,
      };
    },
    []
  );

  // Callback para novo log (estável, não muda entre renders)
  const handleNewLog = useCallback(
    (log: LogSystem) => {
      const notification = processLogToNotification(log, false);

      setNotifications((prev) => {
        const newNotifications = [notification, ...prev];
        // Limitar número de notificações usando o valor atual
        return newNotifications.slice(0, 50);
      });
    },
    [processLogToNotification]
  );

  // Callback para log de erro (estável, não muda entre renders)
  const handleErrorLog = useCallback(
    (log: LogSystem) => {
      const notification = processLogToNotification(log, true);

      setNotifications((prev) => {
        const newNotifications = [notification, ...prev];
        return newNotifications.slice(0, 50);
      });
    },
    [processLogToNotification]
  );

  // Hook do WebSocket
  const { isConnected, error } = useLogWebSocket(
    {
      url: websocketUrl,
      namespace: 'logs',
      autoConnect: WEBSOCKET_ENABLED, // Desabilitado temporariamente
      reconnection: WEBSOCKET_ENABLED,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    },
    handleNewLog,
    handleErrorLog
  );

  // Marcar notificação como lida
  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  // Limpar todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remover uma notificação específica
  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Alternar status de lida/não lida
  const toggleReadStatus = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  }, []);

  // Filtrar por tipo
  const filterByType = useCallback(
    (type: LogNotification['type'] | 'all') => {
      if (type === 'all') return notifications;
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  // Filtrar não lidas
  const filterUnread = useCallback(() => {
    return notifications.filter((n) => !n.read);
  }, [notifications]);

  // Buscar notificações
  const searchNotifications = useCallback(
    (query: string) => {
      if (!query.trim()) return notifications;
      const term = query.toLowerCase();
      return notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.message.toLowerCase().includes(term) ||
          n.logData.endpoint_name?.toLowerCase().includes(term) ||
          n.logData.action_page?.toLowerCase().includes(term) ||
          n.logData.table_name?.toLowerCase().includes(term)
      );
    },
    [notifications]
  );

  // Calcular notificações não lidas
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Salvar notificações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }, [notifications]);

  // Carregar notificações do localStorage na inicialização
  useEffect(() => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        error,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification,
        toggleReadStatus,
        filterByType,
        filterUnread,
        searchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar o contexto de notificações
 */
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications deve ser usado dentro de um NotificationProvider'
    );
  }

  return context;
}
