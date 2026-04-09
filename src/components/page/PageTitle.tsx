interface PageTitleProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </header> 
      {children}
    </section>
  );
}
