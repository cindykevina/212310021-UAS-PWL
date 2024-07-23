"use client";
import React, { useRef, useState, useEffect } from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

const AttendancePage = () => {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [userId, setUserId] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('check-in'); // Status awal, default check-in
  const [token, setToken] = useState(null); // State untuk menyimpan token

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/get-session');
        if (response.ok) {
          const data = await response.json();
          const userToken = data.user.token; // Ambil token dari respons
          setToken(userToken); // Simpan token ke dalam state
          setUserId(data.user.id);
          fetchAttendanceStatus(data.user.id, userToken); // Panggil status kehadiran dengan token
        } else {
          console.error('Failed to fetch user session');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    fetchUserId();
  }, []);

  const fetchAttendanceStatus = async (userId: any, token: any) => {
    try {
      const response = await fetch(`/api/attendance/take-attendance?action=status&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceStatus(data.status); // Atur status berdasarkan respons
      } else {
        console.error('Failed to fetch attendance status');
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    }
  };

  const handleTakePhoto = async (dataUri: string | React.SetStateAction<null>) => {
    setPhoto(dataUri);

    try {
      const compressedDataUri = await compressImage(dataUri);
      setCompressedPhoto(compressedDataUri);
    } catch (error) {
      console.error('Error compressing photo:', error);
    }
  };

  const compressImage = async (dataUri) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const file = dataURItoBlob(dataUri);
      const compressedFile = await imageCompression(file, options);
      return blobToDataURI(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const blobToDataURI = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmitCheckIn = async () => {
    if (attendanceStatus !== 'check-in') {
      console.error('Cannot perform check-in. Attendance status is:', attendanceStatus);
      return;
    }

    const formData = {
      userId,
      photo: compressedPhoto,
      longitude,
      latitude,
    };

    try {
      const response = await fetch('/api/attendance/take-attendance?action=checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Check-in berhasil:', data);
        setAttendanceStatus('check-out'); // Setelah check-in berhasil, atur status ke check-out
        router.push('/dashboard');
      } else {
        console.error('Gagal melakukan check-in');
      }
    } catch (error) {
      console.error('Error saat melakukan check-in:', error);
    } finally {
      setPhoto(null);
      setLongitude(null);
      setLatitude(null);
    }
  };

  const handleSubmitCheckOut = async () => {
    if (attendanceStatus !== 'check-out') {
      console.error('Cannot perform check-out. Attendance status is:', attendanceStatus);
      return;
    }

    const formData = {
      userId,
      photo: compressedPhoto, // Kirim foto juga saat check-out
      longitude,
      latitude,
    };

    try {
      const response = await fetch('/api/attendance/take-attendance?action=checkout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Check-out berhasil:', data);
        setAttendanceStatus('check-in'); // Setelah check-out berhasil, atur status kembali ke check-in
        router.push('/dashboard');
      } else {
        console.error('Gagal melakukan check-out');
      }
    } catch (error) {
      console.error('Error saat melakukan check-out:', error);
    } finally {
      setPhoto(null);
      setLongitude(null);
      setLatitude(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-8">Attendance</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <Camera
          onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
          isImageMirror={true}
          isSilentMode={false}
          isDisplayStartCameraError={true}
          imageCompression={0.9}
          width={'100%'}
          idealFacingMode={FACING_MODES.USER}
          isMaxResolution={false}
          ref={cameraRef}
        />
        <div className="p-4">
          <button
            onClick={handleCaptureLocation}
            className="w-full mt-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Capture Location
          </button>
          {latitude !== null && longitude !== null && (
            <div className="mt-4">
              <label className="block mb-1">Longitude:</label>
              <input
                type="text"
                value={longitude || ''}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block mt-2 mb-1">Latitude:</label>
              <input
                type="text"
                value={latitude || ''}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {photo && (
            <img src={photo} alt="Captured" className="mt-4 rounded-lg shadow-md" />
          )}
          {attendanceStatus === 'check-in' && (
            <button
              type="button"
              onClick={handleSubmitCheckIn}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Check-in
            </button>
          )}
          {attendanceStatus === 'check-out' && (
            <button
              type="button"
              onClick={handleSubmitCheckOut}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Check-out
            </button>
          )}
          {attendanceStatus === 'complete' && (
            <p className="text-green-500 mt-4">Attendance complete for today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
