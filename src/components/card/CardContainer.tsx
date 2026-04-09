import { cn } from "@/utils/cn";

interface CardContainerProps {
  title: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

const columnVariants = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

export default function CardContainer({
  title,
  description,
  columns = 3,
  className,
  children,
}: CardContainerProps) {
  return (
    <section className={cn("dashboard-card-surface", className)}>
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-(--cor-texto) dark:text-(--dark-cor-texto)">
          {title}
        </h3>
        {description && (
          <p className="notification-dropdown-muted-text mt-1 text-sm">
            {description}
          </p>
        )}
      </div>

      <div className="rounded-b-2xl p-4 sm:p-6">
        <div className={cn("grid gap-4", columnVariants[columns])}>
          {children}
        </div>
      </div>
    </section>
  );
}