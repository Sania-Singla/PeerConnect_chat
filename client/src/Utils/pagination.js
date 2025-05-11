import { useCallback } from 'react';

/**
 * Generic Pagination Utility
 * @param {Boolean} hasNextPage - Boolean as dependency item indicating if have more results to fetch.
 * @param {Boolean} loading - Boolean indicating loading state.
 * @param {Function} setPage - State function to update the page number.
 * @returns {Function} A useCallback method to perform the page updation operation.
 */

export default function paginate(hasNextPage, loading, setPage) {
    let observer;
    return useCallback(
        (node) => {
            if (loading || !hasNextPage) return;
            if (observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                const lastElement = entries[0];
                if (lastElement.isIntersecting && hasNextPage) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.observe(node);
        },
        [loading, hasNextPage]
    );
}
