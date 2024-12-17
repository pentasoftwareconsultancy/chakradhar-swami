const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    mobile: {type: String, unique: true},
    password: String,
},{
    collection: "UserInfo"
});
module.exports = mongoose.model("UserInfo",UserDetailSchema);