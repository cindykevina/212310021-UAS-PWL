// src/pages/api/attendance/index.js

import { withIronSession } from 'next-iron-session';
import Attendance from '../../../../lib/models/Attendance';
import User from '../../../../lib/models/User'; // Sesuaikan path dengan lokasi model User
import authMiddleware from '../../../../middleware/authMiddleware'; // Sesuaikan path dengan lokasi middleware authMiddleware
import { Op, literal } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import base64Img from 'base64-img';

const photosDirectory = path.join(process.cwd(), 'public', 'attendance-photos');

if (!fs.existsSync(photosDirectory)) {
  fs.mkdirSync(photosDirectory);
}

const handler = withIronSession(async (req, res) => {
  const { action } = req.query;

  if (req.method === 'POST' && action === 'checkin') {
    return handleCheckIn(req, res);
  } else if (req.method === 'PUT' && action === 'checkout') {
    return handleCheckOut(req, res);
  } else if (req.method === 'GET' && action === 'status') {
    return handleAttendanceStatus(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'user-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
  },
});

export default authMiddleware(handler);

async function handleCheckIn(req, res) {
  const { userId, longitude, latitude, photo } = req.body;

  try {
    const today = new Date();
    const existingAttendance = await Attendance.findOne({
      where: {
        userId,
        checkIn: {
          [Op.between]: [
            literal(`DATE('${today.toISOString().slice(0, 10)}')`),
            literal(`DATE('${today.toISOString().slice(0, 10)}') + INTERVAL 1 DAY - INTERVAL 1 SECOND`)
          ]
        }
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Anda sudah melakukan check-in hari ini' });
    }

    // Simpan foto check-in sebagai file JPEG menggunakan base64-img
    const photoFileName = `${userId}_checkin_${uuidv4()}`;
    const photoPath = path.join(photosDirectory, photoFileName);

    base64Img.img(photo, photosDirectory, photoFileName, async function(err, filepath) {
      if (err) {
        console.error('Error saat menyimpan foto:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan foto' });
      }

      // Menyimpan data kehadiran ke database
      const checkInTime = new Date();
      const attendance = await Attendance.create({
        userId,
        checkIn: checkInTime,
        checkInPhoto: photoFileName,
        longitude,
        latitude,
      });

      res.status(201).json({ message: 'Check-in berhasil', attendance });
    });

  } catch (error) {
    console.error('Error saat melakukan check-in:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat melakukan check-in' });
  }
}

async function handleCheckOut(req, res) {
  const { userId, photo } = req.body;

  try {
    const latestAttendance = await Attendance.findOne({
      where: {
        userId,
        checkOut: null,
      },
      order: [['checkIn', 'DESC']],
    });

    if (!latestAttendance) {
      return res.status(400).json({ message: 'Anda belum melakukan check-in hari ini' });
    }

    // Simpan foto check-out sebagai file JPEG menggunakan base64-img
    const photoFileName = `${userId}_checkout_${uuidv4()}`;
    const photoPath = path.join(photosDirectory, photoFileName);

    base64Img.img(photo, photosDirectory, photoFileName, async function(err, filepath) {
      if (err) {
        console.error('Error saat menyimpan foto:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan foto' });
      }

      // Memperbarui data kehadiran di database
      const checkOutTime = new Date();
      latestAttendance.checkOut = checkOutTime;
      latestAttendance.checkOutPhoto = photoFileName;
      await latestAttendance.save();

      res.json({ message: 'Check-out berhasil', attendance: latestAttendance });
    });

  } catch (error) {
    console.error('Error saat melakukan check-out:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat melakukan check-out' });
  }
}

async function handleAttendanceStatus(req, res) {
  const { userId } = req.query;

  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const existingAttendance = await Attendance.findOne({
      where: {
        userId,
        checkIn: {
          [Op.between]: [
            literal(`DATE('${startOfDay.toISOString().slice(0, 10)}')`),
            literal(`DATE('${endOfDay.toISOString().slice(0, 10)}') + INTERVAL 1 DAY - INTERVAL 1 SECOND`)
          ]
        }
      },
    });

    if (!existingAttendance) {
      res.json({ status: 'check-in' });
    } else if (!existingAttendance.checkOut) {
      res.json({ status: 'check-out' });
    } else {
      res.json({ status: 'complete' });
    }
  } catch (error) {
    console.error('Error saat memeriksa status kehadiran:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa status kehadiran' });
  }
}
