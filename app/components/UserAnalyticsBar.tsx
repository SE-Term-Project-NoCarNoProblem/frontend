
//receive user name and role
interface UserAnalyticsBarProps {
  name: string;
  role: string;
}

export default function UserAnalyticsBar({
  name,
  role,
}: UserAnalyticsBarProps) {
  return (
    <div className="flex flex-col rounded-xl bg-[#F5F3F3] m-6 w-full">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-left ml-10 text-[#0E4663] my-4">
        User Analytics: {name}
      </h1>
      <h2 className="text-md md:text-lg lg:text-xl font-bold text-left ml-10 text-[#0E4663] mb-4">
        Role: {role}
      </h2>
   </div>
  );
};
