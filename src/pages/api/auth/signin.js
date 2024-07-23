import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../../../../lib/models/User'; // Pastikan path ke model User sesuai dengan struktur proyek Anda
import Roles from '../../../../lib/models/Roles'; // Pastikan path ke model Roles sesuai dengan struktur proyek Anda
import withSession from '../../../../lib/session';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email, termasuk Roles
    const user = await User.findOne({ 
      where: { email },
      include: Roles // Pastikan Roles diinclude di sini
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Bandingkan password yang dimasukkan dengan password di database
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email / Password Tidak Sesuai' });
    }

    // Generate JWT token
    const token = sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    // Simpan data user yang relevan di sesi
    req.session.set('user', { 
      id: user.id, 
      email: user.email,
      nama: user.nama,
      no_telp: user.no_telp,
      role: user.Role.name,
      token: token
    });
    await req.session.save();

    res.status(200).json({ message: 'Login successful.', user: { email: user.email, name: user.name }, token });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withSession(handler);
