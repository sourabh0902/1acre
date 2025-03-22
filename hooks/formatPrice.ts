export const formatPrice = (price: { crore: number; lakh: number }) => {
    const parts = [];
    if (price.crore > 0) {
        parts.push(`${price.crore} Cr`);
    }
    if (price.lakh > 0) {
        parts.push(`${price.lakh} L`);
    }
    return parts.join(' ');
};