'use client';

import CompanySwitchLoading from '@/components/loading/CompanySwitchLoading';
import { CompanySwitchProvider } from '@/context/CompanySwitchContext';
import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import { RootState } from '@/store/rootReducer';
import { fetchEmpresas } from '@/store/slices/empresasUsuarioSlice';
import { AppDispatch } from '@/store/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const dispatch = useDispatch<AppDispatch>();
  const { pessoa_usuario, logado } = useSelector(
    (state: RootState) => state.usuario
  );

  useEffect(() => {
    if (logado && pessoa_usuario?.id_pessoa_usuario) {
      dispatch(fetchEmpresas(pessoa_usuario.id_pessoa_usuario));
    }
  }, [dispatch, logado, pessoa_usuario?.id_pessoa_usuario]);

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <CompanySwitchProvider>
      <div className="module relative max-h-screen min-h-screen max-w-full">
        <CompanySwitchLoading />
        <AppSidebar />

        <div
          className={`module flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="mx-auto w-full p-4 md:p-6">{children}</div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </CompanySwitchProvider>
  );
}