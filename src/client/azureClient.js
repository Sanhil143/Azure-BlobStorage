const { BlobServiceClient } = require('@azure/storage-blob');
const router = require('express')();


const containerName = process.env.AZURE_IMAGE_CONTAINER;
const blobName = 'insert your blob here';

const connStr = process.env.AZURE_CONN_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

export default async function downloadBlob() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  try {
    const downloadBlockBlobResponse = await blobClient.download();
    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    return buffer.toString('base64'); // Return base64 encoded string
  } catch (error) {
    console.error('Error downloading blob', error.message);
    throw error; // Propagate the error
  }
}

// Helper function to convert a readable stream to a Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}