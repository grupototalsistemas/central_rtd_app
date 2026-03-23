type LoadingScreenProps = {
  centerWithPadding?: boolean;
  active?: boolean;
  text?: string;
  isFullScreen?: boolean;
};

const LoadingScreen = ({ centerWithPadding = true, active = true, text, isFullScreen = true }: LoadingScreenProps) => {
  const containerClasses = isFullScreen
    ? "fixed inset-0 z-900 flex items-center justify-center bg-[var(--background)]/90 transition-colors dark:bg-[var(--dark-background)]/90"
    : "flex h-full w-full items-center justify-center transition-colors ";

  return (
    <div className={`${!active && 'hidden'} ${centerWithPadding ? 'p-32' : ''}`}>
      <div className={`flex-col gap-2 ${containerClasses} `}>
        <div
          className="h-12 w-12 animate-spin rounded-full border-4
      border-[var(--cor-button-hover)] border-t-transparent
      dark:border-[var(--dark-cor-button-hover)] dark:border-t-transparent"
          role="status"
          aria-label="Carregando"
        >
          <span className="sr-only">Carregando {text && text}</span>
        </div>
        <span className=" text-[var(--cor-button-hover)] dark:text-[var(--dark-cor-button-hover)]">{text || 'Carregando'}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
