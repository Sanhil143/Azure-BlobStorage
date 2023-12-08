const router = require('express')();
const downloadBlob = require('./azureClient')

router.get('/api/getBlob', async (req, res) => {
      try {
        const blobContent = await downloadBlob();
        res.send({ blobContent });
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch blob' });
      }
    });
    
module.exports = router