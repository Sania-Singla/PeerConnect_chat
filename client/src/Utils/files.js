import { MAX_FILE_SIZE } from '@/Constants/constants';

/**
 * Utility to restric file sizes and allowed extensions
 * @param {File} file - File to validate.
 * @param {String} name - Key name to validate accordingly.
 * @param {Function} setError - State function to set the corresponding error or an empty string "".
 */

function fileRestrictions(file) {
    if (file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const fileSizeMB = file.size / (1024 * 1024);
        const maxSizeMB = 100;
        const allowedExtensions = ['png', 'jpg', 'jpeg'];
        if (!allowedExtensions.includes(extension) || fileSizeMB > maxSizeMB) {
            return false;
        }
        return true;
    } else {
        return 'file is missing';
    }
}

/**
 * Utility to restric file sizes only
 * @param {File} file - File to validate.
 * @param {String} name - Key name to validate accordingly.
 * @param {Function} setError - State function to set the corresponding error or an empty string "".
 */

function fileSizeRestriction(file) {
    if (file) {
        const fileSizeMB = file.size / (1024 * 1024);
        // const fileType = file.type.split('/')[0];
        let maxSizeMB = MAX_FILE_SIZE;

        // switch (fileType) {
        //     case 'video':
        //     case 'image': {
        //         maxSizeMB = 100;
        //         break;
        //     }
        //     default: {
        //         maxSizeMB = 10; // raw
        //     }
        // }

        if (fileSizeMB > maxSizeMB) {
            return false;
        }
        return true;
    } else {
        return 'file is missing';
    }
}

export { fileRestrictions, fileSizeRestriction };
