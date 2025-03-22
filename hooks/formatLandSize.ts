export const formatLandSize = (landSize: {
    acres?: number | null;
    cents?: number | null;
    guntas?: number | null;
}) => {
    const parts = [];
    if (landSize?.acres && landSize.acres > 0) {
        parts.push(`${landSize.acres} Acres`);
    }
    if (landSize?.cents && landSize.cents > 0) {
        parts.push(`${landSize.cents} Cents`);
    }
    if (landSize?.guntas && landSize.guntas > 0) {
        parts.push(`${landSize.guntas} Guntas`);
    }
    return parts.length > 0 ? parts.join(', ') : '0 Acres';
};