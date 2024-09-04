import multer from "multer";
import path from "path";

const uploadDir = path.join(__dirname, '../uploads');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where uploaded files will be stored
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Set the filename of the uploaded file
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export default storage;  