import fs from 'fs';
/**
 * Generic Utility to validate the regular expressions
 * @param {String} name - Key name to validate.
 * @param {String} value - Value/File for the key.
 * @returns {Boolean} Boolean.
 */

export default function verifyRegex(name, value) {
    if (value) {
        switch (name) {
            case 'email': {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$/.test(
                    value
                );
            }

            case 'firstName':
            case 'lastName': {
                return /^[a-zA-Z]{1,15}$/.test(value);
            }

            case 'userName': {
                return /^[a-zA-Z0-9_]{1,20}$/.test(value);
            }

            case 'password':
            case 'newPassword': {
                return value.length >= 8 && value.length <= 12;
            }

            case 'bio':
            case 'title': {
                return value.length <= 100;
            }

            case 'file': {
                if (fs.existsSync(value)) {
                    try {
                        const stats = fs.statSync(value);
                        const fileSizeMB = stats.size / (1024 * 1024);
                        const maxSizeMB = 100;

                        const extension = value.split('.').pop().toLowerCase();
                        const allowedExtensions = ['png', 'jpg', 'jpeg'];

                        const isValid =
                            allowedExtensions.includes(extension) &&
                            fileSizeMB <= maxSizeMB;

                        return isValid;
                    } catch (err) {
                        console.error('Error accessing file:', err);
                        return false;
                    }
                } else {
                    console.log('File does not exist:', value);
                    return false;
                }
            }

            default: {
                console.log("Doesn't have a defined regex.", name);
                return false;
            }
        }
    } else {
        console.log('provide a value to validate');
        return false;
    }
}
