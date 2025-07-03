const rateLimit = require('express-rate-limit');

// 15 dakika içinde maksimum 100 istek
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için maksimum 100 istek
  message: {
    status: 429,
    message: 'Çok fazla istek yaptınız, lütfen daha sonra tekrar deneyin.'
  }
});

module.exports = limiter;