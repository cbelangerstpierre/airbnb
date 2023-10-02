const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
const {
  addHouse,
  uploadImages,
  getAllHouses,
  Login,
  Signup,
  GetUser,
  DeleteUser,
  getHouse,
  getUser,
  getHousesByHostId,
  deleteHouse,
  editHouse,
} = require("./handlers");
const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

app
  .post("/api/upload-images", upload.array("files", 10), uploadImages)
  .post("/api/add-house", addHouse)
  .get("/api/get-all-houses", getAllHouses)
  .post("/api/login", Login)
  .post("/api/signup", Signup)
  .get("/api/get-user/:id", GetUser)
  .delete("/api/delete-user", DeleteUser)
  .get("/api/house/:id", getHouse)
  .get("/api/user/:id", getUser)
  .get("/api/houses/:id", getHousesByHostId)
  .delete("/api/house/:id", deleteHouse)
  .patch("/api/edit-house/:id", upload.array("files", 10), editHouse);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
// const listingsRouter = require('./routes/listings');
// app.use('/api/listings', listingsRouter);
