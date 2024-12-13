const fs = require('fs');
const path = require('path');
const MulterConfig = require('../configs/multer.config');

class UploadService {
  constructor() {
    this.multerConfig = new MulterConfig();
  }

  uploadFile(req, res, next) {
    const upload = this.multerConfig.createUpload();
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }

  static deleteFile(filePath) {
    const fullFilePath = path.join(__dirname, '..', filePath);

    return new Promise((resolve, reject) => {
      fs.access(fullFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject('File not found');
        } else {
          fs.unlink(fullFilePath, (err) => {
            if (err) {
              reject('Failed to delete file');
            } else {
              resolve(`File ${filePath} has been deleted`);
            }
          });
        }
      });
    });
  }
}

module.exports = UploadService;
