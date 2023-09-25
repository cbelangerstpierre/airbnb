const mongoose = require("mongoose");
const House = require("./Schemas/HouseSchema");
const { GridFSBucket, GridFSBucketReadStream, ObjectId } = require("mongodb");
const crypto = require('crypto');
require('dotenv').config();
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

let gfs = null;
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
      gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
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
      const uploadResult = await s3.upload(params).promise();
      fileIds.push(uploadResult.Key);

      fs.unlink(files[fileIndex].path, () => {
        uploadFile(fileIndex + 1);
      });
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  uploadFile(0);
};

const addHouse = async (req, res) => {
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

const generateRandomKey = () => {
  const randomString = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now().toString();
  return `${randomString}-${timestamp}`;
};

module.exports = {
  addHouse,
  uploadImages,
  getAllHouses,
};
