import { formatDistanceToNow, parseISO, format } from 'date-fns';

/**
 * Formats the provided timeStamp
 * @param {TimeStamp} timeStamp - timeStamp to format
 * @returns {String} The formatted date relative to current date
 * @example - about 1 month ago
 */

function formatDateRelative(timeStamp) {
    return formatDistanceToNow(parseISO(timeStamp), { addSuffix: true });
}

/**
 * Formats the provided timeStamp
 * @param {TimeStamp} timeStamp - timeStamp to format
 * @returns {String} Formatted date in dd/MM/yyyy format
 * @example - 10/08/2019
 */

function formatDateExact(timeStamp) {
    const date = new Date(timeStamp);
    return format(date, 'dd/MM/yyyy');
}

/**
 * Formats the provided timeStamp
 * @param {TimeStamp} timeStamp - timeStamp to format
 * @returns {String} Formatted time in hh:mm a format
 * @example - 10:30 AM
 */

function formatTime(timeStamp) {
    const date = new Date(timeStamp);
    return format(date, 'hh:mm a');
}

/**
 * Formats the provided count in thousand, million, billion
 * @param {number} value - The count to format
 * @returns {string} The count fromatted in _K, _M, _B
 * @example - 1K, 10M, 4B
 */

function formatCount(value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return String(value);
    }
}

/**
 * Formats the provided size in KB, MB, GB
 * @param {Number} size - The size to format
 * @returns {String} The formatted size in KB, MB, GB
 */

function formatFileSize(size) {
    if (size < 1024) {
        return `${size} bytes`; // If size < 1KB, return size in bytes
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`; // If size < 1MB, return size in KB
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`; // If size < 1GB, return size in MB
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`; // If size > 1GB, return size in GB
    }
}

export {
    formatDateRelative,
    formatDateExact,
    formatTime,
    formatCount,
    formatFileSize,
};
