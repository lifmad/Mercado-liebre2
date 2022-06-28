const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/products'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_image_${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage});

module.exports = upload;