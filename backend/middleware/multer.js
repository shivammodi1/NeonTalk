const multer = require("multer");
const fs = require("fs");

// ensure public folder exists
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
