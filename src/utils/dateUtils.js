/**
 * Safely parses a date string in YYYY-MM-DD format into a Date object at local midnight.
 * This avoids timezone shifts that occur with `new Date("YYYY-MM-DD")` which is treated as UTC.
 */
export const parseYYYYMMDD = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    
    // Split the YYYY-MM-DD format
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date(dateStr); // Fallback for other formats
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed months
    const day = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
};
