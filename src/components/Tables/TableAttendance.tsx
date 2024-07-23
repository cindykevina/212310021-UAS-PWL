import React, { useEffect, useState } from "react";
import axios from "axios";
import { Attendance } from "@/types/attendance";
import Link from 'next/link';

const TableAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const sessionResponse = await axios.get("/api/auth/get-session");
        const token = sessionResponse.data.user.token;

        const attendanceResponse = await axios.get("/api/attendance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAttendanceData(attendanceResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch attendance data");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (!confirmation) {
      return;
    }

    try {
      const sessionResponse = await axios.get("/api/auth/get-session");
      const token = sessionResponse.data.user.token;

      await axios.delete(`/api/attendance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAttendanceData(attendanceData.filter((attendance) => attendance.id !== id));
    } catch (error) {
      setError("Failed to delete attendance record");
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const generateGoogleMapsLink = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  const formatDate = (datetime: string | null) => {
    if (!datetime) {
      return 'Belum ada'; // Menampilkan "Belum ada" jika datetime null atau undefined
    }
    
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  const handleExportExcel = async () => {
    try {
      const sessionResponse = await axios.get("/api/auth/get-session");
      const token = sessionResponse.data.user.token;

      const response = await axios.get("/api/attendance/export-excel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Mendapatkan response dalam bentuk blob
      });

      // Menghasilkan link untuk mengunduh file Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.xlsx');
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      setError("Failed to export attendance data");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Export to Excel
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                No.
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Nama
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Foto CheckIn
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Foto CheckOut
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Waktu Masuk
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Waktu Pulang
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Lokasi
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((attendance, index) => (    
              <tr key={attendance.id} className={`${index % 2 === 0 ? 'bg-gray-100 dark:bg-dark-3' : 'bg-white dark:bg-gray-dark'}`}>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 border-b`}>
                  {index + 1}
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 border-b`}>
                  <h5 className="text-dark dark:text-white">{attendance.User.nama}</h5>
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 border-b`}>
                  <img
                    src={`/attendance-photos/${attendance.checkInPhoto}.png`}
                    alt="CheckIn"
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                    onClick={() => handlePhotoClick(`/attendance-photos/${attendance.checkInPhoto}.png`)}
                  />
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 border-b`}>
                  {attendance.checkOutPhoto ? (
                    <img
                      src={`/attendance-photos/${attendance.checkOutPhoto}.png`}
                      alt="CheckOut"
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                      onClick={() => handlePhotoClick(`/attendance-photos/${attendance.checkOutPhoto}.png`)}
                    />
                  ) : (
                    <span className="text-gray-400">Belum ada</span>
                  )}
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 border-b text-right`}>
                  <p className="text-dark dark:text-white">{formatDate(attendance.checkIn)}</p>
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 border-b text-right`}>
                  <p className="text-dark dark:text-white">{formatDate(attendance.checkOut)}</p>
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 border-b`}>
                  <div className="flex items-center justify-end space-x-3.5">
                    <Link href={generateGoogleMapsLink(attendance.latitude, attendance.longitude)}>
                      <button className="hover:text-primary">
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          />
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPhoto && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" onClick={handleCloseModal}></div>
          <div className="relative z-10 bg-white p-4 md:p-7.5 max-h-[80vh] max-w-[90vw] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedPhoto}
              alt="Attendance Photo"
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAttendance;
