const Minio = require("minio");
const {
  MINIO_ACCESSKEY,
  MINIO_HOST,
  MINIO_PORT,
  MINIO_SECRETKEY,
} = require("../config");

module.exports = new Minio.Client({
  endPoint: MINIO_HOST,
  port: 9000,
  useSSL: false,
  accessKey: MINIO_ACCESSKEY,
  secretKey: MINIO_SECRETKEY,
});

// module.exports = new Minio.Client({
//   endPoint: "localhost",
//   port: 9000,
//   useSSL: false,
//   accessKey: "admin1234",
//   secretKey: "123456789",
// });
