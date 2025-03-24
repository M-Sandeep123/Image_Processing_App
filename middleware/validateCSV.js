const csv = require('csv-parser');
const { Readable } = require('stream');

const REQUIRED_COLUMNS = ['S. No.', 'Product Name', 'Input Image Urls'];

const validateCSV = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  const fileBuffer = req.file.buffer.toString();
  const readableStream = Readable.from(fileBuffer);
  const parsedRows = [];
  let headerValidated = false;

  readableStream
    .pipe(csv())
    .on('headers', (headers) => {
      const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
      if (missingColumns.length > 0) {
        return res.status(400).json({ error: `Missing columns: ${missingColumns.join(', ')}` });
      }
      headerValidated = true;
    })
    .on('data', (row) => {
      if (!row['S. No.'] || !row['Product Name'] || !row['Input Image Urls']) {
        return res.status(400).json({ error: 'Invalid CSV format: Some required fields are missing' });
      }
      parsedRows.push(row);
    })
    .on('end', () => {
      if (!headerValidated) {
        return res.status(400).json({ error: 'CSV headers validation failed' });
      }
      req.parsedCSV = parsedRows;
      next();
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Error processing CSV file' });
    });
};

module.exports = validateCSV;
