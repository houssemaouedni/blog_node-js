const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images/article");
  },
  filename: (req, file, callback) => {
    var name = Math.floor(Math.random() * Math.floor(153235489746512));
    name += Math.floor(Math.random() * Math.floor(153235489746512));
    name += Math.floor(Math.random() * Math.floor(153235433123));
    name += Math.floor(Math.random() * Math.floor(1532879654746512));
    name += Math.floor(Math.random() * Math.floor(1532354898766512));
    name += Math.floor(Math.random() * Math.floor(99321345679746512));
    name += Date.now()+".";
    const extension = MIME_TYPES[file.mimetype];
    name += extension;
    callback(null, name);
  },
});

module.exports = multer({ storage }).single("image");
