import rateLimit from 'express-rate-limit';

const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MIN || '15', 10);
const maxReq = parseInt(process.env.RATE_LIMIT_MAX_REQ || '100', 10);

export const apiLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxReq,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});