import { withIronSession } from 'next-iron-session';
import authMiddleware from '../../../../middleware/authMiddleware';
import User from '../../../../lib/models/User';
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch a single user by ID
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] } // Exclude password from the response
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    // Update a user by ID
    const { nama, email, no_telp, password, roleid } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.nama = nama;
      user.email = email;
      user.no_telp = no_telp;
      user.roleid = roleid;
      if (password) {
        user.password = await bcrypt.hash(password, 10); // Hash the password before saving
      }
      await user.save();
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a user by ID
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default withIronSession(authMiddleware(handler), {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'user-session',
});
