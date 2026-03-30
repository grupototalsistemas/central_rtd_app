interface DashboardMetricCardProps {
  title: string;
  value: string;
  helperText?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

const trendClassMap = {
  up: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  down: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

export default function DashboardMetricCard({
  title,
  value,
  helperText,
  trend = "neutral",
  trendLabel,
}: DashboardMetricCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </h3>
        {trendLabel ? (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${trendClassMap[trend]}`}
          >
            {trendLabel}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </article>
  );
}