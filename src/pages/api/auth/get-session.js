import { withIronSession } from 'next-iron-session';

export default withIronSession(async (req, res) => {
  if (req.method === 'GET') {
    // jwtMiddleware(req, res, async () => {
      const user = req.session.get('user') || null;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      return res.status(200).json({ user });
    // })
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}, {
  password: process.env.SECRET_COOKIE_PASSWORD, 
  cookieName: 'user-session',
});