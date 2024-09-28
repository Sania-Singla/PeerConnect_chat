import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error({ message: "CLOUDIANRY_FILE_PATH_MISSING" });
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("file uploaded successfully!!", response.url);

        fs.unlinkSync(localFilePath);

        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        throw new Error({ message: `SERVER_ERROR_UPLOADING_CLOUDINARY_UTIL, err: ${err.message}` });
    }
};

const deleteFromCloudinary = async (URL) => {
    try {
        if (!URL) {
            throw new Error({ message: "CLOUDINARY_URL_MISSING" });
        }

        const publicId = URL.split("/").pop().split(".")[0];
        const resourceType = URL.split("/")[4];

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });

        return response; // {result:"ok"}
    } catch (err) {
        throw new Error({ message: `SERVER_ERROR_DELETION_CLOUDINARY_UTIL, err: ${err.message}` });
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
