const Document = require('./schema');
const path = 'uploads/docs/';
const fs = require('fs');

exports.uploadOne = function (req, res) {
  let doc = new Document({
    documentName: req.body.fileName,
    author: req.body.author,
    createdBy: req.body.createdBy,
    path: path,
    paragraphs: req.body.paragraphs,
    content: req.body.content
  });

  doc.save(function (err) {
    if (err) {
      console.log(err)
      res.send(err);
    } else {
      res.send('Doc Inserted successfully');
    }  
  });
};

// TODO: Upload many???

exports.readAll = function (req, res) {
  let filter = req.query.terms ? {$text: {$search: req.query.terms}} : {}
  Document.find(filter, function (err, dat) {
    if (err) {
      console.log(err);
    } else {
      res.send(dat)
    }
  })
};

exports.readOne = function (req, res) {
  // res.setHeader('content-type', 'application/pdf;base64');
  // fs.createReadStream(path + req.params.fileName).pipe(res);
  let filter = {
    _id: req.params.id
  }
  console.log('filter' + filter);
  Document.findOne(filter, function (err, dat) {
    if (err) {
      console.log(err);
    } else {
      res.send(dat)
    }
  });
};
