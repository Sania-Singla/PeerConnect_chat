import { format } from 'date-fns';

/**
 * format the date
 * @param {Date} date - Date to format
 * @returns {String} Formatted timeStamp
 * @example - "2024-09-23 20:25:07"
 */

export default function getCurrentTimestamp(date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}
