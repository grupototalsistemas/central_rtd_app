interface DashboardProgressItem {
  title: string;
  subtitle: string;
  value: string;
}

interface DashboardProgressListProps {
  items: DashboardProgressItem[];
}

export default function DashboardProgressList({
  items,
}: DashboardProgressListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.subtitle}`}
          className="dashboard-card-soft flex items-center justify-between px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-(--cor-texto) dark:text-(--dark-cor-texto)">
              {item.title}
            </p>
            <p className="notification-dropdown-muted-text text-xs">{item.subtitle}</p>
          </div>
          <span className="text-sm font-semibold text-(--cor-texto) dark:text-(--dark-cor-texto)">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}