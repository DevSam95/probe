const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DocumentSchema = new Schema({
  documentName: { type: String, required: true, default: 'sample' },
  author: { type: String, required: true, default: 'Unknown' },
  createdDate: { type: Date, required: true, default: Date.now },
  modifedDate: { type: Date },
  createdBy: { type: String, required: true },
  modifiedBy: { type: String },
  paragraphs: { type: Object },
  content: { type: String },
  path: { type: String, required: true, default: '/files/docs' }
});
DocumentSchema.index({'$**': 'text'});

let Paragraph = new Schema({
  paragraph: {type: String, required: true, default: ''}
});

module.exports = mongoose.model('Document', DocumentSchema, 'Documents');

