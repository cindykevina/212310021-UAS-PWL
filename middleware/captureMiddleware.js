import { json } from 'body-parser';

const captureMiddleware = (handler, limit = '5mb') => {
  return async (req, res) => {
    json({ limit })(req, res, (err) => {
      if (err) {
        return res.status(413).json({ message: 'Request entity too large' });
      }
      return handler(req, res);
    });
  };
};

export default captureMiddleware;
