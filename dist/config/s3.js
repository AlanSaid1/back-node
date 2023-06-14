"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStream = exports.uploadFile = void 0;
//Alan Said Martinez Guzman A01746210
require("dotenv").config();
const fs = require("fs");
const AWS = require("aws-sdk");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
});
// uploads a file to S3
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
exports.uploadFile = uploadFile;
// downloads a file from S3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
//# sourceMappingURL=s3.js.map