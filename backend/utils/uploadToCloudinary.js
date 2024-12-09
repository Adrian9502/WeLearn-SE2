const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    console.log("Starting Cloudinary upload...");

    if (!buffer) {
      console.error("No buffer provided");
      return reject(new Error("No buffer provided for upload"));
    }

    const uploadOptions = {
      folder: "profile-pictures",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "gif", "jpeg"],
      transformation: [
        { width: 400, height: 400, crop: "limit" }, // Reduce size
        { quality: "auto:low" }, // Optimize quality
      ],
    };

    console.log("Upload options:", uploadOptions);

    const writeStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
          return;
        }
        console.log("Cloudinary upload successful:", result.secure_url);
        resolve(result);
      }
    );

    // Convert buffer to smaller chunks
    const chunkSize = 8192;
    let offset = 0;

    const sendNextChunk = () => {
      const chunk = buffer.slice(offset, offset + chunkSize);
      writeStream.write(chunk);
      offset += chunk.length;

      if (offset < buffer.length) {
        process.nextTick(sendNextChunk);
      } else {
        writeStream.end();
      }
    };

    sendNextChunk();
  });
};

module.exports = uploadToCloudinary;
