const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ERROR_MESSAGES = require('./error-message.config');

class MulterConfig {
  constructor(uploadDir = path.join(__dirname, '..', 'uploads')) {
    this.uploadDir = uploadDir;
    this.initDirectory();
  }

  initDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  createUpload() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const filename = `${nameWithoutExt}${ext}`;
        cb(null, filename);
      },
    });

    return multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          return cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE.message));
        }
        cb(null, true);
      },
    }).single('image');
  }
}

module.exports = MulterConfig;
