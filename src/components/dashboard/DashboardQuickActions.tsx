import Link from "next/link";

interface DashboardQuickAction {
  label: string;
  description: string;
  href: string;
}

interface DashboardQuickActionsProps {
  actions: DashboardQuickAction[];
}

export default function DashboardQuickActions({
  actions,
}: DashboardQuickActionsProps) {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="dashboard-card-soft block px-4 py-3 hover:-translate-y-0.5 hover:bg-(--background) hover:shadow-theme-md dark:hover:bg-(--dark-foreground) dark:hover:shadow-theme-lg"
        >
          <p className="text-sm font-medium text-(--cor-texto) dark:text-(--dark-cor-texto)">
            {action.label}
          </p>
          <p className="notification-dropdown-muted-text mt-1 text-xs">
            {action.description}
          </p>
        </Link>
      ))}
    </div>
  );
}