const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const fs = require('fs');

const imageFileUpload = async (image, fileNamePrefix) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_ACCOUNT_NAME,
    process.env.AZURE_ACCOUNT_KEY
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );
  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_IMAGE_CONTAINER
  );
  const imageName = `${fileNamePrefix}-${Date.now()}-${image.files.originalname}`;
  const imageContent = fs.readFileSync(image.files.path);
  const blockBlobClient = containerClient.getBlockBlobClient(imageName);
  
  try {
    const uploadBlobResponse = await blockBlobClient.upload(
      imageContent,
      imageContent.length,
      {
        blobHTTPHeaders: {
          blobContentType: "image/jpeg", // Update the content type as needed
          blobContentDisposition: "inline",
        },
      }
    );

    const blobUrl = `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_IMAGE_CONTAINER}/${imageName}`;
    return { uploadBlobResponse, blobUrl };
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};

module.exports = {imageFileUpload}