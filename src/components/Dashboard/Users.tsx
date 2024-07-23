// Import necessary modules
import React from "react";
import TableAttendance from "../Tables/TableAttendance";
// import DataStatsOne from "@/components/DataStats/DataStatsOne";
import Link from "next/link"; // Import Link from Next.js for navigation

// ClockCard component
const ClockCard = () => {
  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Jakarta",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Jam Sekarang di Bogor</h2>
      <div className="text-4xl font-bold text-center text-blue-500">{currentTime}</div>
    </div>
  );
};

// Dashboard component
const Dashboard: React.FC = () => {
  return (
    <>
      {/* <DataStatsOne /> */}

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* Clock Card */}
        <div className="col-span-12 xl:col-span-12">
          <ClockCard />
        </div>

        {/* Button for Attendance */}
        <div className="col-span-12 xl:col-span-12 flex justify-center mt-6">
          <Link href="/attendance">
            <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
              Absen Sekarang
            </div>
          </Link>
        </div>

        {/* Table Attendance */}
        <div className="col-span-12 xl:col-span-12">
          <TableAttendance />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
