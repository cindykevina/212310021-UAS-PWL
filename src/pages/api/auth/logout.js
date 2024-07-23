import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  try {
    // console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
    req.session.destroy();
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "user-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});