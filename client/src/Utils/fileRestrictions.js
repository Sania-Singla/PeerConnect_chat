/**
 * Utility to restric file sizes and allowed extensions
 * @param {File} file - File to validate.
 * @param {String} name - Key name to validate accordingly.
 * @param {Function} setError - State function to set the corresponding error or an empty string "".
 */

function fileRestrictions(file, name, setError) {
    if (file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const fileSizeMB = file.size / (1024 * 1024);
        const maxSizeMB = 100;
        const allowedExtensions = ['png', 'jpg', 'jpeg'];
        if (!allowedExtensions.includes(extension) || fileSizeMB > maxSizeMB) {
            return setError((prevError) => ({
                ...prevError,
                [name]: 'only png, jpg/jpeg files are allowed and File size should not exceed 100MB.',
            }));
        }
        setError((prevError) => ({ ...prevError, [name]: '' }));
    } else {
        return 'file is missing';
    }
}

function fileSizeRestriction(file, name, setError) {
    if (file) {
        const fileSizeMB = file.size / (1024 * 1024);
        const maxSizeMB = 100;
        if (fileSizeMB > maxSizeMB) {
            return setError((prevError) => ({
                ...prevError,
                [name]: 'File size should not exceed 100MB.',
            }));
        }
        setError((prevError) => ({ ...prevError, [name]: '' }));
    } else {
        return 'file is missing';
    }
}

export { fileRestrictions, fileSizeRestriction };
