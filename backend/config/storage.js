const multer = require("multer");
const path = require("path");

const storage =
  process.env.NODE_ENV === "production"
    ? // Production storage (implement cloud storage here)
      multer.memoryStorage()
    : // Development storage (local filesystem)
      multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, "../uploads/"));
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        },
      });

const upload = multer({ storage: storage });

module.exports = upload;
