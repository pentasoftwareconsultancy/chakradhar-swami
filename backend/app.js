const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const uploadRoute = require('./controllers/routeUpload');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');
const smsRoutes = require("./routes/smsRoutes");


app.use(bodyParser.json());

// Routes
app.use('/admin', adminRoutes);
app.use("/api", smsRoutes);

const mongoUrl = "mongodb+srv://nexusctc2020:chakra@cluster0.dbvsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose
    .connect(mongoUrl)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((e)=>{
        console.log("Error: ",e);
    })


require("./UserDetails");
const User = mongoose.model("UserInfo");


app.get("/",(req,res) => {
    res.send({status: "started" });
})

app.post("/register", async(req, res) => {
    const {name, email, mobile, password} = req.body;

    const oldUser = await User.findOne({email: email});
    if (oldUser) {
        return res.send({data: "User already exists!!"})
    }

    const encryptPassword = await bcrypt.hash(password,10);

    try {
        await User.create({
            name: name,
            email: email,
            mobile, 
            password: encryptPassword,
        });
        res.send({status: "ok", data: "User Created"});
    } catch (error) {
        res.send({status: "error",data: error});
    }
});

app.post("/login-user", async(req, res) => {
    const {identifier, password} = req.body;
    // const {email, password} = req.body;

    try {
        // Find user by email or mobileNumber
        const oldUser = await User.findOne({
          $or: [{ email: identifier }, { mobile: identifier }],
        });

    // const oldUser = await User.findOne( {email: email} );

    if (!oldUser) {
        return res.status(400).json({ error: 'User not found' });
      }

    // if(!oldUser){
    //     return res.send({data: "User doesn't exits!!"})
    // }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: oldUser._id },  JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: oldUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

    // if(await bcrypt.compare(password, oldUser.password)) {
    //     const token = jwt.sign({email: oldUser.email}, JWT_SECRET);
    //     if (res.status(201)) {
    //         return res.send({status: "ok", data: token});
    //     } else {
    //         return res.send({ error: "error"});
    //     }
    // }
});

//to get data of user
app.post("/userdata", async(req, res) => {
    const {token} = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({email: useremail}).then((data) => {
            return res.send({ status: "Ok", data: data});
        })
    } catch(error) {
            return res.send({ error: error});
    }
})

//to update temples
app.put('/admin/update-temple/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTemple = req.body;
      await Temple.findByIdAndUpdate(id, updatedTemple, { new: true });
      res.status(200).send({ message: 'Temple updated successfully!' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to update temple.' });
    }
  });


// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service provider
  auth: {
      user: 'ankitasatdeve03@gmail.com',
      pass: 'aiogdsurncppotgs' // Use environment variables for security
  },
});

// Endpoint to send an email
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); 

  const mailOptions = {
      from: 'ankitasatdeve03@gmail.com',
      to: to,
      subject: subject,
      text: text,
      text2: otp,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).send({ error: error.message });
      }
      res.status(200).send({ message: 'Email sent successfully', info });
  });
}); 

app.use("/api/users", uploadRoute);

const router = express.Router();
const Image = require('./models/Image'); // A MongoDB model for storing image URLs

// Fetch all uploaded images
router.get('/images', async (req, res) => {
    try {
        const images = await Image.find(); // Fetch all image URLs from the database
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching images', error: err });
    }
});

// app.get('/api/users/profile', async (req, res) => {
//   try {
//     const userId = req.query.userId; // Assuming you pass userId as a query parameter
//     const user = await User.findById(userId); // Fetch the user from MongoDB
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });


app.listen(5001,() => {
    console.log("NodeJS server has started...")
})

module.exports = app;