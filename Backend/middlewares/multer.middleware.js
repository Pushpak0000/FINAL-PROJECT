import multer from "multer";
import fs from 'fs';
import path from 'path';


const uploadDir = path.resolve('./public/uploads');

// Check if the directory exists, if not, create it
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created:', uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log(fileName);
    
     cb(null, fileName)
  }
})

export const upload = multer({ storage })