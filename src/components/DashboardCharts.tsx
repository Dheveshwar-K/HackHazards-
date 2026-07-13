import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Radar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// Common Chart Options for Futuristic UI
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#94A3B8", // slate-400
        font: {
          family: "Space Grotesk",
          size: 10,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(4, 27, 45, 0.9)",
      titleFont: { family: "Orbitron" },
      bodyFont: { family: "JetBrains Mono" },
      borderColor: "rgba(0, 229, 255, 0.4)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0, 229, 255, 0.05)",
      },
      ticks: {
        color: "#94A3B8",
        font: { family: "Space Grotesk" },
      },
    },
    y: {
      grid: {
        color: "rgba(0, 229, 255, 0.05)",
      },
      ticks: {
        color: "#94A3B8",
        font: { family: "JetBrains Mono" },
      },
    },
  },
};

export const FishPopulationChart: React.FC = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Estimated Fish Biomass (Tons x 100)",
        data: [42, 45, 48, 55, 68, 72, 70, 64, 58, 52, 47, 44],
        fill: true,
        backgroundColor: "rgba(0, 229, 255, 0.08)",
        borderColor: "#00E5FF",
        pointBackgroundColor: "#00FF9D",
        pointBorderColor: "#041B2D",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Ocean Temperature Average (°C)",
        data: [14.2, 14.5, 15.1, 16.0, 17.5, 19.2, 20.5, 20.8, 19.4, 18.0, 16.2, 14.8],
        borderColor: "#FF8A00",
        pointBackgroundColor: "#FF8A00",
        tension: 0.3,
        borderWidth: 1.5,
        borderDash: [5, 5],
        yAxisID: "tempY",
      },
    ],
  };

  const options = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      tempY: {
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#FF8A00",
          font: { family: "JetBrains Mono" },
        },
      },
    },
  };

  return (
    <div className="w-full h-full relative p-2">
      <Line data={data} options={options as any} />
    </div>
  );
};

export const WaterQualityRadar: React.FC = () => {
  const data = {
    labels: [
      "Dissolved Oxygen",
      "pH Level",
      "Salinity Index",
      "Temperature Profile",
      "Chlorophyll Ratio",
      "Pollution Mitigation",
    ],
    datasets: [
      {
        label: "Current Ecosystem Index",
        data: [88, 92, 85, 78, 90, 82],
        backgroundColor: "rgba(0, 255, 157, 0.1)",
        borderColor: "#00FF9D",
        pointBackgroundColor: "#00FF9D",
        borderWidth: 2,
      },
      {
        label: "Baseline Safety Metric",
        data: [75, 80, 80, 85, 70, 75],
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        borderDash: [4, 4],
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: chartOptions.plugins,
    scales: {
      r: {
        angleLines: {
          color: "rgba(0, 229, 255, 0.1)",
        },
        grid: {
          color: "rgba(0, 229, 255, 0.1)",
        },
        pointLabels: {
          color: "#94A3B8",
          font: {
            family: "Space Grotesk",
            size: 9,
          },
        },
        ticks: {
          backdropColor: "transparent",
          color: "#94A3B8",
          font: { family: "JetBrains Mono" },
        },
      },
    },
  };

  return (
    <div className="w-full h-full relative p-2">
      <Radar data={data} options={radarOptions} />
    </div>
  );
};

export const SpeciesComposition: React.FC = () => {
  const data = {
    labels: ["Pelagic Finfish", "Demersal Cod", "Apex Predators", "Crustaceans", "Cetaceans"],
    datasets: [
      {
        data: [45, 25, 12, 15, 3],
        backgroundColor: [
          "rgba(0, 229, 255, 0.6)",
          "rgba(0, 255, 157, 0.6)",
          "rgba(255, 138, 0, 0.6)",
          "rgba(255, 59, 48, 0.6)",
          "rgba(255, 255, 255, 0.4)",
        ],
        borderColor: "#05070A",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#94A3B8",
          font: { family: "Space Grotesk", size: 9 },
        },
      },
      tooltip: chartOptions.plugins.tooltip,
    },
    cutout: "70%",
  };

  return (
    <div className="w-full h-full relative p-2">
      <Doughnut data={data} options={doughnutOptions as any} />
    </div>
  );
};
