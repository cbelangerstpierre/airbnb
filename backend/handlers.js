const mongoose = require("mongoose");
const House = require("./Schemas/HouseSchema");
const { GridFSBucket, GridFSBucketReadStream } = require("mongodb");
const crypto = require("crypto");
const User = require("./schemas/UserSchema.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
var fs = require("fs");
const AWS = require("aws-sdk");

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const MONGODB_SECRET_KEY = process.env.MONGODB_SECRET_KEY;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

async function connectToDatabase() {
  try {
    mongoose.connect(
      `mongodb+srv://cbelangerstpierre:${MONGODB_SECRET_KEY}@cluster0.fvtv0bw.mongodb.net/airbnb`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    const conn = mongoose.connection;
    conn.once("open", () => {
      GridFSBucketReadStream.mongo = mongoose.mongo;
      new GridFSBucket(conn.db, { bucketName: "uploads" });
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

connectToDatabase();

const uploadImages = async (req, res) => {
  const files = req.files;
  const fileIds = [];

  const uploadFile = async (fileIndex) => {
    if (fileIndex >= files.length) {
      res.status(201).json({ keys: fileIds });
      return;
    }

    const filename = files[fileIndex].originalname;
    const randomKey = generateRandomKey();

    const params = {
      Bucket: "cbelangerstpierreairbnb",
      Key: `uploads/${randomKey}-${filename}`,
      Body: fs.createReadStream(files[fileIndex].path),
      ACL: "public-read",
      ContentType: files[fileIndex].mimetype,
      Metadata: {},
    };

    try {
      let uploadResult;
      if (null !== (uploadResult = await s3.upload(params).promise())) {
        fileIds.push(uploadResult.Key);
        fs.unlink(files[fileIndex].path, () => {
          uploadFile(fileIndex + 1);
        });
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  uploadFile(0);
};

const addHouse = async (req, res) => {
  console.log(req.body);
  try {
    const newHouse = new House({
      title: req.body.title,
      description: req.body.description,
      pricePerNight: req.body.pricePerNight,
      guests: req.body.guests,
      bedrooms: req.body.bedrooms,
      beds: req.body.beds,
      baths: req.body.baths,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      photos: req.body.photos,
      availabilities: req.body.availabilities,
      hostId: req.body.hostId,
    });

    await newHouse.save();

    res.json({ message: "House added successfully", house: newHouse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyHouses = async (req, res) => {
  let hostId = req.params.id;
  let houses = await getAllHouses(req, res);
  // TODO, check if I can do this, or if I should just copy paste
};

const getHouse = async (req, res) => {
  try {
    let houseId = req.params.id;
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    return res.json(house);
  } catch (error) {
    console.error("Error retrieving house:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Host not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error retrieving the user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const generateRandomKey = () => {
  const randomString = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  return `${randomString}-${timestamp}`;
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log("Password is correct");
      return res.status(200).json({
        message: "Login Successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          photo: user.photo,
          userCreatedDate: user.userCreatedDate,
          houses: user.houses,
        },
      });
    } else {
      console.log("Password is incorrect");
      return res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    return res.status(500).json({ errors: "Internal Server Error" });
  }
};

const Signup = async (req, res) => {
  try {
    const { fullName, email, password, photo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      photo,
      userCreatedDate: new Date(),
      houses: [],
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        photo: newUser.photo,
        userCreatedDate: newUser.userCreatedDate,
        houses: newUser.houses,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

const GetUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        userCreatedDate: user.userCreatedDate,
        houses: user.houses,
      },
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.body; // Get the user ID from the request body

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(500).json({ message: "Failed to delete account" });
    }

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadImages,
  addHouse,
  getAllHouses,
  Signup,
  Login,
  GetUser,
  DeleteUser,
  getMyHouses,
  getHouse,
  getUser,
};
