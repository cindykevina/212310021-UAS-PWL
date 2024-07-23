// src/pages/api/attendance/index.js

import { withIronSession } from 'next-iron-session';
import Attendance from '../../../../lib/models/Attendance';
import User from '../../../../lib/models/User'; // Sesuaikan path dengan lokasi model User
import authMiddleware from '../../../../middleware/authMiddleware'; // Sesuaikan path dengan lokasi middleware authMiddleware

const handler = withIronSession(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Ambil data dari session
        const sessionUser = req.session.get('user');
        console.log(sessionUser);
        if (!sessionUser || !sessionUser.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const userId = sessionUser.id;

        let attendanceData;

        if (sessionUser.role === 'admin') {
            // Admin dapat melihat semua absensi dengan nama pengguna terkait
            attendanceData = await Attendance.findAll({
                include: {
                    model: User,
                    attributes: ['nama'] // Pilih atribut yang ingin ditampilkan dari model User
                }
            });
        } else if (sessionUser.role === 'karyawan') {
            // Karyawan hanya dapat melihat absensi mereka sendiri dengan nama pengguna terkait
            attendanceData = await Attendance.findAll({
                where: {
                    userId: userId,
                },
                include: {
                    model: User,
                    attributes: ['nama'] // Pilih atribut yang ingin ditampilkan dari model User
                }
            });
        } else {
            // Handle case jika role tidak dikenali
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Kirim response dengan data absensi yang sesuai
        return res.status(200).json(attendanceData);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'user-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
    },
});

export default authMiddleware(handler);
