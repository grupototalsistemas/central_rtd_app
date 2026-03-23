'use client';

import { useNotifications } from '@/context/NotificationContext';

/**
 * Componente de status de conexão WebSocket
 * Use este componente para monitorar o status da conexão em tempo real
 */
export function WebSocketStatus() {
  const { isConnected, error, notifications, unreadCount } = useNotifications();

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            WebSocket Status
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isConnected ? 'bg-red-600' : 'bg-red-300'
              }`}
            ></span>
            <span className="text-gray-600 dark:text-gray-400">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
        </div>

        <div className="border-l border-gray-200 pl-3 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {notifications.length}
            </span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-3 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-orange-500">
              {unreadCount}
            </span>
            <span className="text-xs text-gray-500">Não lidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
