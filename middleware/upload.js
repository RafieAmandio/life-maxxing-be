const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const proofsDir = path.join(uploadDir, 'proofs');
const avatarsDir = path.join(uploadDir, 'avatars');

[uploadDir, proofsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for proof images
const proofStorage = multer.diskStorage({
  destination: proofsDir,
  filename: (req, file, cb) => {
    const uniqueName = `proof-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Storage configuration for avatar images
const avatarStorage = multer.diskStorage({
  destination: avatarsDir,
  filename: (req, file, cb) => {
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Multer configurations
const uploadProof = multer({
  storage: proofStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

module.exports = {
  uploadProof,
  uploadAvatar,
}; 