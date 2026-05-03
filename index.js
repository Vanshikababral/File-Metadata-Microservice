var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer = require('multer');

var app = express();

// Use the exact CORS config recommended for freeCodeCamp compatibility
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Wrapping multer in the route handler as recommended to ensure errors are caught
app.post('/api/fileanalyse', (req, res) => {
  upload.single('upfile')(req, res, (err) => {
    if (err) {
      return res.json({ error: 'Multer error occurred during upload' });
    }
    const file = req.file;
    if (!file) {
      return res.json({ error: 'Please upload a file' });
    }

    res.json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
