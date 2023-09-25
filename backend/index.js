const express = require("express");
var bodyParser = require("body-parser");
const { addHouse, uploadImages, getImage } = require("./handlers");
const app = express();
app.set("view engine", "ejs");
var multer = require("multer");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/upload-images", upload.array("files", 10), uploadImages);
app.post("/api/add-house", addHouse);
app.get('/api/image/:id', getImage);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
// const listingsRouter = require('./routes/listings');
// app.use('/api/listings', listingsRouter);
