import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round();
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
export const upload = multer({ storage: storage });
