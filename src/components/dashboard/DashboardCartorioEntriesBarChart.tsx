"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CartorioEntryData {
  cartorio: string;
  balcao: number;
  eletronico: number;
}

interface DashboardCartorioEntriesBarChartProps {
  data: CartorioEntryData[];
}

export default function DashboardCartorioEntriesBarChart({
  data,
}: DashboardCartorioEntriesBarChartProps) {
  const categories = data.map((item) => item.cartorio);
  const series = [
    {
      name: "Balcao",
      data: data.map((item) => item.balcao),
    },
    {
      name: "Eletronico",
      data: data.map((item) => item.eletronico),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#3b82f6", "#06b6d4"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "48%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      categories,
      labels: {
        rotate: -15,
      },
    },
    yaxis: {
      title: {
        text: "Quantidade de entradas",
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} entrada(s)`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
            },
          },
          xaxis: {
            labels: {
              rotate: 0,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="min-w-170">
        <ReactApexChart options={options} series={series} type="bar" height={340} />
      </div>
    </div>
  );
}