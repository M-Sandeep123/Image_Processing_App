const { Request, Product, Image } = require('../models');

const getStatus = async (req, res) => {
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

    const response = {
      requestId: requestRecord.id,
      status: requestRecord.status,
      products: requestRecord.products.map(product => ({
        serialNumber: product.serialNumber,
        productName: product.productName,
        images: product.images.map(img => ({
          inputUrl: img.inputUrl,
          outputUrl: img.outputUrl,
          status: img.status,
        })),
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching request status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStatus
};
