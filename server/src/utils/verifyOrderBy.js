/**
 * Verify the provided orderBy is valid or not
 * @param {String} orderBy - OrderBy to verify
 * @returns true or throws an error as 'INVALID_ORDERBY_VALUE'
 */

export default function verifyOrderBy(orderBy) {
    const validOrderBy = ['ASC', 'DESC'];
    if (!validOrderBy.includes(orderBy.toUpperCase())) {
        throw new Error('INVALID_ORDERBY_VALUE');
    }
    return true;
}
