const { Request, Product, Image } = require('../models');
const Queue = require('bull');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const imageQueue = new Queue('image-processing', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const uploadCSV = async (req, res) => {
  try {
    const webhookUrl = req.body.webhookUrl || null;
    
    const request = await Request.create({ status: 'pending', webhookUrl });

    for (const row of req.parsedCSV) {
      const product = await Product.create({
        serialNumber: row['S. No.'],
        productName: row['Product Name'],
        requestId: request.id,
      });

      const imageUrls = row['Input Image Urls'].split(',').map(url => url.trim());
      for (const url of imageUrls) {
        const imageRecord = await Image.create({
          inputUrl: url,
          productId: product.id,
          status: 'pending',
        });
        imageQueue.add({
          imageId: imageRecord.id,
          inputUrl: url,
          productId: product.id,
          requestId: request.id
        });
      }
    }

    await request.update({ status: 'processing' });
    
    return res.status(200).json({
      message: 'CSV file processed successfully. Image processing queued.',
      requestId: request.id,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const generateOutputCSV = async (req, res) => {
  try {
    const { requestId } = req.params;
    const requestRecord = await Request.findByPk(requestId, {
      include: [
        {
          model: Product,
          as: 'products',
          include: [
            {
              model: Image,
              as: 'images'
            }
          ]
        }
      ]
    });

    if (!requestRecord) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const records = requestRecord.products.map(product => {
      const inputUrls = product.images.map(img => img.inputUrl).join(', ');
      const outputUrls = product.images.map(img => img.outputUrl || '').join(', ');
      return {
        serialNumber: product.serialNumber,
        productName: product.productName,
        inputImageUrls: inputUrls,
        outputImageUrls: outputUrls,
      };
    });

    const outputFilePath = path.join(__dirname, '..', 'output', `output_${requestId}.csv`);
    const fs = require('fs');
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [
        { id: 'serialNumber', title: 'S. No.' },
        { id: 'productName', title: 'Product Name' },
        { id: 'inputImageUrls', title: 'Input Image Urls' },
        { id: 'outputImageUrls', title: 'Output Image Urls' }
      ]
    });

    await csvWriter.writeRecords(records);

    res.download(outputFilePath, `output_${requestId}.csv`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Error downloading CSV file' });
      }
    });
    
  } catch (error) {
    console.error('Error generating output CSV:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadCSV,
  generateOutputCSV
};
