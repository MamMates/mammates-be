import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.STORAGE_KEY,
});

const uploadFileToBucket = async (bucketName, destFileName, contents) => {
  await storage.bucket(bucketName).file(destFileName).save(contents);
};

export default uploadFileToBucket;
