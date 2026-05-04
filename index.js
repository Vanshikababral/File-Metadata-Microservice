var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');

var app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Standard FCC CORS config
app.use(cors());
app.use('/public', express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

const upload = multer({ storage: multer.memoryStorage() });

// Placing the upload route BEFORE any other body parsing middleware
// to ensure multer has full control over the multipart stream.
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: 'No file uploaded' });
    }
    
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other middlewares moved below the file upload route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
