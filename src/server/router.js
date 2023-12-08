const router = require('express')();
const {videoFileUpload} = require('./azureVideoBlob')
const {imageFileUpload} = require('./azureImageBlob')

const fileNamePrefix = 'video'
router.post('/videoUpload', async (req, res) => {
  try {
    const videoPaths = await videoFileUpload(req.files,fileNamePrefix);
    res.send({ status: true, message: videoPaths,data });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
});

router.post('/imageUpload', async (req, res) => {
  try {
    const imagePaths = await imageFileUpload(req.files,fileNamePrefix);
    res.send({ status: true, message: imagePaths,data });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
});


module.exports = router;