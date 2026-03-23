'use client';

import { LogSystem, WebSocketConfig } from '@/types/log-system.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseLogWebSocketReturn {
  isConnected: boolean;
  socket: Socket | null;
  error: string | null;
  connect: () => void;
  // disconnect: () => void;
}

/**
 * Hook customizado para gerenciar conexão WebSocket de logs
 * @param config Configuração da conexão WebSocket
 * @param onNewLog Callback executado quando um novo log é recebido
 * @param onErrorLog Callback executado quando um log de erro é recebido
 */
export function useLogWebSocket(
  config: WebSocketConfig,
  onNewLog?: (log: LogSystem) => void,
  onErrorLog?: (log: LogSystem) => void
): UseLogWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const onNewLogRef = useRef(onNewLog);
  const onErrorLogRef = useRef(onErrorLog);
  const hasInitialized = useRef(false);

  // Atualizar refs sem causar re-render
  useEffect(() => {
    onNewLogRef.current = onNewLog;
    onErrorLogRef.current = onErrorLog;
  });

  const connect = useCallback(() => {
    // Verificar se já existe socket (conectado ou não)
    if (socketRef.current) {
      console.log('WebSocket já existe, ignorando nova conexão');
      return;
    }

    try {
      const socketUrl = `${config.url}${config.namespace ? `/${config.namespace}` : ''}`;
      console.log('Conectando ao WebSocket em:', socketUrl);
      const socket = io(socketUrl, {
        autoConnect: config.autoConnect ?? true,
        reconnection: config.reconnection ?? true,
        reconnectionDelay: config.reconnectionDelay ?? 1000,
        reconnectionAttempts: config.reconnectionAttempts ?? 5,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('WebSocket conectado:', socket.id);
        setIsConnected(true);
        setError(null);
      });

      socket.on('disconnect', (reason) => {
        console.log('WebSocket desconectado:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('Erro de conexão WebSocket:', err.message);
        setError(`Erro de conexão: ${err.message}`);
        setIsConnected(false);
      });

      socket.on('new-log', (logData: LogSystem) => {
        console.log('Novo log recebido:', logData);
        onNewLogRef.current?.(logData);
      });

      socket.on('error-log', (logData: LogSystem) => {
        console.log('Log de erro recebido:', logData);
        onErrorLogRef.current?.(logData);
      });

      socketRef.current = socket;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao criar socket:', errorMessage);
      setError(errorMessage);
    }
  }, [
    config.url,
    config.namespace,
    config.autoConnect,
    config.reconnection,
    config.reconnectionDelay,
    config.reconnectionAttempts,
  ]);

  // const disconnect = useCallback(() => {
  //   if (socketRef.current) {
  //     console.log('Desconectando WebSocket...');
  //     socketRef.current.removeAllListeners();
  //     socketRef.current.disconnect();
  //     socketRef.current = null;
  //     setIsConnected(false);
  //   }
  // }, []);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (hasInitialized.current) {
      return;
    }

    if (config.autoConnect !== false) {
      hasInitialized.current = true;
      connect();
    }

    return () => {
      // disconnect();
    };
  }, []);

  return {
    isConnected,
    socket: socketRef.current,
    error,
    connect,
    // disconnect,
  };
}
