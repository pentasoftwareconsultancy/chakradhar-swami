const cloudinary = require('cloudinary').v2;

cloudinary.config({

    cloud_name: "dscncrxmu",
    api_key: "317585165981699",
    api_secret: "rS0qVdJOqjAnGt3snlrQjRs4VbA"

});

module.exports = cloudinary;