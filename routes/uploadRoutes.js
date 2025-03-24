const express = require('express');
const upload = require('../middleware/upload');
const validateCSV = require('../middleware/validateCSV');
const { uploadCSV, generateOutputCSV } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', upload.single('file'), validateCSV, uploadCSV);
router.get('/:requestId', generateOutputCSV);



module.exports = router;
