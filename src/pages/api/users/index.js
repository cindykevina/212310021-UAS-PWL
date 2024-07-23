import { withIronSession } from 'next-iron-session';
import authMiddleware from '../../../../middleware/authMiddleware';
import User from '../../../../lib/models/User';
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // Fetch all users without password
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Exclude password from the response
        where: { roleid: 2 } 
      }); 
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // Create a new user
    const { nama, email, no_telp, password, roleid } = req.body;
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({ nama, email, no_telp, password:hashedPassword, roleid });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default withIronSession(authMiddleware(handler), {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'user-session',
});
