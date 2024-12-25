import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error('CLOUDIANRY_FILE_PATH_MISSING');
        }

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        console.log('file uploaded successfully.', res.url);

        fs.unlinkSync(localFilePath);

        return res;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        throw new Error(
            `error while uploading file on cloudinary, err: ${err.message}`
        );
    }
};

const deleteFromCloudinary = async (URL) => {
    try {
        if (!URL) {
            throw new Error('url missing');
        }

        const publicId = URL.split('/').pop().split('.')[0];
        const resourceType = URL.split('/')[4];

        const res = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });

        return res; // {result:"ok"}
    } catch (err) {
        throw new Error(
            `error while deleting file from cloudinary, err: ${err.message}`
        );
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
