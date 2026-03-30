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
          className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white/90">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}