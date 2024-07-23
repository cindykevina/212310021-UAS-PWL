import { withIronSession } from 'next-iron-session';
import Attendance from '../../../../lib/models/Attendance';
import User from '../../../../lib/models/User'; // Sesuaikan path dengan lokasi model User
import authMiddleware from '../../../../middleware/authMiddleware'; // Sesuaikan path dengan lokasi middleware authMiddleware
import exceljs from 'exceljs'; // Import exceljs atau pustaka serupa

const handler = withIronSession(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Ambil data dari session
        const sessionUser = req.session.get('user');
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

        // Buat file Excel dari data absensi
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // Header kolom
        worksheet.columns = [
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Nama', key: 'nama', width: 20 },
            { header: 'Waktu Masuk', key: 'checkIn', width: 30 },
            { header: 'Waktu Pulang', key: 'checkOut', width: 30 },
            { header: 'Foto CheckIn', key: 'checkInPhotoLink', width: 30 },
            { header: 'Foto CheckOut', key: 'checkOutPhotoLink', width: 30 },
            { header: 'Lokasi', key: 'locationLink', width: 30 },
        ];

        // Isi data absensi
        attendanceData.forEach((attendance, index) => {
            const checkInPhotoLink = `http://localhost:3000/attendance-photos/${attendance.checkInPhoto}.png`; // Path lengkap dari localhost
            const checkOutPhotoLink = `http://localhost:3000/attendance-photos/${attendance.checkOutPhoto}.png`; // Path lengkap dari localhost
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${attendance.latitude},${attendance.longitude}`;

            worksheet.addRow({
                no: index + 1,
                nama: attendance.User.nama,
                checkIn: attendance.checkIn,
                checkOut: attendance.checkOut,
                checkInPhotoLink: { text: 'Lihat Foto CheckIn', hyperlink: checkInPhotoLink },
                checkOutPhotoLink: { text: 'Lihat Foto CheckOut', hyperlink: checkOutPhotoLink },
                locationLink: { text: 'Lihat Lokasi', hyperlink: googleMapsLink },
                // Tambahkan data lain yang dibutuhkan
            });
        });

        // Menghasilkan nama file dengan waktu saat ini
        const currentDateTime = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, ''); // Format waktu yang sesuai dengan nama file
        const fileName = `attendance_${currentDateTime}.xlsx`;

        // Menghasilkan file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Mengirim file Excel sebagai respons
        await workbook.xlsx.write(res);
        return res.status(200).end();

    } catch (error) {
        console.error('Error exporting attendance data:', error);
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
