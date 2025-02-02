export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2); // Use Math.round() since toFixed() doesn't round numbers correctly sometimes
}

export default formatCurrency