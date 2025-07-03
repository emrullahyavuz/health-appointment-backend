const helmet = require("helmet");

// Helmet güvenlik ayarları
const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
});

module.exports = helmetConfig;
