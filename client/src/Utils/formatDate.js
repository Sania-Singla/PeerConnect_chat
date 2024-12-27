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
 * @returns Formatted date in dd/mm/yy format
 * @example - 10/08/2019
 */

function formatDateExact(timeStamp) {
    const date = new Date(timeStamp);
    return format(date, 'dd/mm/yyyy');
}

export { formatDateRelative, formatDateExact };
