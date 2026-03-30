import ComponentCard from "@/components/common/ComponentCard";
import DashboardCartorioEntriesBarChart from "@/components/dashboard/DashboardCartorioEntriesBarChart";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";

const metrics = [
  {
    title: "Entradas no dia",
    value: "128",
    trend: "up" as const,
    trendLabel: "+12%",
    helperText: "Total consolidado de entradas no dia atual",
  },
  {
    title: "Entradas de balcao",
    value: "74",
    trend: "up" as const,
    trendLabel: "+8%",
    helperText: "Entradas registradas manualmente no balcao",
  },
  {
    title: "Entradas eletronicas",
    value: "54",
    trend: "neutral" as const,
    trendLabel: "Estavel",
    helperText: "Entradas recebidas por integracao eletronica",
  },
];

const entriesByCartorio = [
  {
    cartorio: "1o Cartorio Central",
    balcao: 18,
    eletronico: 12,
  },
  {
    cartorio: "2o Cartorio Centro Sul",
    balcao: 23,
    eletronico: 15,
  },
  {
    cartorio: "Cartorio Norte",
    balcao: 12,
    eletronico: 9,
  },
  {
    cartorio: "Cartorio Leste",
    balcao: 10,
    eletronico: 7,
  },
  {
    cartorio: "Cartorio Oeste",
    balcao: 11,
    eletronico: 11,
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visao geral operacional com indicadores principais e atalhos rapidos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            helperText={metric.helperText}
            trend={metric.trend}
            trendLabel={metric.trendLabel}
          />
        ))}
      </div>

      <ComponentCard
        title="Entradas por cartorio"
        desc="Comparativo de entradas por balcao e eletronico em cada cartorio"
      >
        <DashboardCartorioEntriesBarChart data={entriesByCartorio} />
      </ComponentCard>
    </section>
  );
}