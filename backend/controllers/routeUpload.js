const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require("../middlewares/multer");

router.post('/upload', upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error",
            })
        }

        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result.secure_url // Return the secure URL
        })
    })

    // router.post('/uploads', upload.single('image'), async (req, res) => {
//   try {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       const newImage = new Image({ url: result.secure_url });
//       await newImage.save();
//       res.status(200).json({
//           success: true,
//           message: 'Image uploaded successfully!',
//           imageUrl: result.secure_url,
//       });
//   } catch (err) {
//       res.status(500).json({ message: 'Error uploading image', error: err });
//   }
// });

})

module.exports = router;