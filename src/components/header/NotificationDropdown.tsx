'use client';
import { useNotifications } from '@/context/NotificationContext';
import AppNotification from '@/types/notification.type';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    // notifications,
    // unreadCount,
    // isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();
  // console.log('Rerender NotificationDropdown: ', {
  //   notifications,
  //   unreadCount,
  //   isConnected,
  // });

  const isConnected = false; // Placeholder para o estado de conexão

  const unreadCount = 0; // Placeholder para a contagem de notificações não lidas

  const notifications: AppNotification[] = [];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
  };

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return '📋';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'agora';
    }
  };
  return (
    <div className="relative">
      <button
        className="dropdown-toggle header-button relative flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        onClick={handleClick}
        title={`${unreadCount} notificações não lidas`}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-(--cor-button-hover) text-xs font-bold text-(--texto-accento) dark:bg-(--dark-cor-button-hover) dark:text-(--dark-texto-button)">
            {unreadCount > 9 ? '9+' : unreadCount}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--cor-button-hover) opacity-75 dark:bg-(--dark-cor-button-hover)"></span>
          </span>
        )}
        {/* {!isConnected && (
          <span
            className="absolute -right-1 -bottom-1 z-10 h-2 w-2 rounded-full bg-red-500"
            title="Desconectado do servidor"
          />
        )} */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="notification-dropdown absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col p-3 sm:w-[361px] lg:right-0"
      >
        <div className="mb-3 flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-(--cor-texto) dark:text-(--dark-cor-texto)">
              Notificações
            </h5>
            {unreadCount > 0 && (
              <span className="rounded-full bg-(--cor-button-hover) px-2 py-0.5 text-xs font-bold text-(--texto-accento) dark:bg-(--dark-cor-button-hover) dark:text-(--dark-texto-button)">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="notification-dropdown-muted-text text-xs transition-colors hover:text-(--cor-button-hover) dark:hover:text-(--dark-cor-button-hover)"
                title="Marcar todas como lidas"
              >
                Marcar todas
              </button>
            )}
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle notification-dropdown-icon-button transition"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul className="custom-scrollbar flex h-auto flex-col overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification.id}>
                <DropdownItem
                  onItemClick={() => handleNotificationClick(notification.id)}
                  className={`notification-item ${
                    !notification.read
                      ? 'notification-item-unread'
                      : 'notification-item-read'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition-colors ${
                      !notification.read
                        ? 'bg-(--cor-edit) text-(--titulos) dark:bg-(--dark-background) dark:text-(--dark-titulos)'
                        : 'bg-(--cor-card) text-(--cor-texto) dark:bg-(--dark-background) dark:text-(--dark-cor-texto)'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </span>

                  <span className="block flex-1">
                    <span className="text-theme-sm mb-1.5 flex items-start justify-between gap-2">
                      <span className="font-medium text-(--cor-texto) transition-colors dark:text-(--dark-cor-texto)">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-(--titulos) dark:bg-(--dark-titulos)"></span>
                      )}
                    </span>

                    <p
                      className={`text-theme-xs mb-2 transition-colors ${
                        !notification.read
                          ? 'text-(--cor-texto) dark:text-(--dark-cor-texto)'
                          : 'notification-dropdown-muted-text'
                      }`}
                    >
                      {notification.message}
                    </p>

                    <span className="notification-dropdown-muted-text text-theme-xs flex items-center gap-2">
                      {notification.logData.endpoint_name && (
                        <>
                          <span className="font-medium">
                            {notification.logData.endpoint_name}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-(--cor-borda) dark:bg-(--dark-cor-borda)"></span>
                        </>
                      )}
                      <span>{formatTimestamp(notification.timestamp)}</span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          ) : (
            <li className="notification-dropdown-muted-text flex flex-col items-center justify-center py-8 text-center">
              <svg
                className="mb-2 h-12 w-12 text-(--cor-borda) dark:text-(--dark-cor-borda)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p>Nenhuma notificação</p>
            </li>
          )}
        </ul>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              closeDropdown();
              router.push('/notificacoes');
            }}
            className="notification-dropdown-footer-button mt-3 w-full px-4 py-2.5 text-center text-sm font-medium"
          >
            Visualizar todas as notificações
          </button>
        )}
      </Dropdown>
    </div>
  );
}
