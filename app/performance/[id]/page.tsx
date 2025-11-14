import RatingOverTime from "@/app/components/RatingOverTime";
import CancelOverTime from "@/app/components/CancleOverTime";
import UserAnalyticsBar from "@/app/components/UserAnalyticsBar";
import PerformanceChart from "@/app/components/PerformanceChart";

export default async function Page({
  params,
}: {
  params: Promise<{ id : string }>;
}) {
  const { id } = await params;
  //fetch name from id ??
  return (
    <div className="flex flex-col  bg-white overflow-hidden h-vh">
      <div className="flex" >
        <UserAnalyticsBar name={id} role="Driver" />
      </div>
      <div className="flex h-full">
        <PerformanceChart driverId={id} />
      </div>
    </div>
  );
};
