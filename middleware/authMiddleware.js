// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (handler) => async (req, res) => {
    try {
        // Ambil token dari cookie atau header Authorization
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verifikasi token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Setel user pada objek permintaan untuk digunakan di handler berikutnya
        return handler(req, res);
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;
