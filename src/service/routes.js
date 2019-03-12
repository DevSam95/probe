const express = require('express');
const router = express.Router();

const upload = require('./upload');
const probeController = require('./controller');

router.get('/readAll', probeController.readAll);
router.get('/readOne/:id', probeController.readOne);

router.post('/uploadDoc', upload.single('document'), probeController.uploadOne);
module.exports = router;
