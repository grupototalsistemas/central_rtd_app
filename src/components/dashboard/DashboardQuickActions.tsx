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
          className="block rounded-xl border border-gray-200 px-4 py-3 transition hover:border-brand-500/40 hover:bg-brand-50/40 dark:border-gray-800 dark:hover:bg-brand-500/10"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-white/90">
            {action.label}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {action.description}
          </p>
        </Link>
      ))}
    </div>
  );
}