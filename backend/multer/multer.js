const multer = require("multer");

const idPicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/idProof");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const idUpload = multer({ storage: idPicStorage });

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/profilePic");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const profilePicUpload = multer({ storage: profilePicStorage });

const propertyImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/propertyImg");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const propertyImgUpload = multer({ storage: propertyImgStorage });

module.exports = { idUpload, profilePicUpload, propertyImgUpload };
