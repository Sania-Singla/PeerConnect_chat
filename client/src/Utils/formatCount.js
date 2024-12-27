/**
 * Formats the provided count in thousand, million, billion
 * @param {number} value - The count to format
 * @returns {string} The count fromatted in _K, _M, _B
 * @example - 1K, 10M, 4B
 */

export default function formatCount(value) {
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
