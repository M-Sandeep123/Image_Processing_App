require('dotenv').config();
const Queue = require('bull');
const axios = require('axios');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const path = require('path');
const { Op } = require('sequelize');

const { Image, Request } = require('../models');

const imageQueue = new Queue('image-processing', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

imageQueue.process(async (job, done) => {
  const { imageId, inputUrl } = job.data;
  try {
    const response = await axios({
      method: 'get',
      url: inputUrl,
      responseType: 'arraybuffer'
    });
    const inputBuffer = Buffer.from(response.data, 'binary');

    const outputBuffer = await sharp(inputBuffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    const outputFileName = `compressed_${imageId}_${Date.now()}.jpg`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `myfolder/${outputFileName}`,
      Body: outputBuffer,
      ContentType: 'image/jpeg'
    };

    const s3Result = await s3.upload(params).promise();
    const outputUrl = s3Result.Location;

    await Image.update(
      { outputUrl, status: 'completed' },
      { where: { id: imageId } }
    );

    console.log(`✅ Image ${imageId} processed successfully, uploaded as ${outputFileName}`);
    done();
  } catch (error) {
    console.error(`❌ Error processing image ${imageId}:`, error);
    await Image.update(
      { status: 'failed' },
      { where: { id: imageId } }
    );
    done(error);
  }
});

imageQueue.on('completed', async (job) => {
  console.log(`Job ${job.id} completed successfully`);

  try {
    const { requestId } = job.data;
    const pendingCount = await Image.count({
      where: {
        requestId: requestId,
        status: { [Op.in]: ['pending', 'processing'] }
      }
    });

    if (pendingCount === 0) {
      const requestRecord = await Request.findByPk(requestId);
      if (requestRecord && requestRecord.webhookUrl) {
        const payload = {
          requestId: requestId,
          status: 'completed',
          message: 'All images processed successfully',
        };

        await axios.post(requestRecord.webhookUrl, payload);
        console.log(`Webhook triggered for request ${requestId}`);
      }
    }
  } catch (err) {
    console.error(`Error triggering webhook for job ${job.id}:`, err.message);
  }
});

imageQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

console.log('🎯 Worker started and listening for image processing jobs...');
