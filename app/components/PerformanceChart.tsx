import CancelOverTime from "./CancleOverTime";
import RatingOverTime from "./RatingOverTime";

interface PerformanceChartProps {
  driverId: string;
}

export default function PerformanceChart({ driverId }: PerformanceChartProps) {
  // Placeholder for chart rendering logic
  return (
    <div className="flex flex-col md:flex-row  mx-6 gap-6 h-full w-full overflow-x-hidden">
      <div className="flex-1 h-1/2 rounded-xl bg-[#F6F3F3] min-w-0 overflow-hidden">
        <RatingOverTime driverId={driverId} />
      </div>
      <div className="flex-1 h-1/2 rounded-xl bg-[#F5F3F3] min-w-0 overflow-hidden">
        <CancelOverTime driverId={driverId} />
      </div>
    </div>
  );
}
