const multer = require('multer');
// const path = require('path');

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, 'uploads/'); // Save files to 'uploads' directory
    // },
    filename: function (req, file, cb) {
        // cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });
module.exports = upload;