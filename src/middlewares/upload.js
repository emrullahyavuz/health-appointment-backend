const multer = require("multer")
const path = require("path")

// Yüklenen dosyaların kaydedileceği klasör
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/avatars"))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  },
})

// Sadece resim dosyalarına izin ver
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Sadece resim dosyaları yüklenebilir!"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
})

module.exports = upload 