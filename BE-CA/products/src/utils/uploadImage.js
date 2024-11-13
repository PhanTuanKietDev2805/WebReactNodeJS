const minioClient = require("../config/minIo");

const createBucket = (bucketName) => {
  minioClient.makeBucket(bucketName, "us-east-1", function (err) {
    if (err) {
      console.error("Error creating bucket:", err);
      return;
    }
    console.log("Bucket created successfully:", bucketName);
  });
};

const uploadFile = (bucketName, filePath, fileStream, callback) => {
  minioClient.putObject(bucketName, filePath, fileStream, (err, etag) => {
    if (err) {
      console.error("Error uploading file to MinIO:", err);
      callback(err);
      return;
    }
    console.log("File uploaded successfully. ETag:", etag);
    const fileUrl = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/${filePath}`;
    callback(null, etag, fileUrl);
  });
};
module.exports = { uploadFile, createBucket };
//DEMO upload

// Make a bucket called europetrip.
//   function uploadFile(bucketName, filePath, fileStream, callback) {
//     minioClient.putObject(bucketName, filePath, fileStream, (err, etag) => {
//       if (err) {
//         console.error("Error uploading file to MinIO:", err);
//         callback(err);
//         return;
//       }
//       console.log("File uploaded successfully. ETag:", etag);
//       const fileUrl = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/${filePath}`;
//       callback(null, etag, fileUrl);
//     });
//   }

//   const bucketName = "image";
//   const filePath = "test/bg.jpg";
//   const fileStream = require("fs").createReadStream("./tmp/bg.jpg");

//   uploadFile(bucketName, filePath, fileStream, (err, etag, fileUrl) => {
//     if (err) {
//       console.error("Upload failed:", err);
//       return;
//     }
//     console.log("Upload successful. ETag:", etag);
//     console.log("File URL:", fileUrl);
//   });
