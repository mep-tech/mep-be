import * as multer from 'multer';

const storage = multer.diskStorage({
  filename: (req: any, file: any, cb: any) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb({ message: 'unsupported file format', statusCode: 400 }, false);
  }
};

const multerOptions = {
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
};

export { multerOptions };
