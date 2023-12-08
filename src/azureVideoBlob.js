import {BlobServiceClient,StorageSharedKeyCredential} from "@azure/storage-blob";
import fs from 'fs';

export const videoFileUpload = async(video,fileNamePrefix) => {
      const sharedKeyCredential = new StorageSharedKeyCredential(
        process.env.AZURE_ACCOUNT_NAME,
        process.env.AZURE_ACCOUNT_KEY
      );
      const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
        sharedKeyCredential
      );
      const containerClient = blobServiceClient.getContainerClient(
        process.env.AZURE_VIDEO_CONTAINER
      );
      const videoName = `${fileNamePrefix}-${Date.now()}-${video.files.originalname}`;
      const videoContent = fs.readFileSync(video.files.path);
      const blockBlobClient = containerClient.getBlockBlobClient(videoName);
      try {
        const uploadBlobResponse = await blockBlobClient.upload(
          videoContent,
          videoContent.length,
          {
            blobHTTPHeaders: {
              blobContentType: "video/mp4",
              blobContentDisposition: "inline",
            },
          }
        );
        const blobUrl = `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_VIDEO_CONTAINER}/${videoName}`;
        return { uploadBlobResponse, blobUrl };
      } catch (error) {
        console.error("Error uploading video:", error.message);
        throw error;
      }
    }