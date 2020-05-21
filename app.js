const express = require('express');
const multer = require('multer');
const cors = require('cors');
var app = express();

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage }).single('file')

app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

let server = app.listen(8000, () => {
  console.log('server listening');
});

module.exports = app;
